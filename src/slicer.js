/**
 * Module running slice-js dynamically.
 * Adapted for integration in other systems.
 */

const {execSync} = require('child_process')

function f(inputFile, testerVar) {
  let slice = execSync(
    `babel-node ./node_modules/slice-js/dist/module.slicerI.js -- ${inputFile} ${testerVar}`,
  )
  return slice.toString()
}

export default f
