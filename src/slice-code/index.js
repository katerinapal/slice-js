import * as babel from 'babel-core'
import deadCodeElimination from 'babel-plugin-minify-dead-code-elimination'
import customDeadCodeElimination from './babel-plugin-custom-dead-code-elimination'
import transformCoverage from './transform-coverage'

export default sliceCode

function sliceCode(sourceCode, coverageData) {
  const {path: filename} = coverageData
  // console.log('coverageData', JSON.stringify(coverageData, null, 2))
  const filteredCoverage = transformCoverage(coverageData)
  // console.log('filteredCoverage', JSON.stringify(filteredCoverage, null, 2))
  // console.log('\n\n\n\nsourceCode\n', sourceCode)
  const sliced = babel.transform(sourceCode, {
    filename,
    comments: false,
    babelrc: false,
    plugins: [
      getSliceCodeTransform(filteredCoverage),
    ],
  })
  // console.log('sliced', sliced.code)
  // TODO: perf - save time parsing by just transforming the AST from the previous run
  // This will probably significantly speed things up.
  // Unfortunately, when I tried the first time, I couldn't get it working :shrug:
  // console.log('deadCodeEliminated', deadCodeEliminated)
  const {code: deadCodeEliminated} = babel.transform(sliced.code, {
    filename,
    babelrc: false,
    plugins: [
      deadCodeElimination,
      customDeadCodeElimination,
    ],
  })
  // console.log('deadCodeEliminated', deadCodeEliminated)
  return deadCodeEliminated
}

