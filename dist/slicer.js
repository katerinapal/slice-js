'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Module running slice-js dynamically.
 */

var _require = require('child_process'),
    execSync = _require.execSync;

function f(inputFile, testerVar) {
  var slice = execSync('npm run --silent prod-async-param -- ' + inputFile + ' ' + testerVar);
  return slice.toString();
}

exports.default = f;
module.exports = exports.default;