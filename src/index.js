import fs from 'fs'

//backwards compatibility with ES6
const {getSliceAndInfo} = require('./slice-code/test/helpers/utils.js')

export default sliceTest

async function sliceTest(filename, tester) {
  const sourceCode = fs.readFileSync(filename, 'utf8')
  const {slicedCode} = await getSliceAndInfo(sourceCode, tester, filename)

  return slicedCode
}