function getSliceCodeTransform(filteredCoverage) {
  const {fnMap} = filteredCoverage
  const removedPaths = new Set()
  return function sliceCodeTransform({types: t}) {
    return {
      visitor: {
        FunctionDeclaration(path) {
          if (!isFunctionCovered(fnMap, path.node)) {
            removePathAndReferences(path, path.node.id.name, removedPaths)
          }
        },
        ArrowFunctionExpression(path) {
          if (!isFunctionCovered(fnMap, path.node)) {
            removePathAndReferences(path, path.parentPath.node.id.name, removedPaths)
          }
        },
        IfStatement(path) {
          const {branchMap} = filteredCoverage
          if (!isBranchCovered(branchMap, path.node)) {
            // console.log('2922')
            removedPaths.add(path)
            path.remove()
            return
          }
          path.traverse({
            enter(childPath) {
              const {key, node, parent, parentPath} = childPath
              const otherKey = key === 'consequent' ? 'alternate' : 'consequent'
              if (skipPath()) {
                return
              }
              const sideIsCovered = isBranchSideCovered(branchMap, key, node, parent)
              const otherSideExists = !!path.node[otherKey]
              const otherSideIsCovered = isBranchSideCovered(branchMap, otherKey, node, parent)
              if (isUncoveredAndMissingElse()) {
                handleUncoveredAndMissingElse()
              } else if (hasUncoveredSide()) {
                replaceNodeWithNodeFromParent(childPath, otherKey, branchMap, t)
              }

              function skipPath() {
                return parentPath.removed || parentPath !== path || !(key === 'consequent' || key === 'alternate')
              }

              function isUncoveredAndMissingElse() {
                return !sideIsCovered && !otherSideExists
              }

              function handleUncoveredAndMissingElse() {
                if (otherSideIsCovered) {
                  // if (foo) { /* not covered */ } (else-path doesn't exist but is covered) // result: removed
                  // console.log('2954')
                  path.remove()
                } else {
                  // if (foo) { /* not covered */ } // (else-path doesn't exist and isn't covered) // result: ... not sure :shrug:
                  // console.log('2959')
                  childPath.remove()
                }
              }

              function hasUncoveredSide() {
                // if (foo) { /* not covered */ } else { /* covered */ } // result: /* covered */
                // if (foo) { /* not covered */ } else { /* not covered */ } // result: removed
                // if (foo) { /* covered */ } (else-path doesn't exist and isn't covered) // result: /* covered */
                // if (foo) { /* covered */ } else { /* not covered */ } // result: ... not sure :shrug:
                return (
                  (!sideIsCovered || !otherSideExists) && !otherSideIsCovered
                ) || !sideIsCovered && otherSideIsCovered
              }
            },
          })
        },
        ConditionalExpression(path) {
          const {branchMap} = filteredCoverage
          const branchCoverageData = getBranchCoverageData(branchMap, path.node)

          if (!branchCoverageData) {
            // console.log('2981')
            path.remove()
            return
          }
          path.traverse({
            enter(childPath) {
              const {key} = childPath
              const otherKey = key === 'consequent' ? 'alternate' : 'consequent'
              if (
                !childPath.removed &&
                childPath.parentPath === path &&
                (key === 'consequent' || key === 'alternate') &&
                !branchCoverageData[key].covered
              ) {
                // console.log('2995')
                replaceNodeWithNodeFromParent(childPath, otherKey, branchMap, t)
              }
            },
          })
        },
        LogicalExpression(path) {
          const {branchMap} = filteredCoverage
          const branchCoverageInfo = getLogicalExpressionBranchCoverageInfo(branchMap, path.node)
          if (!branchCoverageInfo) {
            // if there's not branch coverage info available, that could mean that this
            // LogicalExpression is part of another LogicalExpression, so we can skip this one
            return
          }
          const nodesToPreserve = getLogicalExpressionNodesToPreserve(path, branchMap)
          // console.log(nodesToPreserve)
          path.traverse({
            enter(childPath) {
              if (childPath.parentPath !== path) {
                // we only care about direct children
                return
              }
              if (childPath.type === 'LogicalExpression') {
                handleNestedLogicalExpression(childPath)
                return
              }
              if (!nodesToPreserve.includes(childPath.node)) {
                const otherSideKey = childPath.key === 'left' ? 'right' : 'left'
                replaceNodeWithNodeFromParent(childPath, otherSideKey, branchMap, t)
              }

              function handleNestedLogicalExpression(nestedExpressionPath) {
                const otherSideKey = nestedExpressionPath.key === 'left' ? 'right' : 'left'
                // if the child is a LogicalExpression, then we need to replace the parent node with only the
                // side of the expression that is covered.
                const includesLeft = isNestedLogicalExpressionIsCovered(nodesToPreserve, nestedExpressionPath.node.left)
                const includesRight = isNestedLogicalExpressionIsCovered(nodesToPreserve, nestedExpressionPath.node.right)
                if (!includesLeft && !includesRight) {
                  // if neither side is covered, then take the parent (LogicalExpression) and replace it with just the other side
                  replaceNodeWithNodeFromParent(nestedExpressionPath, otherSideKey, branchMap, t)
                  return
                }
                if (includesLeft && includesRight) {
                  // if both sides are covered, then don't replace the parent at all. This side is is needed
                  return
                } else if (!includesRight) { // eslint-disable-line no-negated-condition
                  // if the right isn't covered (and the left is), then just replace the whole LogicalExpression with the left
                  // console.log('3045')
                  nestedExpressionPath.replaceWith(nestedExpressionPath.node.left)
                } else { // !includesLeft
                  // if the left isn't covered (and the right is), then just replace the whole LogicalExpression with the right
                  // console.log('3049')
                  nestedExpressionPath.replaceWith(nestedExpressionPath.node.right)
                }
                return
              }
            },
          })
        },
        TryStatement(path) {
          const {statementMap} = filteredCoverage
          const tryBlockPath = path.get('block')
          const catchBlockPath = path.get('handler.body')
          const finallyBlockPath = path.get('finalizer')
          const coveredTryStatements = getCoveredStatementsFromBlock(statementMap, tryBlockPath.node)
          const coveredCatchStatements = getCoveredStatementsFromBlock(statementMap, catchBlockPath.node)
          const coveredFinallyStatements = getCoveredStatementsFromBlock(statementMap, finallyBlockPath.node)
          if (!coveredCatchStatements.length) {
            path.replaceWithMultiple([
              ...coveredTryStatements,
              ...coveredFinallyStatements,
            ])
          } else if (coveredTryStatements.length < tryBlockPath.node.body) {
            tryBlockPath.node.body = coveredTryStatements
          }
        },
      },
    }
  }
}

function isFunctionCovered(fnLocs, {body: {loc: srcLoc}}) {
  const fnCov = Object.keys(fnLocs)
    .map(key => fnLocs[key])
    .find(({loc}) => isLocationEqual(loc, srcLoc))
  return fnCov
}

