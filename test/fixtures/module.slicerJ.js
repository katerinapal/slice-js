/**
 * Module trying to run slice-js programmatically and retrieve its result.
*/ 

const {execSync} = require('child_process');

let modulePath = process.argv[process.argv.length-1];

//console.log(inputFile);

function f(inputFile) {

  let slice = execSync(`npm run --silent prod-async-param -- ${inputFile}`);
  return slice.toString();
}

let res = f(modulePath);
console.log(res)