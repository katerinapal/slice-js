'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// I know it's nuts, but it's a lot easier
// to develop with ASTExplorer.net this way...
/* eslint max-lines:[2, 1000] max-len:0 */
/* eslint no-negated-condition:0 */
// for development, fork this: https://astexplorer.net/#/bk7MWWZZOR
// and log and copy/paste filteredCoverage and the plugin source
exports.default = getSliceCodeTransform;


function getSliceCodeTransform(filteredCoverage) {
  var fnMap = filteredCoverage.fnMap,
      branchMap = filteredCoverage.branchMap;

  var removedPaths = new _set2.default();
  return function sliceCodeTransform(_ref) {
    var t = _ref.types;

    return {
      visitor: {
        Program: function Program(path) {
          path.traverse({
            enter: function enter(childPath) {
              t.removeComments(childPath.node);
            }
          });
        },

        FunctionDeclaration: functionVisitor,
        FunctionExpression: functionVisitor,
        ArrowFunctionExpression: arrowFunctionVisitor,
        IfStatement: function IfStatement(path) {
          if (!isBranchCovered(branchMap, path.node)) {
            // console.log('2922')
            removedPaths.add(path);
            path.remove();
            return;
          }
          path.traverse({
            enter: function enter(childPath) {
              var key = childPath.key,
                  node = childPath.node,
                  parent = childPath.parent,
                  parentPath = childPath.parentPath;

              var otherKey = key === 'consequent' ? 'alternate' : 'consequent';
              if (skipPath()) {
                return;
              }
              var sideIsCovered = isBranchSideCovered(branchMap, key, node, parent);
              var otherSideExists = !!path.node[otherKey];
              var otherSideIsCovered = isBranchSideCovered(branchMap, otherKey, node, parent);
              if (isUncoveredAndMissingElse()) {
                handleUncoveredAndMissingElse();
              } else if (hasUncoveredSide()) {
                replaceNodeWithNodeFromParent(childPath, otherKey);
              }

              function skipPath() {
                return parentPath.removed || parentPath !== path || !(key === 'consequent' || key === 'alternate');
              }

              function isUncoveredAndMissingElse() {
                return !sideIsCovered && !otherSideExists;
              }

              function handleUncoveredAndMissingElse() {
                if (otherSideIsCovered) {
                  // if (foo) { /* not covered */ } (else-path doesn't exist but is covered) // result: removed
                  // console.log('2954')
                  path.remove();
                } else {
                  // if (foo) { /* not covered */ }
                  // (else-path doesn't exist and isn't covered)
                  // result: ... not sure :shrug:
                  // console.log('2959')
                  childPath.remove();
                }
              }

              function hasUncoveredSide() {
                // if (foo) { /* not covered */ } else { /* covered */ } // result: /* covered */
                // if (foo) { /* not covered */ } else { /* not covered */ } // result: removed
                // if (foo) { /* covered */ } (else-path doesn't exist and isn't covered) // result: /* covered */
                // if (foo) { /* covered */ } else { /* not covered */ } // result: ... not sure :shrug:
                return (!sideIsCovered || !otherSideExists) && !otherSideIsCovered || !sideIsCovered && otherSideIsCovered;
              }
            }
          });
        },
        ConditionalExpression: function ConditionalExpression(path) {
          var branchCoverageData = getBranchCoverageData(branchMap, path.node);

          if (!branchCoverageData) {
            // console.log('2981')
            path.remove();
            return;
          }
          path.traverse({
            enter: function enter(childPath) {
              var key = childPath.key;

              var otherKey = key === 'consequent' ? 'alternate' : 'consequent';
              if (!childPath.removed && childPath.parentPath === path && (key === 'consequent' || key === 'alternate') && (!branchCoverageData[key] || !branchCoverageData[key].covered)) {
                // console.log('2995')
                replaceNodeWithNodeFromParent(childPath, otherKey);
              }
            }
          });
        },
        LogicalExpression: function LogicalExpression(path) {
          var branchCoverageInfo = getLogicalExpressionBranchCoverageInfo(branchMap, path.node);
          if (!branchCoverageInfo) {
            // if there's not branch coverage info available, that could mean that this
            // LogicalExpression is part of another LogicalExpression, so we can skip this one
            return;
          }
          var nodesToPreserve = getLogicalExpressionNodesToPreserve(path, branchMap);
          // console.log(nodesToPreserve)
          path.traverse({
            enter: function enter(childPath) {
              if (childPath.parentPath !== path) {
                // we only care about direct children
                return;
              }
              if (childPath.type === 'LogicalExpression') {
                handleNestedLogicalExpression(childPath);
                return;
              }
              if (!nodesToPreserve.includes(childPath.node)) {
                var otherSideKey = childPath.key === 'left' ? 'right' : 'left';
                replaceNodeWithNodeFromParent(childPath, otherSideKey);
              }

              function handleNestedLogicalExpression(nestedExpressionPath) {
                var otherSideKey = nestedExpressionPath.key === 'left' ? 'right' : 'left';
                // if the child is a LogicalExpression, then we need to replace the parent node with only the
                // side of the expression that is covered.
                var includesLeft = isNestedLogicalExpressionIsCovered(nodesToPreserve, nestedExpressionPath.node.left);
                var includesRight = isNestedLogicalExpressionIsCovered(nodesToPreserve, nestedExpressionPath.node.right);
                if (!includesLeft && !includesRight) {
                  // if neither side is covered, then take the parent
                  // (LogicalExpression) and replace it with just the other side
                  replaceNodeWithNodeFromParent(nestedExpressionPath, otherSideKey);
                  return;
                }
                if (includesLeft && includesRight) {
                  // if both sides are covered, then don't replace the parent at all. This side is is needed
                  return; // eslint-disable-line no-useless-return
                } else if (!includesRight) {
                  // if the right isn't covered (and the left is),
                  // then just replace the whole LogicalExpression with the left
                  // console.log('3045')
                  nestedExpressionPath.replaceWith(nestedExpressionPath.node.left);
                } else {
                  // !includesLeft
                  // if the left isn't covered (and the right is),
                  // then just replace the whole LogicalExpression with the right
                  // console.log('3049')
                  nestedExpressionPath.replaceWith(nestedExpressionPath.node.right);
                }
                return; // eslint-disable-line no-useless-return
              }
            }
          });
        },
        TryStatement: function TryStatement(path) {
          var statementMap = filteredCoverage.statementMap;

          var tryBlockPath = path.get('block');
          var catchBlockPath = safeGet(path, 'handler.body');
          var finallyBlockPath = path.get('finalizer');
          var coveredTryStatements = getCoveredStatementsFromBlock(statementMap, tryBlockPath.node);
          var coveredCatchStatements = catchBlockPath ? getCoveredStatementsFromBlock(statementMap, catchBlockPath.node) : null;
          var coveredFinallyStatements = getCoveredStatementsFromBlock(statementMap, finallyBlockPath.node);
          if (coveredCatchStatements && !coveredCatchStatements.length) {
            path.replaceWithMultiple([].concat((0, _toConsumableArray3.default)(coveredTryStatements), (0, _toConsumableArray3.default)(coveredFinallyStatements)));
          } else if (coveredTryStatements.length < tryBlockPath.node.body) {
            tryBlockPath.node.body = coveredTryStatements;
          }
        },
        SwitchStatement: function SwitchStatement(path) {
          // note: SwitchStatements will always be covered.
          // the only time it isn't is if it's in a function/IfStatement/etc.
          // that isn't covered, which would be removed. So we don't need to
          // worry about checking whether the switch is covered.
          var coverageInfo = getBranchCoverageData(branchMap, path.node);
          path.get('cases').forEach(function (casePath) {
            if (!isCaseCovered(casePath.node)) {
              casePath.remove();
            }
          });
          var remainingCases = path.get('cases');
          if (remainingCases.length === 1) {
            var nodesToPreserve = remainingCases[0].node.consequent.filter(function (node) {
              return !t.isBreakStatement(node);
            });
            if (!t.isIdentifier(path.node.discriminant)) {
              path.insertBefore(path.node.discriminant);
            }
            path.replaceWithMultiple(nodesToPreserve);
          }

          function isCaseCovered(caseNode) {
            var caseLocation = coverageInfo.locations.find(function (location) {
              return isLocationEqual(location, caseNode.loc);
            });
            return !!caseLocation && caseLocation.covered;
          }
        }
      }
    };

    function arrowFunctionVisitor(path) {
      if (!isFunctionCovered(fnMap, path.node)) {
        if (isFunctionReferenced(path)) {
          // if the function is referenced, then the best we can do is clear the body
          path.addComment('leading', 'slice-js-coverage-ignore ignore next');
          path.node.body.body = [];
          return;
        }
        if (t.isAssignmentExpression(path.parentPath)) {
          path.parentPath.remove();
        } else if (path.parentPath.node.id) {
          removePathAndReferences(path, path.parentPath.node.id.name);
        } else {
          path.remove();
        }
      }
    }

    function functionVisitor(path) {
      /* eslint complexity:[2,6] */
      if (isFunctionCovered(fnMap, path.node)) {
        return;
      }
      if (shouldPreserveFunctionBody(path)) {
        // if it's detected that we should preserve the function body, then
        // we shouldn't do anything with the function except ignore coverage on it
        path.addComment('leading', 'slice-js-coverage-ignore ignore next');
      } else if (isFunctionReferenced(path)) {
        path.addComment('leading', 'slice-js-coverage-ignore ignore next');
        // if the function is referenced, then the best we can do is clear the body
        path.node.body.body = [];
      } else if (t.isAssignmentExpression(path.parentPath) || t.isFunctionExpression(path)) {
        path.parentPath.remove();
      } else {
        removePathAndReferences(path, path.node.id.name);
      }
    }

    function shouldPreserveFunctionBody(path) {
      var statementPath = path.getStatementParent();
      if (t.isReturnStatement(statementPath)) {
        // coveres `foo` in: function bar() { return function foo() {} }
        var functionParent = statementPath.getFunctionParent();
        return isFunctionCovered(fnMap, functionParent.node);
      } else {
        // TODO: cover more edge cases
        return isFunctionCovered(fnMap, path.node);
      }
    }

    function isFunctionReferenced(path) {
      if (t.isFunctionDeclaration(path)) {
        return isFunctionDeclarationReferenced();
      } else if (t.isAssignmentExpression(path.parentPath)) {
        return isFunctionExpressionReferenced();
      } else {
        return false;
      }

      function isFunctionExpressionReferenced() {
        // from here on out, we're looking for something like this:
        // foo.bar.baz = () => {}
        // // then later
        // foo.bar.baz.buzz = 'referencing baz'
        var expressionStatement = path.parentPath.findParent(t.isExpressionStatement);
        var referenceChain = buildReferenceChain(expressionStatement.get('expression.left'));
        var start = expressionStatement.get('expression.left.object');
        var binding = path.scope.getBinding(start.node.name);
        if (!binding) {
          return false;
        }
        // return whether at least one of these references is referencing the function
        return binding.referencePaths.some(function (refPath) {
          var expStatement = refPath.findParent(t.isExpressionStatement);
          if (!expStatement || !expStatement.node) {
            return false;
          }
          var memberExpression = expStatement.get('expression.left');
          if (!t.isMemberExpression(memberExpression)) {
            return false;
          }
          var refChain = buildReferenceChain(memberExpression);
          // refChain: [foo, bar, baz], referenceChain: [foo, bar] :+1:
          if (refChain < referenceChain.length) {
            return false;
          }
          // return false if the referenceChain has anything the refChain does not
          // this means the refChain can be longer
          return !refChain.every(function (ref, i) {
            var outOfElements = !referenceChain[i];
            if (outOfElements) {
              return true;
            }
            var selfReference = ref.node === referenceChain[i].node;
            var notAReference = ref.node.name !== referenceChain[i].node.name;
            return selfReference || notAReference;
          });
        });

        function buildReferenceChain(memberExpression) {
          var iterations = 0;
          var property = memberExpression.get('property');
          var object = memberExpression.get('object');
          var chain = [property];
          while (t.isMemberExpression(object)) {
            property = object.get('property');
            object = object.get('object');
            chain.push(property);
            iterations++;
            if (iterations > 10) {
              throw new Error('slice-js avoiding infinite loop in buildReferenceChain');
            }
          }
          return chain.reverse();
        }
      }

      function isFunctionDeclarationReferenced() {
        var name = path.get('id').node.name;

        path.scope.getBinding(name).referencePaths.every(function (refPath) {
          return refPath.find(function (parent) {
            return !t.isExportDefaultDeclaration(parent) && !t.isExportSpecifier(parent);
          }
          // we don't care about references to exports
          );
        });
      }
    }

    function replaceNodeWithNodeFromParent(path, key) {
      // console.log('replaceNodeWithNodeFromParent', path, key)
      var parentPath = path.parentPath,
          parent = path.parent;

      var replacementNode = parent[key] || path.node;
      if (parentPath.type === 'IfStatement') {
        // if there are side-effects in the IfStatement, then we need to preserve those
        var typesToPreserve = ['AssignmentExpression', 'CallExpression', 'UnaryExpression'];
        // these can't exist on their own and need to be wrapped in an ExpressionStatement
        var typesToWrap = ['CallExpression', 'UnaryExpression'];
        var nodesToPreserve = [];
        var testPath = parentPath.get('test');
        testPath.traverse({
          enter: function enter(testChildPath) {
            var EXIT_EARLY = 'EXIT_EARLY';
            if (testChildPath.parentPath !== testPath) {
              // we're only concerned with direct children
              return;
            }

            var result = handleLogicalExpression();
            if (result === EXIT_EARLY) {
              return;
            }
            preserveNode();

            function preserveNode() {
              if (typesToPreserve.includes(testChildPath.node.type)) {
                if (typesToWrap.includes(testChildPath.node.type)) {
                  nodesToPreserve.push(t.expressionStatement(testChildPath.node));
                } else {
                  nodesToPreserve.push(testChildPath.node);
                }
              }
            }

            function handleLogicalExpression() {
              var logicalExpressionNodesToPreserve = getLogicalExpressionNodesToPreserve(testChildPath.parentPath, branchMap);
              if (testChildPath.parent.type === 'LogicalExpression') {
                handleNestedLogicalExpression(logicalExpressionNodesToPreserve);
                if (!logicalExpressionNodesToPreserve.includes(testChildPath.node)) {
                  // if this part of the LogicalExpression is not covered, then we don't want to preserve it.
                  return EXIT_EARLY;
                }
              }
              return null;
            }

            function handleNestedLogicalExpression(coveredNodes) {
              if (testChildPath.type !== 'LogicalExpression') {
                return;
              }
              var includesLeft = isNestedLogicalExpressionIsCovered(coveredNodes, testChildPath.node.left);
              var includesRight = isNestedLogicalExpressionIsCovered(coveredNodes, testChildPath.node.right);
              // need to create an expression statement because we'll be removing the if statement
              // and this needs to be a node that can stand on its own.
              if (includesLeft && includesRight) {
                nodesToPreserve.push(t.expressionStatement(testChildPath.node));
              } else if (!includesRight) {
                nodesToPreserve.push(t.expressionStatement(testChildPath.node.left));
              } else {
                // !includesLeft
                nodesToPreserve.push(t.expressionStatement(testChildPath.node.right));
              }
            }
          }
        });
        parentPath.insertBefore(nodesToPreserve);
      }
      if (replacementNode && replacementNode.body) {
        // console.log('3213')
        parentPath.replaceWithMultiple(replacementNode.body);
      } else if (replacementNode) {
        // console.log('3216')
        parentPath.replaceWith(replacementNode);
      }
    }

    function removePathAndReferences(path, name) {
      path.scope.getBinding(name).referencePaths.forEach(function (binding) {
        /* eslint complexity:0 */ // TODO clean this up
        // console.log('removing binding', binding)
        if (t.isExportSpecifier(binding.parent)) {
          removeExportSpecifierBinding(binding);
        } else if (t.isExportNamedDeclaration(binding)) {
          // console.log('3227')
          binding.remove();
        } else if (t.isCallExpression(binding.parent)) {
          // console.log('3230')
          removeCallExpressionBinding(binding);
        } else if (t.isMemberExpression(binding.parent)) {
          // console.log('I am here')
          // TODO, get more test cases because I'm sure we'll need to actually do something here...
        } else if (t.isAssignmentExpression(binding.parent)) {
          var expressionStatement = binding.findParent(t.isExpressionStatement);
          var sequenceExpression = binding.findParent(t.isSequenceExpression);
          if (expressionStatement) {
            expressionStatement.remove();
          } else if (sequenceExpression) {
            sequenceExpression.remove();
          }
        } else if (t.isObjectProperty(binding.parent)) {
          var objectExpression = binding.parentPath.parentPath.node;
          var properties = objectExpression.properties;
          // console.log('3233')

          properties.splice(properties.indexOf(binding.parent), 1);
        } else {
          /* istanbul ignore next we have no coverage of this else... and that's the problem :) */
          console.error('path', path); // eslint-disable-line no-console
          /* istanbul ignore next */
          console.error('binding', binding); // eslint-disable-line no-console
          /* istanbul ignore next */
          throw new Error('Attempting to remove a type of binding for a path that has not yet be implemented. ' + 'Please investigate how to safely remove this binding.');
        }
      });
      // console.log('3240')
      if (path.parentPath.type === 'VariableDeclarator') {
        // console.log('3244')
        path.parentPath.remove();
      } else {
        // console.log('path remove', path)
        // console.log('3248')
        path.remove();
      }

      function removeExportSpecifierBinding(binding) {
        var specifiers = binding.parentPath.parent.specifiers;

        var specifierIndex = specifiers.indexOf(binding.parent);
        // no need to check whether index is -1. It's definitely in there.
        specifiers.splice(specifierIndex, 1);
      }

      function removeCallExpressionBinding(binding) {
        // console.log('removeCallExpressionBinding(binding)', binding)
        // console.log(binding.scope.getBinding(binding.node.name).referencePaths)
        var callPath = binding.parentPath;
        var usePath = callPath.parentPath;

        var removedNode = binding.findParent(function (parentPath) {
          return removedPaths.has(parentPath);
        });
        if (removedNode) {
          // no need to remove any children
          return;
        }
        if (usePath.type === 'LogicalExpression') {
          var otherSideOfLogicalExpressionKey = callPath.key === 'left' ? 'right' : 'left';
          // console.log('3266')
          usePath.replaceWith(usePath.node[otherSideOfLogicalExpressionKey]);
        } else if (usePath.type === 'ConditionalExpression') {
          removeConditionalExpressionSide(callPath);
        } else {
          // console.log('3269', usePath.getSource(), usePath)
          usePath.remove();
        }
      }

      function removeConditionalExpressionSide(condPath) {
        var key = condPath.key;

        var otherKey = key === 'consequent' ? 'alternate' : 'consequent';
        if (!condPath.removed && condPath.parentPath === path && (key === 'consequent' || key === 'alternate')) {
          // console.log('3266')
          replaceNodeWithNodeFromParent(condPath, otherKey);
        }
      }
    }
  };
}