function isBranchCovered(branches, node) {
  const branchCoverageData = getBranchCoverageData(branches, node)
  return !!branchCoverageData
}

function getBranchCoverageData(branches, node) {
  const index = Object.keys(branches).find(key => {
    const branch = branches[key]
    if (branch.type === 'if' && node.type !== 'IfStatement') {
      return false
    } else if (branch.type === 'cond-expr' && node.type !== 'ConditionalExpression') {
      return false
    } else if (branch.type === 'binary-expr' && node.type !== 'LogicalExpression') {
      return false
    }
    return isLocationEqual(branch.loc, node.loc)
  })
  return branches[index]
}

function isBranchSideCovered(branches, side, node, parentNode) {
  const branch = getBranchCoverageData(branches, parentNode)
  if (!branch) {
    return false
  }
  return branch[side].covered
}

function getLogicalExpressionBranchCoverageInfo(branches, node) {
  return Object.keys(branches)
    .map(key => branches[key])
    .filter(branch => branch.type === 'binary-expr')
    .find(branch => isLocationEqual(node.loc, branch.loc))
}

function isNestedLogicalExpressionIsCovered(coveredNodes, node) {
  if (node.type === 'LogicalExpression') {
    return isNestedLogicalExpressionIsCovered(coveredNodes, node.left) ||
      isNestedLogicalExpressionIsCovered(coveredNodes, node.right)
  } else {
    return coveredNodes.includes(node)
  }
}

function isLocationEqual(loc1, loc2) {
  if (!loc1 || !loc2) {
    return false
  }
  const isEqual = isLineColumnEqual(loc1.start, loc2.start) &&
    isLineColumnEqual(loc1.end, loc2.end)
  return isEqual
}

function isLineColumnEqual(obj1, obj2) {
  return obj1.line === obj2.line && obj1.column === obj2.column
}

function getCoveredStatementsFromBlock(coveredStatements, blockNode) {
  if (!blockNode) {
    return []
  }
  return blockNode.body.reduce((allStatements, statement) => {
    if (isStatementCovered(coveredStatements, statement)) {
      allStatements.push(statement)
    }
    return allStatements
  }, [])
}

function isStatementCovered(coveredStatements, statement) {
  return Object.keys(coveredStatements).find(s => {
    const coveredLoc = coveredStatements[s]
    return isLocationEqual(coveredLoc, statement.loc)
  })
}

function getLogicalExpressionNodesToPreserve(path, branchMap) {
  const branchCoverageInfo = getLogicalExpressionBranchCoverageInfo(branchMap, path.node)
  // console.log('branchCoverageInfo', branchCoverageInfo)
  if (!branchCoverageInfo) {
    // if there's not branch coverage info available, that could mean that this
    // LogicalExpression is part of another LogicalExpression, so we can skip this one
    return null
  }
  const nodesToPreserve = []
  path.traverse({
    enter(childPath) {
      const location = branchCoverageInfo.locations.find(loc => isLocationEqual(loc, childPath.node.loc))
      if (location && location.covered) {
        nodesToPreserve.push(childPath.node)
      }
    },
  })
  return nodesToPreserve
}

