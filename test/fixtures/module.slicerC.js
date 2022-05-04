import {sliceTestC} from '../../src'

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', () => {})
}

sliceTestC(require.resolve('./module'), ({b}) => {

  //return func()
  //return func();
  return b;

}).then(res => {

  console.log(res);

}).catch(res => {

  console.log(`err: ${res}`);
})