function getFunctionCoverageData(fnLocs, _ref2) {
  var srcLoc = _ref2.body.loc;

  var fnCov = (0, _keys2.default)(fnLocs).map(function (key) {
    return fnLocs[key];
  }).find(function (_ref3) {
    var loc = _ref3.loc;
    return isLocationEqual(loc, srcLoc);
  });
  return fnCov;
}

function isFunctionCovered(fnLocs, node) {
  return !!getFunctionCoverageData(fnLocs, node);
}

function isBranchCovered(branches, node) {
  var branchCoverageData = getBranchCoverageData(branches, node);
  return !!branchCoverageData;
}

function getBranchCoverageData(branches, node) {
  var typeMap = {
    if: 'IfStatement',
    'cond-expr': 'ConditionalExpression',
    'binary-expr': 'LogicalExpression',
    switch: 'SwitchStatement'
  };
  var index = (0, _keys2.default)(branches).find(function (key) {
    var branch = branches[key];
    if (typeMap[branch.type] !== node.type) {
      return false;
    }
    return isLocationEqual(branch.loc, node.loc);
  });
  return branches[index];
}

function isBranchSideCovered(branches, side, node, parentNode) {
  var branch = getBranchCoverageData(branches, parentNode);
  if (!branch || !branch[side]) {
    return false;
  }
  return branch[side].covered;
}

