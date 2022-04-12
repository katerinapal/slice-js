'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ifStatement = ifStatement;
exports.condExpr = condExpr;
exports.logicalExpr = logicalExpr;


function ifStatement(passIf) {
  if (!passIf) {
    return 'did not reach IfStatement';
  }
  if (passIf) {
    return 'reached IfStatement';
  }
}

function condExpr(passIf) {
  if (!passIf) {
    return 'did not reach IfStatement';
  }
  return passIf ? 'reached CondExpr Consequent' : 'reached CondExpr Alternate';
}

function logicalExpr(passIf) {
  if (!passIf) {
    return 'did not reach IfStatement';
  }
  return passIf && 'reached LogicalExpression';
}