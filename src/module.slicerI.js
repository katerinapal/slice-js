import sliceTestD from './'

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

//normalized paths to resolve module dependencies
let entryfileAbsPath = process.argv[process.argv.length - 2]
let testerVar = process.argv[process.argv.length - 1]

//console.log(entryfileAbsPath);
//console.log(testerVar);

function f() {
  return sliceTestD(
    require.resolve(entryfileAbsPath),
    ({tree = testerVar}) => {
      //return func()
      //return func();
      //return DynamicTree;
      //return query();
      //return f();
      return tree

      //return a;
    },
  )
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(`err: ${err}`)
    })
}

f()
