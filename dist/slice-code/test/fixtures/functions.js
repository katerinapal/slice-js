"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sum = sum;
exports.subtract = subtract;
exports.multiply = multiply;
exports.divide = divide;


function sum(a, b) {
  return a + b;
}

function subtract(a, b) {
  return sum(a, -b);
}

function multiply(a, b) {
  var product = void 0,
      i = void 0;
  product = 0;
  for (i = 0; i < b; i++) {
    product = sum(product, a);
  }
  return product;
}

function divide(a, b) {
  return a / b;
}