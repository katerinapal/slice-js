'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryCatch = tryCatch;
exports.statementsAfterThrow = statementsAfterThrow;


function tryCatch(shouldThrow) {
  var ret = {};
  try {
    if (shouldThrow) {
      throw new Error('throw error');
    }
    ret.noThrow = true;
  } catch (error) {
    ret.error = error;
    return error;
  } finally {
    return ret;
  }
}

function statementsAfterThrow() {
  var ret = {};
  try {
    ret.before = true;
    if (ret.before) {
      throw new Error('throw error');
    }
    ret.after = true;
  } catch (error) {
    ret.error = error;
  } finally {
    return ret;
  }
}