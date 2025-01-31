import _ from 'lodash'

export default filterToRunStatementsFunctionsAndBranches
export {filterToRunStatementsFunctionsAndBranchesC}

function filterToRunStatementsFunctionsAndBranches(coverageData) {
  const clone = _.cloneDeep(coverageData)
  clone.s = filterToRunCodeOnly(clone.s)
  clone.f = filterToRunCodeOnly(clone.f)
  clone.b = filterToRunCodeOnly(clone.b)
  clone.statementMap = filterMapToRunOnly(clone.statementMap, clone.s)
  clone.fnMap = filterMapToRunOnly(clone.fnMap, clone.f)
  clone.branchMap = filterMapToRunOnly(clone.branchMap, clone.b)
  clone.branchMap = annotateBranches(clone.branchMap, clone.b)
  return clone
}

function filterToRunStatementsFunctionsAndBranchesC(coverageData) {
  const clone = _.cloneDeep(coverageData)
  clone.s = filterToRunCodeOnlyC(clone.s)
  clone.f = filterToRunCodeOnlyC(clone.f)
  clone.b = filterToRunCodeOnlyC(clone.b)
  clone.statementMap = filterMapToRunOnlyC(clone.statementMap, clone.s)
  clone.fnMap = filterMapToRunOnlyC(clone.fnMap, clone.f)
  clone.branchMap = filterMapToRunOnlyC(clone.branchMap, clone.b)
  clone.branchMap = annotateBranchesC(clone.branchMap, clone.b)
  return clone
}

function filterToRunCodeOnly(obj) {
  return _.reduce(
    obj,
    (newObj, val, key) => {
      if (isRunBranch(val) || (_.isNumber(val) && val !== 0)) {
        newObj[key] = val
      }
      return newObj
    },
    {},
  )
}

function filterToRunCodeOnlyC(obj) {
  return _.reduce(
    obj,
    (newObj, val, key) => {
      if (isRunBranch(val) || (_.isNumber(val) && val !== 0)) {
        newObj[key] = val
      }
      return newObj
    },
    {},
  )
}

function isRunBranch(val) {
  return Array.isArray(val) && val.some(i => !!i)
}

function filterMapToRunOnly(map, indexesRun) {
  return Object.keys(indexesRun).reduce((newObj, indexRun) => {
    newObj[indexRun] = map[indexRun]
    return newObj
  }, {})
}

function filterMapToRunOnlyC(map, indexesRun) {
  return Object.keys(indexesRun).reduce((newObj, indexRun) => {
    newObj[indexRun] = map[indexRun]
    return newObj
  }, {})
}

function annotateBranches(branchMap, branchesRun) {
  const clone = _.cloneDeep(branchMap)
  _.forEach(clone, (branch, key) => {
    const run = branchesRun[key]
    branch.locations.forEach((location, index) => {
      location.covered = run[index] > 0
    })
    // binary expressions don't have a concept of consequent or alternate
    if (branch.type !== 'binary-expr') {
      const [conLoc, altLoc] = branch.locations
      branch.consequent = {covered: run[0] > 0, loc: conLoc}
      branch.alternate = {covered: run[1] > 0, loc: altLoc}
    }
  })
  return clone
}

function annotateBranchesC(branchMap, branchesRun) {
  const clone = _.cloneDeep(branchMap)
  _.forEach(clone, (branch, key) => {
    const run = branchesRun[key]
    branch.locations.forEach((location, index) => {
      location.covered = run[index] > 0
    })
    // binary expressions don't have a concept of consequent or alternate
    if (branch.type !== 'binary-expr') {
      const [conLoc, altLoc] = branch.locations
      branch.consequent = {covered: run[0] > 0, loc: conLoc}
      branch.alternate = {covered: run[1] > 0, loc: altLoc}
    }
  })
  return clone
}
