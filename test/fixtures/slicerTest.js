/**
 * Example for importing/using the dynamic slicer.
*/ 

const slicer = require('../../dist/slicer.js');

let inputFile = 
'/home/katerina/visualStudioGit/slice-js/src/slice-code/test/fixtures/planck-test-example.js';

let res = slicer(inputFile);
console.log(res);