function replaceNodeWithNodeFromParent(path, key, branchMap, t) {
  // console.log('replaceNodeWithNodeFromParent', path, key)
  const {parentPath, parent} = path
  const replacementNode = parent[key] || path.node
  if (parentPath.type === 'IfStatement') {
    // if there are side-effects in the IfStatement, then we need to preserve those
    const typesToPreserve = ['AssignmentExpression', 'CallExpression', 'UnaryExpression']
    const typesToWrap = ['CallExpression', 'UnaryExpression'] // these can't exist on their own and need to be wrapped in an ExpressionStatement
    const nodesToPreserve = []
    const testPath = parentPath.get('test')
    testPath.traverse({
      enter(testChildPath) {
        const EXIT_EARLY = 'EXIT_EARLY'
        if (testChildPath.parentPath !== testPath) {
          // we're only concerend with direct children
          return
        }

        const result = handleLogicalExpression()
        if (result === EXIT_EARLY) {
          return
        }
        preserveNode()

        function preserveNode() {
          if (typesToPreserve.includes(testChildPath.node.type)) {
            if (typesToWrap.includes(testChildPath.node.type)) {
              nodesToPreserve.push(t.expressionStatement(testChildPath.node))
            } else {
              nodesToPreserve.push(testChildPath.node)
            }
          }
        }

        function handleLogicalExpression() {
          const logicalExpressionNodesToPreserve = getLogicalExpressionNodesToPreserve(testChildPath.parentPath, branchMap)
          if (testChildPath.parent.type === 'LogicalExpression') {
            handleNestedLogicalExpression(logicalExpressionNodesToPreserve)
            if (!logicalExpressionNodesToPreserve.includes(testChildPath.node)) {
              // if this part of the LogicalExpression is not covered, then we don't want to preserve it.
              return EXIT_EARLY
            }
          }
          return null
        }

        function handleNestedLogicalExpression(coveredNodes) {
          if (testChildPath.type !== 'LogicalExpression') {
            return
          }
          const includesLeft = isNestedLogicalExpressionIsCovered(coveredNodes, testChildPath.node.left)
          const includesRight = isNestedLogicalExpressionIsCovered(coveredNodes, testChildPath.node.right)
          // need to create an expression statement because we'll be removing the if statement
          // and this needs to be a node that can stand on its own.
          if (includesLeft && includesRight) {
            nodesToPreserve.push(t.expressionStatement(testChildPath.node))
          } else if (!includesRight) { // eslint-disable-line no-negated-condition
            nodesToPreserve.push(t.expressionStatement(testChildPath.node.left))
          } else { // !includesLeft
            nodesToPreserve.push(t.expressionStatement(testChildPath.node.right))
          }
        }
      },
    })
    parentPath.insertBefore(nodesToPreserve)
  }
  if (replacementNode && replacementNode.body) {
    // console.log('3213')
    parentPath.replaceWithMultiple(replacementNode.body)
  } else if (replacementNode) {
    // console.log('3216')
    parentPath.replaceWith(replacementNode)
  }
}

function removePathAndReferences(path, name, removedPaths) {
  path.scope.getBinding(name).referencePaths.forEach(binding => {
    // console.log('removing binding', binding)
    if (binding.parent.type === 'ExportSpecifier') {
      removeExportSpecifierBinding(binding)
    } else if (binding.type === 'ExportNamedDeclaration') {
      // console.log('3227')
      binding.remove()
    } else if (binding.parent.type === 'CallExpression') {
      // console.log('3230')
      removeCallExpressionBinding(binding, removedPaths)
    } else {
      /* istanbul ignore next we have no coverage of this else... and that's the problem :) */
      console.error('path', path) // eslint-disable-line no-console
      /* istanbul ignore next */
      console.error('binding', binding) // eslint-disable-line no-console
      /* istanbul ignore next */
      throw new Error(
        'Attempting to remove a type of binding for a path that has not yet be implemented. ' +
        'Please investigate how to safely remove this binding.'
      )
    }
  })
  if (path.parentPath.type === 'VariableDeclarator') {
    // console.log('3244')
    path.parentPath.remove()
  } else {
    // console.log('path remove', path)
    // console.log('3248')
    path.remove()
  }

  function removeExportSpecifierBinding(binding) {
    const {parentPath: {parent: {specifiers}}} = binding
    const specifierIndex = specifiers.indexOf(binding.parent)
    // no need to check whether index is -1. It's definitely in there.
    specifiers.splice(specifierIndex, 1)
  }

  function removeCallExpressionBinding(binding, removedNodes) {
    // console.log('removeCallExpressionBinding(binding)', binding)
    // console.log(binding.scope.getBinding(binding.node.name).referencePaths)
    const {parentPath: callPath} = binding
    const {parentPath: usePath} = callPath
    const removedNode = binding.findParent(parentPath => removedNodes.has(parentPath))
    if (removedNode) {
      // no need to remove any children
      return
    }
    if (usePath.type === 'LogicalExpression') {
      const otherSideOfLogicalExpressionKey = callPath.key === 'left' ? 'right' : 'left'
      // console.log('3266')
      usePath.replaceWith(usePath.node[otherSideOfLogicalExpressionKey])
    } else {
      // console.log('3269', usePath.getSource(), usePath)
      usePath.remove()
    }
  }
}
