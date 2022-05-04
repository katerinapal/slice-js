import {sliceTestD} from '../../src'

const path = require('path');

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

///home/katerina/git/slice-js/test/fixtures/module.slicerC.js
///home/katerina/visualStudioGit/evaluationProjects/planck.js/test/planck-test-code-merged.js

//merged file: I need an invokation to the function defining the variable for slicing
//if I give the function's definition module, function might be dead code (no invocation to the function in the definition module)
let entryfileAbsPath = '/home/katerina/visualStudioGit/evaluationProjects/planck.js/test/planck-test-code-merged.js';

/*//useful for non-constant module paths 
//(require.resolve() fails at relative paths on parent directory)
//console.log(entryfileAbsPath)
let modPath = '/home/katerina/visualStudioGit/slice-js/test/fixtures/module.slicerD.js';
let entryFileRelPath = path.relative('./', entryfileAbsPath);
console.log(entryFileRelPath)
console.log(path.resolve(entryFileRelPath))
console.log(require.resolve(path.resolve(entryFileRelPath)))
console.log('../../', path.resolve(entryFileRelPath))*/

sliceTestD(require.resolve(entryfileAbsPath), ({b}) => {

  //return func()
  //return func();
  return b;

}).then(res => {

  console.log(res);

}).catch(res => {

  console.log(`err: ${res}`);
})

