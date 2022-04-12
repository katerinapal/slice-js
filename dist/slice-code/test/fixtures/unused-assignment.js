'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortRankedItems = exports.dependencies = exports.unusedAssignment = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.unusedAssignment = unusedAssignment;
exports.dependencies = dependencies;
exports.sortRankedItems = sortRankedItems;


function unusedAssignment(a, b, c) {
  var aIndex = a.index;
  var bIndex = b.index;
  var index = c.index;

  return aIndex > bIndex ? 'aIndex' : bIndex > index ? 'bIndex' : 'c.index';
}

function dependencies(foo, bar) {
  var _foo = (0, _slicedToArray3.default)(foo, 1),
      firstFoo = _foo[0];

  var _bar = (0, _slicedToArray3.default)(bar, 1),
      firstBar = _bar[0];

  var foobar = firstFoo === firstBar;
  if (foobar) {
    return 'same';
  } else {
    return 'different';
  }
}

function sortRankedItems(a, b) {
  var aRank = a.rank;

  var bRank = b.rank;

  var same = aRank === bRank;
  if (same) {
    return 'same';
  } else {
    return 'not same';
  }
}