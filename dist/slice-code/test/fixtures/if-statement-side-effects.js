'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ifWithAssignment = ifWithAssignment;
exports.ifWithFunctionCall = ifWithFunctionCall;


function ifWithAssignment(passIf) {
  var x = void 0;
  if ((x = 'hi') && passIf) {
    return x + passIf;
  } else {
    return !passIf + x;
  }
}

function ifWithFunctionCall(passIf) {
  var thing = void 0;
  var setThing = function setThing(a) {
    return thing = a, passIf;
  };
  if (passIf && setThing('hey') && someOtherThing(passIf)) {
    return thing + passIf;
  } else if (!someOtherThing(passIf) || passIf) {
    return !passIf;
  } else {
    return passIf;
  }

  function someOtherThing(a) {
    return a;
  }
}