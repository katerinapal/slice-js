import fs from 'fs'

//backwards compatibility with ES6
const {
  getSliceAndInfo,
  getSliceAndInfoC,
  snapSlice,
  runAllCombosTests,
} = require('./slice-code/test/helpers/utils.js')

export default sliceTest
export {sliceTestD, sliceTestE}

async function sliceTest(filename, tester) {
  const sourceCode = fs.readFileSync(filename, 'utf8')
  const {slicedCode} = await getSliceAndInfo(sourceCode, tester, filename)

  return slicedCode
}

function sliceTestD(filename, tester) {
  return new Promise((resolve, reject) => {
    //console.log(filename)

    const sourceCode = fs.readFileSync(filename, 'utf8')
    getSliceAndInfoC(sourceCode, tester, filename).then(res => {
      //console.log(res);
      const {slicedCode} = res
      //console.log(slicedCode)
      resolve(slicedCode)
    })
  })
}

function sliceTestE(filename, tester) {
  return new Promise((resolve, reject) => {
    //console.log(filename)

    //const sourceCode = fs.readFileSync(filename, 'utf8')
    //resolve(snapSlice(filename, tester));
    /*.then(res => {

      //console.log(res);
      const {slicedCode} = res;
      //console.log(slicedCode)
      resolve(slicedCode);
    });*/

    runAllCombosTests({
      filename,
      methods: [
        {
          methodName: 'f',
          useDefaultExport: false,
          explicitArgs: [[]],
        },
      ],
    })
  })
}
