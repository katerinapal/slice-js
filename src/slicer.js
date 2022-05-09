/**
 * Module running slice-js dynamically.
 */

const {execSync} = require('child_process')

function f(inputFile) {
  let slice = execSync(`npm run --silent prod-async-param -- ${inputFile}`)
  return slice.toString()
}

export default f
