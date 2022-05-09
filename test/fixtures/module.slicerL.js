/**
 * Module trying to run slice-js programmatically and retrieve its result.
 * Will become the package's entry file.
*/ 

const {execSync} = require('child_process');

function f(inputFile) {

  let slice = execSync(`npm run --silent prod-async-param -- ${inputFile}`);
  return slice.toString();
}

export default f;