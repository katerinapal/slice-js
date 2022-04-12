"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = clone;


function clone(item) {
  if (!item) {
    return item;
  }
  var type = typeof item === "undefined" ? "undefined" : (0, _typeof3.default)(item);
  var string = Object.prototype.toString.call(item);
  var isPrimitive = type !== "object" && type !== "function";
  var result = item;

  if (!isPrimitive) {
    if (string === '[object Array]') {
      result = [];
      item.forEach(function (child, index, array) {
        result[index] = clone(child);
      });
    } else if (type === 'object') {
      if (item.nodeType && typeof item.cloneNode == 'function') {
        result = item.cloneNode(true);
      } else if (!item.prototype) {
        if (string === '[object Date]') {
          result = new Date(item);
        } else {
          result = {};
          for (var i in item) {
            result[i] = clone(item[i]);
          }
        }
      } else {
        if (false && item.constructor) {
          result = new item.constructor();
        } else {
          result = item;
        }
      }
    }
  }

  return result;
}
module.exports = exports.default;