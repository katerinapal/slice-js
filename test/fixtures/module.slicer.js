import slice from '../../src'

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

//slice(require.resolve('./module'), 'multiply multiplies numbers together', ({multiply}) => {
//  return [multiply(3, 2)]
//})

//slice(require.resolve('./module'), 'subtract subtracts numbers together', ({subtract}) => {
//  return [subtract(3, 2)]
//})

//slice(require.resolve('./module'), 'find variable definition', ({b}) => {
//  return b
//})

let sliceRes;

//let oldLog = console.log;

//console.log = function(d) {

//  oldLog(d);
//  sliceRes = d;

//  //return d;
//};

//slice(require.resolve('./module'), 'find variable definition', ({func}) => {
//  return func()
//})

//console.log(sliceRes)

//oldLog(sliceRes);

slice(require.resolve('./module'), 'find variable definition', ({b}) => {

  //return func()
  //return func();
  return b;

}).then(res => {

  console.log(res);
})

