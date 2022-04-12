'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var sliceTest = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(filename, tester) {
    var sourceCode, _ref2, slicedCode;

    return regeneratorRuntime.wrap(function _callee$(_context) {
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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//backwards compatibility with ES6
var _require = require('./slice-code/test/helpers/utils.js'),
    getSliceAndInfo = _require.getSliceAndInfo;

exports.default = sliceTest;
module.exports = exports.default;