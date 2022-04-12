"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var allAnd = exports.allAnd = function allAnd(a, b, c) {
  return a && b && c;
};
var allOr = exports.allOr = function allOr(a, b, c) {
  return a || b || c;
};
var andOr = exports.andOr = function andOr(a, b, c) {
  return a && b || c;
};
var orAndOr = exports.orAndOr = function orAndOr(a, b, c, d) {
  return (a || b) && (c || d);
};
var andOrAnd = exports.andOrAnd = function andOrAnd(a, b, c, d) {
  return a && b || c && d;
};