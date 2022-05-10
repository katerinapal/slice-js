'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSliceAndInfoC = exports.getSliceAndInfo = exports.snapSliceCode = exports.runAllCombosTests = exports.snapSlice = exports.comboOfItems = exports.comboOfBools = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

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
exports.getSliceAndInfoC = getSliceAndInfoC;


function comboOfBools(n) {
  //2^1-1 = 1 -> 1 -> 1
  var len = (Math.pow(2, n) - 1).toString(2).length;
  var result = [];

  //0-1
  for (var i = 0; i < Math.pow(2, n); i++) {
    //0-1
    var val = i.toString(2);
    console.log('val: ' + val);

    //0-0
    var missing = len - val.length;

    result.push(
    //[]
    (0, _from2.default)({ length: missing })

    //[]
    .map(function () {
      return false;
    })

    //[[false]], [[false], [true]]
    .concat(
    //[0], [1]
    (0, _from2.default)(val)
    //[[false]], [[true]]
    .map(function (v) {
      return v === '1';
    })));
  }

  //[[false], [true]]
  console.log('result');
  console.log(result);
  console.log('\n');
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


            console.log('sliced code');
            console.log(slicedCode);
            expect(slicedCode).toMatchSnapshot();
            expect(isSlicedCoverage100).toBe(true, 'coverage should be 100%');
            expect(originalResult).toEqual(slicedResult, 'originalResult should be the same as the slicedResult');

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));
}

function getSliceAndInfoC(sourceCode, tester, actualFilepath) {
  //console.log(`getSliceAndInfoC`)

  var tempFilename = './temp-sliced.' + (0, _lodash.random)(1, 9999999999999) + '.js';
  var instrPromise = getInstrumentedModuleFromStringC(tempFilename, sourceCode, actualFilepath);

  var testerPromise = instrPromise.then(function (mod) {
    return _promise2.default.resolve(tester(mod));
  });

  var slicePromise = instrPromise.then(function (mod) {
    //console.log(`slice`)
    //console.log(mod)
    var coverageData = mod[coverageVariable][tempFilename];
    //console.log(coverageData);
    //console.log(coverageData.statementMap);
    //console.log(coverageData.s);

    //const slicedCode = sliceCodeC(sourceCode, coverageData)

    //in case of buggy test code, return an empty slice
    var slicedCode = mod.err == true ? '' : (0, _.sliceCodeC)(sourceCode, coverageData);
    var filteredCoverage = (0, _transformCoverage.filterToRunStatementsFunctionsAndBranchesC)(coverageData);

    //return {slicedCode, filteredCoverage};

    //console.log(slicedCode);

    return _promise2.default.resolve({
      slicedCode: slicedCode,
      filteredCoverage: filteredCoverage
    });
  });

  //console.log(slicePromise)
  var filteredCovPromise = slicePromise.then(function (res) {
    //console.log(`filtered cov`)
    //console.log(res);
    var slicedCode = res.slicedCode;
    //return slicedCoverageIs100C(tempFilename, slicedCode, tester, actualFilepath);

    return _promise2.default.resolve(slicedCoverageIs100C(tempFilename, slicedCode, tester, actualFilepath));

    //const {is100: isSlicedCoverage100, slicedResult} = slicedCoverageIs100C(tempFilename, slicedCode, tester, actualFilepath);
  });

  //mod: instrPromise
  //originalResult: testerPromise
  //slicedCode: slicePromise
  //isSlicedCoverage100: filteredCovPromise
  //slicedResult: filteredCovPromise
  //filteredCoverage: slicePromise

  return _promise2.default.all([instrPromise, testerPromise, slicePromise, filteredCovPromise]).then(function (promiseResArr) {
    //console.log(`promise res arr`)
    //console.log(promiseResArr)

    //promiseArr: any[4]
    return _promise2.default.resolve({
      mod: promiseResArr[0],
      originalResult: promiseResArr[1],
      slicedCode: promiseResArr[2].slicedCode,
      isSlicedCoverage100: promiseResArr[3].isSlicedCoverage100,
      slicedResult: promiseResArr[3].slicedResult,
      filteredCoverage: promiseResArr[2].filteredCoverage
    });
  });

  // console.log('slicedCode', slicedCode)
}

