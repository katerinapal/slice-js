'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSliceAndInfo = exports.snapSliceCode = exports.runAllCombosTests = exports.snapSlice = exports.comboOfItems = exports.comboOfBools = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _from = require('babel-runtime/core-js/array/from');

var _from2 = _interopRequireDefault(_from);

var getSliceAndInfo = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(sourceCode, tester, actualFilepath) {
    var tempFilename, mod, originalResult, coverageData, slicedCode, filteredCoverage, _ref4, isSlicedCoverage100, slicedResult;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            tempFilename = './temp-sliced.' + (0, _lodash.random)(1, 9999999999999) + '.js';
            mod = getInstrumentedModuleFromString(tempFilename, sourceCode, actualFilepath);
            _context2.next = 4;
            return tester(mod);

          case 4:
            originalResult = _context2.sent;

            // console.log('originalResult', originalResult)
            coverageData = mod[coverageVariable][tempFilename];
            slicedCode = (0, _2.default)(sourceCode, coverageData);
            filteredCoverage = (0, _transformCoverage2.default)(coverageData);
            // console.log('slicedCode', slicedCode)

            _context2.next = 10;
            return slicedCoverageIs100(tempFilename, slicedCode, tester, actualFilepath);

          case 10:
            _ref4 = _context2.sent;
            isSlicedCoverage100 = _ref4.is100;
            slicedResult = _ref4.slicedResult;
            return _context2.abrupt('return', {
              mod: mod,
              originalResult: originalResult,
              slicedCode: slicedCode,
              isSlicedCoverage100: isSlicedCoverage100,
              slicedResult: slicedResult,
              filteredCoverage: filteredCoverage
            });

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getSliceAndInfo(_x, _x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();

var slicedCoverageIs100 = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(filename, slicedCode, tester, actualFilepath) {
    var mod, slicedResult, is100, coverageIs100Percent;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            coverageIs100Percent = function coverageIs100Percent(coverageData) {
              var cov = coverageData[filename];
              var functions100 = (0, _keys2.default)(cov.f).every(function (k) {
                return cov.f[k] > 0;
              });
              var statements100 = (0, _keys2.default)(cov.s).every(function (k) {
                return cov.s[k] > 0;
              });
              var branches100 = (0, _keys2.default)(cov.b).every(function (k) {
                return cov.b[k][0] > 0 && cov.b[k][1] > 0;
              });
              return functions100 && statements100 && branches100;
            };

            mod = getInstrumentedModuleFromString(filename, slicedCode, actualFilepath);
            _context3.next = 4;
            return tester(mod);

          case 4:
            slicedResult = _context3.sent;

            /*
            process.stdout.write(
              `\n\nmod[coverageVariable][filename].s\n\n${
                JSON.stringify(mod[coverageVariable][filename].s, null, 2)}`,
            )
            /* */
            is100 = coverageIs100Percent(mod[coverageVariable]);
            return _context3.abrupt('return', { slicedResult: slicedResult, is100: is100 });

          case 7:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function slicedCoverageIs100(_x4, _x5, _x6, _x7) {
    return _ref7.apply(this, arguments);
  };
}();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _module = require('module');

var _module2 = _interopRequireDefault(_module);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _combs = require('combs');

var _combs2 = _interopRequireDefault(_combs);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _istanbulLibInstrument = require('istanbul-lib-instrument');

var _lodash = require('lodash');

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

var _transformCoverage = require('../../transform-coverage');

var _transformCoverage2 = _interopRequireDefault(_transformCoverage);

var _ = require('../..');

var _2 = _interopRequireDefault(_);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
var coverageVariable = '____sliceCoverage____';

exports.comboOfBools = comboOfBools;
exports.comboOfItems = comboOfItems;
exports.snapSlice = snapSlice;
exports.runAllCombosTests = runAllCombosTests;
exports.snapSliceCode = snapSliceCode;
exports.getSliceAndInfo = getSliceAndInfo;


function comboOfBools(n) {
  var len = (Math.pow(2, n) - 1).toString(2).length;
  var result = [];
  for (var i = 0; i < Math.pow(2, n); i++) {
    var val = i.toString(2);
    var missing = len - val.length;
    result.push((0, _from2.default)({ length: missing }).map(function () {
      return false;
    }).concat((0, _from2.default)(val).map(function (v) {
      return v === '1';
    })));
  }
  return result;
}

/**
 * @param  {Array} items the items to get combinations for
 * @return {Array} an array of arrays of the possible combination of those items
 */
function comboOfItems(items) {
  if (items.length < 2) {
    return [items];
  }
  var combos = [];
  items.forEach(function (item, index) {
    var firstHalf = items.slice(0, index);
    var secondHalf = items.slice(index + 1);
    var remainingCombos = comboOfItems([].concat((0, _toConsumableArray3.default)(firstHalf), (0, _toConsumableArray3.default)(secondHalf)));
    remainingCombos.forEach(function (combo) {
      combos.push([item].concat((0, _toConsumableArray3.default)(combo)));
    });
  });
  return combos;
}

function snapSlice(relativePath, tester) {
  var absolutePath = require.resolve(relativePath);
  var sourceCode = _fs2.default.readFileSync(absolutePath, 'utf8');
  return snapSliceCode(sourceCode, tester, absolutePath);
}

function snapSliceCode(sourceCode, tester, actualFilepath) {
  var _this = this;

  // the function returned here is what you'd
  // place in a call to Jest's `test` function
  return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var _ref2, originalResult, slicedCode, isSlicedCoverage100, slicedResult;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getSliceAndInfo(sourceCode, tester, actualFilepath);

          case 2:
            _ref2 = _context.sent;
            originalResult = _ref2.originalResult;
            slicedCode = _ref2.slicedCode;
            isSlicedCoverage100 = _ref2.isSlicedCoverage100;
            slicedResult = _ref2.slicedResult;

            expect(slicedCode).toMatchSnapshot();
            expect(isSlicedCoverage100).toBe(true, 'coverage should be 100%');
            expect(originalResult).toEqual(slicedResult, 'originalResult should be the same as the slicedResult');

          case 10:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));
}

