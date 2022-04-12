'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = filterToRunStatementsFunctionsAndBranches;


function filterToRunStatementsFunctionsAndBranches(coverageData) {
  var clone = _lodash2.default.cloneDeep(coverageData);
  clone.s = filterToRunCodeOnly(clone.s);
  clone.f = filterToRunCodeOnly(clone.f);
  clone.b = filterToRunCodeOnly(clone.b);
  clone.statementMap = filterMapToRunOnly(clone.statementMap, clone.s);
  clone.fnMap = filterMapToRunOnly(clone.fnMap, clone.f);
  clone.branchMap = filterMapToRunOnly(clone.branchMap, clone.b);
  clone.branchMap = annotateBranches(clone.branchMap, clone.b);
  return clone;
}

function filterToRunCodeOnly(obj) {
  return _lodash2.default.reduce(obj, function (newObj, val, key) {
    if (isRunBranch(val) || _lodash2.default.isNumber(val) && val !== 0) {
      newObj[key] = val;
    }
    return newObj;
  }, {});
}

function isRunBranch(val) {
  return Array.isArray(val) && val.some(function (i) {
    return !!i;
  });
}

function filterMapToRunOnly(map, indexesRun) {
  return Object.keys(indexesRun).reduce(function (newObj, indexRun) {
    newObj[indexRun] = map[indexRun];
    return newObj;
  }, {});
}

function annotateBranches(branchMap, branchesRun) {
  var clone = _lodash2.default.cloneDeep(branchMap);
  _lodash2.default.forEach(clone, function (branch, key) {
    var run = branchesRun[key];
    branch.locations.forEach(function (location, index) {
      location.covered = run[index] > 0;
    });
    // binary expressions don't have a concept of consequent or alternate
    if (branch.type !== 'binary-expr') {
      var _branch$locations = _slicedToArray(branch.locations, 2),
          conLoc = _branch$locations[0],
          altLoc = _branch$locations[1];

      branch.consequent = { covered: run[0] > 0, loc: conLoc };
      branch.alternate = { covered: run[1] > 0, loc: altLoc };
    }
  });
  return clone;
}
module.exports = exports.default;