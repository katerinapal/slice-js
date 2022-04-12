"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isConsequentOrAlternate = isConsequentOrAlternate;
exports.isConsequentOrAlternatesConsequentOrAlternate = isConsequentOrAlternatesConsequentOrAlternate;
exports.uncoveredConditionalExpression = uncoveredConditionalExpression;


function isConsequentOrAlternate(isConsequent) {
  return isConsequent ? isConsequent : !isConsequent;
}

function isConsequentOrAlternatesConsequentOrAlternate(isConsequent, isAlternatesConsequent) {
  return isConsequent ? isConsequent : isAlternatesConsequent ? isAlternatesConsequent : !isConsequent && !isAlternatesConsequent;
}

function uncoveredConditionalExpression(cover) {
  if (cover) {
    return cover ? cover : !cover;
  }
  return !cover;
}