function runAllCombosTests(_ref5) {
  var filename = _ref5.filename,
      methods = _ref5.methods;

  methods.forEach(function (_ref6) {
    var methodName = _ref6.methodName,
        useDefaultExport = _ref6.useDefaultExport,
        possibleArguments = _ref6.possibleArguments,
        explicitArgs = _ref6.explicitArgs;

    if (explicitArgs) {
      explicitArgs.forEach(function (args) {
        var title = methodName + '(' + args.map(function (a) {
          return (0, _stringify2.default)(a);
        }).join(', ') + ')';
        test(title, snapSlice(filename, function (mod) {
          var method = useDefaultExport ? mod : mod[methodName];
          return method.apply(undefined, (0, _toConsumableArray3.default)(args));
        }));
      });
    } else {
      var possibleCombinations = (0, _combs2.default)(possibleArguments);
      possibleCombinations.forEach(generateTests);
    }

    function generateTests(comboOfArgs) {
      // generate the message for the test title
      var testTitle = comboOfArgs.map(function (args) {
        return methodName + '(' + args.map(function (a) {
          return (0, _stringify2.default)(a);
        }).join(', ') + ')';
      }).join(' && ');

      // this is the call to Jest's `test` function
      var test = global.test;
      if (!test) {
        test = function test(title, fn) {
          return fn();
        };
      }
      test(testTitle, snapSlice(filename, function (mod) {
        var method = useDefaultExport ? mod.default || mod : mod[methodName];
        /*
        console.log(
          useDefaultExport,
          methodName,
          Object.keys(mod),
          typeof method,
        )
        /* */
        return comboOfArgs.map(function (args) {
          return method.apply(undefined, (0, _toConsumableArray3.default)(args));
        });
      }));
    }
  });
}

function getInstrumentedModuleFromString(filename, sourceCode, actualFilepath) {
  // for the original source, we don't want to ignore anything
  // but there are some cases where we have to create
  // empty functions that aren't covered
  // to ensure that the resulting code functions properly.
  // So we add an obnoxiously long comment
  // and replace it here.
  var sourceCodeWithoutIstanbulPragma = sourceCode.replace(/istanbul/g, 'ignore-istanbul-ignore').replace(/slice-js-coverage-ignore/g, 'istanbul');

  var _babel$transform = babel.transform(sourceCodeWithoutIstanbulPragma, {
    filename: filename,
    babelrc: false,
    // compact: false,
    only: filename,
    presets: ['node6', 'stage-2'],
    plugins: [instrumenter]
  }),
      code = _babel$transform.code;
  // process.stdout.write('\n\ninstrumentedCode\n\n' + code)


  return requireFromString(code, actualFilepath || filename);
}

/*
 * copied and modified from require-from-string
 */
function requireFromString(code, filepath) {
  var m = new _module2.default(filepath, module.parent);
  m.filename = filepath;
  m.paths = _module2.default._nodeModulePaths(_path2.default.dirname(filepath));
  m._compile(code, filepath);
  return m.exports;
}

function instrumenter(_ref8) {
  var t = _ref8.types;

  return {
    visitor: {
      Program: {
        enter: function enter() {
          var _dv__;

          this.__dv__ = (0, _istanbulLibInstrument.programVisitor)(t, this.file.opts.filename, {
            coverageVariable: coverageVariable
          });
          (_dv__ = this.__dv__).enter.apply(_dv__, arguments);
        },
        exit: function exit() {
          var _dv__2;

          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          (_dv__2 = this.__dv__).exit.apply(_dv__2, args);
          // expose coverage as part of the module
          var newNode = (0, _babelTemplate2.default)('module.exports.' + coverageVariable + ' = global.' + coverageVariable + ';')();
          args[0].node.body.push(newNode);
        }
      }
    }
  };
}