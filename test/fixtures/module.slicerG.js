import sliceTestD from '../../src'

//const path = require('path');

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

//let entryfileAbsPath = 
//'/home/katerina/visualStudioGit/evaluationProjects/planck.js/test/planck-test-example.js';

//normalized paths to resolve module dependencies
let entryfileAbsPath = 
'/home/katerina/visualStudioGit/slice-js/src/slice-code/test/fixtures/planck-test-example.js';

//console.log(`cmd args`);
//console.log(process.argv)

sliceTestD(require.resolve(entryfileAbsPath), ({tree}) => {

  //return func()
  //return func();
  //return DynamicTree;
  //return query();
  //return f();
  return tree;

  //return a;

}).then(res => {

  console.log(`res`)
  console.log(res);

  return Promise.resolve(res);

}).catch(err => {

  console.log(`err: ${err}`);
})