function runAllCombosTests(_ref5) {
  var filename = _ref5.filename,
      methods = _ref5.methods;

  /**
   * [{
   *    methodName: String,
   *    possibleArguments: [[any*]*]
   * }]
   */

  methods.forEach(function (_ref6) {
    var methodName = _ref6.methodName,
        useDefaultExport = _ref6.useDefaultExport,
        possibleArguments = _ref6.possibleArguments,
        explicitArgs = _ref6.explicitArgs;

    if (explicitArgs) {
      console.log('dead code');

      var test = global.test;
      if (!test) {
        test = function test(title, fn) {
          return fn();
        };
      }

      explicitArgs.forEach(function (args) {
        var title = methodName + '(' + args.map(function (a) {
          return (0, _stringify2.default)(a);
        }).join(', ') + ')';
        test(title, snapSlice(filename, function (mod) {
          console.log(mod);
          //console.log(useDefaultExport);
          //console.log(methodName);

          var method = useDefaultExport ? mod : mod[methodName];

          (0, _keys2.default)(mod[coverageVariable]).forEach(function (propKey) {
            var propVal = mod[coverageVariable][propKey];
            console.log(propVal.statementMap);
            console.log(propVal.s);
            console.log('\n');
          });

          return method.apply(undefined, (0, _toConsumableArray3.default)(args));
        }));
      });
    } else {
      console.log('explicitArgs undefined');

      //[[false], [true]]: [[false]], [[true]], [[false], [true]]
      var possibleCombinations = (0, _combs2.default)(possibleArguments);
      possibleCombinations.forEach(generateTests);
    }

    function generateTests(comboOfArgs) {
      // generate the message for the test title

      //[[false]], [[true]], [[false], [true]]
      /*const testTitle = comboOfArgs
      .map(args => {
        return `${methodName}(${args
          .map(a => JSON.stringify(a))
          .join(', ')})`
      })
      .join(' && ')*/

      var testTitle = '';

      // this is the call to Jest's `test` function
      var test = global.test;
      if (!test) {
        test = function test(title, fn) {
          return fn();
        };
      }
      test(testTitle, snapSlice(filename, function (mod) {
        var method = useDefaultExport ? mod.default || mod : mod[methodName];

        console.log(useDefaultExport);
        console.log(mod);
        console.log(method);
        console.log(comboOfArgs);

        //coverageVariable is incremented with slice results
        //from method executions with different arguments
        //(print only the last property)
        //console.log(mod[coverageVariable]);
        (0, _keys2.default)(mod[coverageVariable]).forEach(function (propKey) {
          var propVal = mod[coverageVariable][propKey];
          console.log(propVal.statementMap);
          console.log(propVal.s);
          console.log('\n');
        });

        //let propKeys = Object.keys(mod[coverageVariable]);

        //path to intermediate file
        //let lastPropKey = propKeys[propKeys.length-1];
        //let lastProp = mod[coverageVariable][lastPropKey];
        //console.log(`lastPropKey: ${lastPropKey}`)
        //console.log(lastProp.statementMap);
        //console.log(lastProp.s);
        console.log('\n\n');

        return method();

        /*
        console.log(
        useDefaultExport,
        methodName,
        Object.keys(mod),
        typeof method,
        )
        /* */
        //return comboOfArgs.map(args => method(...args))
      }));
    }
  });
}

