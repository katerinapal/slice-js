'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callback = exports.callPromise = undefined;

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.callPromise = callPromise;
exports.callback = callback;


function promise(pass) {
  return new _promise2.default(function (resolve, reject) {
    if (pass) {
      resolve('pass');
    } else {
      reject('!pass');
    }
  });
}

function callback(pass, cb) {
  return callPromise(pass).then(cb, cb); // I know, I'm cheating :P
}

function callPromise(pass) {
  // do this so we don't get Unhandled promise rejections in the console
  return promise(pass).catch(function (rejection) {
    return rejection;
  });
}