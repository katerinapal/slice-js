/**
 * Module running slice-js dynamically.
 */

const {execSync} = require('child_process')

function f(inputFile, testerVar) {
  let slice = execSync(
    `npm run --silent prod-async-param -- ${inputFile} ${testerVar}`,
  )
  return slice.toString()
}

export default f
