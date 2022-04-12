'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var mod = {};

  mod.foo = function () {
    return 'foo';
  };

  mod.bar = 'bar';

  mod.baz = function (returnBaz) {
    return returnBaz ? 'baz' : 'buzz';
  };

  mod.foobar = function () {
    return 'function assignment';
  };

  mod.mokeypatchFn = function () {
    return '🐒';
  };
  mod.mokeypatchFn.favorite = 'my favorite animal is a 🐒';

  mod.monkeypatchArrow = function () {
    return '🐵';
  };
  mod.monkeypatchArrow.favorite = 'my favorite animal is a 🐵';

  return mod;
}();

module.exports = exports.default;