/**
 * Module trying to run slice-js programmatically and retrieve its result.
*/ 

//const fs = require('fs');
//const path = require('path');
const {execSync} = require('child_process');

//const sliceFile = `./sliceResult.js`;
//console.log(path.resolve(sliceFile));

//let inputFile = `/home/katerina/visualStudioGit/slice-js/src/slice-code/test/fixtures/planck-test-example.js`;
let inputFile = process.argv[process.argv.length-1];

console.log(inputFile);

function f() {

  //execSync(`npm run --silent prod-async-param -- ${inputFile} > ${sliceFile}`);
  //console.log(`Generated ${sliceFile}`)

  return execSync(`npm run --silent prod-async-param -- ${inputFile}`);
}

function g() {

  let sliceCont = f();
  //console.log(sliceCont.toString());

  //const sliceCont = fs.readFileSync(sliceFile, 'utf-8');
    
  //console.log(`result`);
  //console.log(sliceCont);
  return sliceCont.toString();
}

console.log(g())

//g();