function slicedCoverageIs100C(filename, slicedCode, tester, actualFilepath) {
  var instrPromise = getInstrumentedModuleFromStringC(filename, slicedCode, actualFilepath);

  var testerPromise = instrPromise.then(function (mod) {
    return tester(mod);
  });

  //const slicedResult = await tester(mod)
  /*
  process.stdout.write(
    `\n\nmod[coverageVariable][filename].s\n\n${
      JSON.stringify(mod[coverageVariable][filename].s, null, 2)}`,
  )
  /* */

  var is100Promise = instrPromise.then(function (mod) {
    return coverageIs100Percent(mod[coverageVariable]);
  });

  return _promise2.default.all([is100Promise, testerPromise]).then(function (promiseResArr) {
    //is100: is100Promise
    //slicedResult: testerPromise
    return {
      is100: promiseResArr[0],
      slicedResult: promiseResArr[1]
    };
  });

  //const is100 =
  //return {slicedResult, is100}

  function coverageIs100Percent(coverageData) {
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
  }
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

/**
 * Instruments source code and dynamically loads the instrumented code.
 * @param{String} filename the file containing the instrumentation results
 * @param{String} sourceCode the code to be instrumented
 * @param{String} actualFilepath the path to the module with the code to be instrumented
 * @returns{Object} the module object of the instrumented module
 */

function getInstrumentedModuleFromStringC(filename, sourceCode, actualFilepath) {
  //console.log(`instr`)

  // for the original source, we don't want to ignore anything
  // but there are some cases where we have to create
  // empty functions that aren't covered
  // to ensure that the resulting code functions properly.
  // So we add an obnoxiously long comment
  // and replace it here.
  return new _promise2.default(function (resolve, reject) {
    var sourceCodeWithoutIstanbulPragma = sourceCode.replace(/istanbul/g, 'ignore-istanbul-ignore').replace(/slice-js-coverage-ignore/g, 'istanbul');

    //instrument code

    var _babel$transform2 = babel.transform(sourceCodeWithoutIstanbulPragma, {
      filename: filename,
      babelrc: false,
      // compact: false,
      only: filename,
      presets: ['node6', 'stage-2'],
      plugins: [instrumenter]
    }),
        code = _babel$transform2.code;

    //console.log(`loading instr code`)

    //load (execute) the instrumented module code and
    //resolve promise with the instrumented module's module object
    // process.stdout.write('\n\ninstrumentedCode\n\n' + code)

    resolve(requireFromString(code, actualFilepath || filename));
  });
}

/*
 * copied and modified from require-from-string
 */
function requireFromString(code, filepath) {
  var m = new _module2.default(filepath, module.parent);
  m.filename = filepath;
  m.paths = _module2.default._nodeModulePaths(_path2.default.dirname(filepath));
  m._compile(code, filepath);

  //console.log(m);

  //always run the function, in order to obtain a slice
  //wrap the analyzed code to a function, in order not to be executed during module loading
  var func = m.exports.default;

  try {
    func();
    return m.exports;
  } catch (err) {
    console.log('Error in slice generation: the analyzed code contains bugs.');
    console.log(err);

    //add a surrogate property to m.exports
    //(return an empty slice for buggy test code)
    m.exports.err = true;
    return m.exports;
  }

  //func()
  //return m.exports
}

/*
 * copied and modified from require-from-string
 */
function requireFromStringC(code, filepath) {
  //console.log(`importing mod: ${filepath}`)
  //return import(filepath);

  var instrModule = './instrModule.js';
  var instrModuleAbsPath = _path2.default.resolve(instrModule);
  _fs2.default.writeFileSync(instrModuleAbsPath, code, 'utf-8');

  console.log('Wrote ' + instrModuleAbsPath);

  return new _promise2.default(function (resolve, reject) {
    console.log('loading prom');

    //resolve(eval(code));

    //const m = new Module(filepath, module.parent)
    //m.filename = filepath
    //m.paths = Module._nodeModulePaths(path.dirname(filepath))
    //m._compile(code, filepath)

    var modObj = require(instrModuleAbsPath);
    console.log(modObj);

    //console.log(m)
    //console.log(m.exports)
    console.log('loaded module dynamically');

    //const modObj = require(filepath);
    //console.log(modObj['____sliceCoverage____']);

    //resolve(require(filepath))
    //resolve({})
    //console.log(m.exports)
    //resolve(m.exports);
  });
}

function requireFromStringCUPD(code, filepath) {
  console.log('loading prom');

  var Mocha = require('mocha');

  var mocha = new Mocha({});

  //run the tests from the instrumented module
  //in the example, the instrumented module is loaded dynamically, not the initial module
  mocha.addFile(filepath);

  return new _promise2.default(function (resolve, reject) {
    return mocha.run().on('end', function () {
      console.log('All done');

      resolve(requireFromStringC(code, filepath));
    });
  });
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