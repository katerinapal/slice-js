'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.sliceCodeAndGetInfo = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _babelCore = require('babel-core');

var babel = _interopRequireWildcard(_babelCore);

var _babelPluginMinifyDeadCodeElimination = require('babel-plugin-minify-dead-code-elimination');

var _babelPluginMinifyDeadCodeElimination2 = _interopRequireDefault(_babelPluginMinifyDeadCodeElimination);

var _babelPluginCustomDeadCodeElimination = require('./babel-plugin-custom-dead-code-elimination');

var _babelPluginCustomDeadCodeElimination2 = _interopRequireDefault(_babelPluginCustomDeadCodeElimination);

var _transformCoverage = require('./transform-coverage');

var _transformCoverage2 = _interopRequireDefault(_transformCoverage);

var _getSlicedCodeTransform = require('./get-sliced-code-transform');

var _getSlicedCodeTransform2 = _interopRequireDefault(_getSlicedCodeTransform);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.sliceCodeAndGetInfo = sliceCodeAndGetInfo;
exports.default = sliceCode;


function sliceCode(sourceCode, coverageData) {
  // console.log('coverageData', JSON.stringify(coverageData, null, 2))
  var filteredCoverage = (0, _transformCoverage2.default)(coverageData);
  // console.log('filteredCoverage', JSON.stringify(filteredCoverage, null, 2))
  // console.log('\n\n\n\nsourceCode\n', sourceCode)
  return sliceCodeFromFilteredCoverage(sourceCode, filteredCoverage);
}

function sliceCodeAndGetInfo(sourceCode, coverageData) {
  // console.log('coverageData', JSON.stringify(coverageData, null, 2))
  var filteredCoverage = (0, _transformCoverage2.default)(coverageData);
  // console.log('filteredCoverage', JSON.stringify(filteredCoverage, null, 2))
  // console.log('\n\n\n\nsourceCode\n', sourceCode)
  var slice = void 0,
      error = void 0;
  try {
    slice = sliceCodeFromFilteredCoverage(sourceCode, filteredCoverage);
  } catch (e) {
    error = e;
  }
  return { slice: slice, error: error, filteredCoverage: filteredCoverage };
}

function sliceCodeFromFilteredCoverage(sourceCode, filteredCoverage) {
  var filename = filteredCoverage.path;

  var commonOptions = {
    filename: filename,
    babelrc: false
  };

  var _babel$transform = babel.transform(sourceCode, (0, _extends3.default)({}, commonOptions, {
    plugins: [(0, _getSlicedCodeTransform2.default)(filteredCoverage)]
  })),
      sliced = _babel$transform.code;
  // console.log('sliced', sliced)
  // TODO: perf - save time parsing by just transforming the
  // AST from the previous run
  // This will probably significantly speed things up.
  // Unfortunately, when I tried the first time,
  // I couldn't get it working :shrug:


  var _babel$transform2 = babel.transform(sliced, (0, _extends3.default)({}, commonOptions, {
    plugins: [_babelPluginMinifyDeadCodeElimination2.default]
  })),
      deadCodeEliminated = _babel$transform2.code;
  // console.log('deadCodeEliminated', deadCodeEliminated)


  var _babel$transform3 = babel.transform(deadCodeEliminated, (0, _extends3.default)({}, commonOptions, {
    plugins: [_babelPluginCustomDeadCodeElimination2.default]
  })),
      customDeadCodeElimiated = _babel$transform3.code;
  // console.log('customDeadCodeElimiated', customDeadCodeElimiated)


  return customDeadCodeElimiated;
}