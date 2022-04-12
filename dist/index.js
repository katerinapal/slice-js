'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var sliceTest = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(filename, tester) {
    var sourceCode, _ref2, slicedCode;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sourceCode = _fs2.default.readFileSync(filename, 'utf8');
            _context.next = 3;
            return getSliceAndInfo(sourceCode, tester, filename);

          case 3:
            _ref2 = _context.sent;
            slicedCode = _ref2.slicedCode;
            return _context.abrupt('return', slicedCode);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function sliceTest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//backwards compatibility with ES6
var _require = require('./slice-code/test/helpers/utils.js'),
    getSliceAndInfo = _require.getSliceAndInfo;

exports.default = sliceTest;
module.exports = exports.default;