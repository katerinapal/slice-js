import sliceTestD from '../../src'

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

//normalized paths to resolve module dependencies
let entryfileAbsPath = process.argv[process.argv.length-1];

function f() {

  return sliceTestD(require.resolve(entryfileAbsPath), ({tree}) => {

    //return func()
    //return func();
    //return DynamicTree;
    //return query();
    //return f();
    return tree;
  
    //return a;
  
  }).then(res => {
  
    console.log(res);
  
  }).catch(err => {
  
    console.log(`err: ${err}`);
  })
}

f();