function getLogicalExpressionBranchCoverageInfo(branches, node) {
  return (0, _keys2.default)(branches).map(function (key) {
    return branches[key];
  }).filter(function (branch) {
    return branch.type === 'binary-expr';
  }).find(function (branch) {
    return isLocationEqual(node.loc, branch.loc);
  });
}

function isNestedLogicalExpressionIsCovered(coveredNodes, node) {
  if (node.type === 'LogicalExpression') {
    return isNestedLogicalExpressionIsCovered(coveredNodes, node.left) || isNestedLogicalExpressionIsCovered(coveredNodes, node.right);
  } else {
    return coveredNodes.includes(node);
  }
}

function isLocationEqual(loc1, loc2) {
  if (!loc1 || !loc2) {
    return false;
  }
  var isEqual = isLineColumnEqual(loc1.start, loc2.start) && isLineColumnEqual(loc1.end, loc2.end);
  return isEqual;
}

function isLineColumnEqual(obj1, obj2) {
  return obj1.line === obj2.line && obj1.column === obj2.column;
}

function getCoveredStatementsFromBlock(coveredStatements, blockNode) {
  if (!blockNode) {
    return [];
  }
  return blockNode.body.reduce(function (allStatements, statement) {
    if (isStatementCovered(coveredStatements, statement)) {
      allStatements.push(statement);
    }
    return allStatements;
  }, []);
}

function isStatementCovered(coveredStatements, statement) {
  return (0, _keys2.default)(coveredStatements).find(function (s) {
    var coveredLoc = coveredStatements[s];
    return isLocationEqual(coveredLoc, statement.loc);
  });
}

function getLogicalExpressionNodesToPreserve(path, branchMap) {
  var branchCoverageInfo = getLogicalExpressionBranchCoverageInfo(branchMap, path.node);
  // console.log('branchCoverageInfo', branchCoverageInfo)
  if (!branchCoverageInfo) {
    // if there's not branch coverage info available, that could mean that this
    // LogicalExpression is part of another LogicalExpression, so we can skip this one
    return null;
  }
  var nodesToPreserve = [];
  path.traverse({
    enter: function enter(childPath) {
      var location = branchCoverageInfo.locations.find(function (loc) {
        return isLocationEqual(loc, childPath.node.loc);
      });
      if (location && location.covered) {
        nodesToPreserve.push(childPath.node);
      }
    }
  });
  return nodesToPreserve;
}

function safeGet(path, getPath) {
  try {
    return path.get(getPath);
  } catch (e) {
    return null;
  }
}
module.exports = exports.default;