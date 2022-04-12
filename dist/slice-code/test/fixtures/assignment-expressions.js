"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plusEqual = plusEqual;
exports.minusEqual = minusEqual;
exports.divideEqual = divideEqual;
exports.multiplyEqual = multiplyEqual;


function plusEqual(thingOne, thingTwo) {
  thingOne += thingTwo;
  return thingOne;
}

function minusEqual(thingOne, thingTwo) {
  thingOne -= thingTwo;
  return thingOne;
}

function divideEqual(thingOne, thingTwo) {
  thingOne /= thingTwo;
  return thingOne;
}

function multiplyEqual(thingOne, thingTwo) {
  thingOne *= thingTwo;
  return thingOne;
}