'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Module running slice-js dynamically.
 * Adapted for integration in other systems.
 */

var _require = require('child_process'),
    execSync = _require.execSync;

function f(inputFile, testerVar) {
  var slice = execSync('babel-node ./node_modules/slice-js/dist/module.slicerI.js -- ' + inputFile + ' ' + testerVar);
  return slice.toString();
}

exports.default = f;
module.exports = exports.default;