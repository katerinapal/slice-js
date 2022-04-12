'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignmentTernary = assignmentTernary;
exports.diacriticsClean = diacriticsClean;


var output = {
  map: {
    a: 'A'
  }
};

function assignmentTernary(letter) {
  var string = 'init';
  string += letter in output.map ? output.map[letter] : letter;
  return string;
}

function diacriticsClean(input) {
  if (!input || !input.length || input.length < 1) {
    return '';
  }

  var string = '';
  var letters = input.split('');
  var index = 0;
  var length = letters.length;
  var letter;

  for (; index < length; index++) {
    letter = letters[index];
    string += letter in output.map ? output.map[letter] : letter;
  }

  return string;
}