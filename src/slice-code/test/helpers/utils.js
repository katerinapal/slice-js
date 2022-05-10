/* istanbul ignore next */
import fs from 'fs'
import Module from 'module'
import path, {resolve} from 'path'
import combs from 'combs'
import * as babel from 'babel-core'
import {programVisitor as getInstrumentVisitor} from 'istanbul-lib-instrument'
import {random, reject} from 'lodash'
import template from 'babel-template'
import transformCoverage from '../../transform-coverage'
import sliceCode from '../..'

import {sliceCodeC} from '../..'
import {filterToRunStatementsFunctionsAndBranchesC} from '../../transform-coverage'

const coverageVariable = '____sliceCoverage____'

export {
  comboOfBools,
  comboOfItems,
  snapSlice,
  runAllCombosTests,
  snapSliceCode,
  getSliceAndInfo,
  getSliceAndInfoC,
}

function comboOfBools(n) {
  //2^1-1 = 1 -> 1 -> 1
  const len = (Math.pow(2, n) - 1).toString(2).length
  const result = []

  //0-1
  for (let i = 0; i < Math.pow(2, n); i++) {
    //0-1
    const val = i.toString(2)
    console.log(`val: ${val}`)

    //0-0
    const missing = len - val.length

    result.push(
      //[]
      Array.from({length: missing})

        //[]
        .map(() => false)

        //[[false]], [[false], [true]]
        .concat(
          //[0], [1]
          Array.from(val)
            //[[false]], [[true]]
            .map(v => v === '1'),
        ),
    )
  }

  //[[false], [true]]
  console.log(`result`)
  console.log(result)
  console.log(`\n`)
  return result
}

/**
 * @param  {Array} items the items to get combinations for
 * @return {Array} an array of arrays of the possible combination of those items
 */
function comboOfItems(items) {
  if (items.length < 2) {
    return [items]
  }
  const combos = []
  items.forEach((item, index) => {
    const firstHalf = items.slice(0, index)
    const secondHalf = items.slice(index + 1)
    const remainingCombos = comboOfItems([...firstHalf, ...secondHalf])
    remainingCombos.forEach(combo => {
      combos.push([item, ...combo])
    })
  })
  return combos
}

function snapSlice(relativePath, tester) {
  const absolutePath = require.resolve(relativePath)
  const sourceCode = fs.readFileSync(absolutePath, 'utf8')
  return snapSliceCode(sourceCode, tester, absolutePath)
}

function snapSliceCode(sourceCode, tester, actualFilepath) {
  // the function returned here is what you'd
  // place in a call to Jest's `test` function
  return async () => {
    const {
      originalResult,
      slicedCode,
      isSlicedCoverage100,
      slicedResult,
    } = await getSliceAndInfo(sourceCode, tester, actualFilepath)

    console.log(`sliced code`)
    console.log(slicedCode)
    expect(slicedCode).toMatchSnapshot()
    expect(isSlicedCoverage100).toBe(true, 'coverage should be 100%')
    expect(originalResult).toEqual(
      slicedResult,
      'originalResult should be the same as the slicedResult',
    )
  }
}

async function getSliceAndInfo(sourceCode, tester, actualFilepath) {
  const tempFilename = `./temp-sliced.${random(1, 9999999999999)}.js`
  const mod = getInstrumentedModuleFromString(
    tempFilename,
    sourceCode,
    actualFilepath,
  )
  const originalResult = await tester(mod)
  // console.log('originalResult', originalResult)
  const coverageData = mod[coverageVariable][tempFilename]
  const slicedCode = sliceCode(sourceCode, coverageData)
  const filteredCoverage = transformCoverage(coverageData)
  // console.log('slicedCode', slicedCode)
  const {
    is100: isSlicedCoverage100,
    slicedResult,
  } = await slicedCoverageIs100(
    tempFilename,
    slicedCode,
    tester,
    actualFilepath,
  )
  return {
    mod,
    originalResult,
    slicedCode,
    isSlicedCoverage100,
    slicedResult,
    filteredCoverage,
  }
}

function getSliceAndInfoC(sourceCode, tester, actualFilepath) {
  //console.log(`getSliceAndInfoC`)

  const tempFilename = `./temp-sliced.${random(1, 9999999999999)}.js`
  const instrPromise = getInstrumentedModuleFromStringC(
    tempFilename,
    sourceCode,
    actualFilepath,
  )

  const testerPromise = instrPromise.then(mod => {
    return Promise.resolve(tester(mod))
  })

  const slicePromise = instrPromise.then(mod => {
    //console.log(`slice`)
    //console.log(mod)
    const coverageData = mod[coverageVariable][tempFilename]
    //console.log(coverageData);
    //console.log(coverageData.statementMap);
    //console.log(coverageData.s);

    //const slicedCode = sliceCodeC(sourceCode, coverageData)

    //in case of buggy test code, return an empty slice
    const slicedCode =
      mod.err == true ? `` : sliceCodeC(sourceCode, coverageData)
    const filteredCoverage = filterToRunStatementsFunctionsAndBranchesC(
      coverageData,
    )

    //return {slicedCode, filteredCoverage};

    //console.log(slicedCode);

    return Promise.resolve({
      slicedCode,
      filteredCoverage,
    })
  })

  //console.log(slicePromise)
  const filteredCovPromise = slicePromise.then(res => {
    //console.log(`filtered cov`)
    //console.log(res);
    const {slicedCode} = res
    //return slicedCoverageIs100C(tempFilename, slicedCode, tester, actualFilepath);

    return Promise.resolve(
      slicedCoverageIs100C(tempFilename, slicedCode, tester, actualFilepath),
    )

    //const {is100: isSlicedCoverage100, slicedResult} = slicedCoverageIs100C(tempFilename, slicedCode, tester, actualFilepath);
  })

  //mod: instrPromise
  //originalResult: testerPromise
  //slicedCode: slicePromise
  //isSlicedCoverage100: filteredCovPromise
  //slicedResult: filteredCovPromise
  //filteredCoverage: slicePromise

  return Promise.all([
    instrPromise,
    testerPromise,
    slicePromise,
    filteredCovPromise,
  ]).then(promiseResArr => {
    //console.log(`promise res arr`)
    //console.log(promiseResArr)

    //promiseArr: any[4]
    return Promise.resolve({
      mod: promiseResArr[0],
      originalResult: promiseResArr[1],
      slicedCode: promiseResArr[2].slicedCode,
      isSlicedCoverage100: promiseResArr[3].isSlicedCoverage100,
      slicedResult: promiseResArr[3].slicedResult,
      filteredCoverage: promiseResArr[2].filteredCoverage,
    })
  })

  // console.log('slicedCode', slicedCode)
}

function runAllCombosTests({filename, methods}) {
  /**
   * [{
   *    methodName: String,
   *    possibleArguments: [[any*]*]
   * }]
   */

  methods.forEach(
    ({methodName, useDefaultExport, possibleArguments, explicitArgs}) => {
      if (explicitArgs) {
        console.log(`dead code`)

        let test = global.test
        if (!test) {
          test = (title, fn) => fn()
        }

        explicitArgs.forEach(args => {
          const title = `${methodName}(${args
            .map(a => JSON.stringify(a))
            .join(', ')})`
          test(
            title,
            snapSlice(filename, mod => {
              console.log(mod)
              //console.log(useDefaultExport);
              //console.log(methodName);

              const method = useDefaultExport ? mod : mod[methodName]

              Object.keys(mod[coverageVariable]).forEach(propKey => {
                let propVal = mod[coverageVariable][propKey]
                console.log(propVal.statementMap)
                console.log(propVal.s)
                console.log(`\n`)
              })

              return method(...args)
            }),
          )
        })
      } else {
        console.log(`explicitArgs undefined`)

        //[[false], [true]]: [[false]], [[true]], [[false], [true]]
        const possibleCombinations = combs(possibleArguments)
        possibleCombinations.forEach(generateTests)
      }

      function generateTests(comboOfArgs) {
        // generate the message for the test title

        //[[false]], [[true]], [[false], [true]]
        /*const testTitle = comboOfArgs
        .map(args => {
          return `${methodName}(${args
            .map(a => JSON.stringify(a))
            .join(', ')})`
        })
        .join(' && ')*/

        const testTitle = ''

        // this is the call to Jest's `test` function
        let test = global.test
        if (!test) {
          test = (title, fn) => fn()
        }
        test(
          testTitle,
          snapSlice(filename, mod => {
            const method = useDefaultExport ?
              mod.default || mod :
              mod[methodName]

            console.log(useDefaultExport)
            console.log(mod)
            console.log(method)
            console.log(comboOfArgs)

            //coverageVariable is incremented with slice results
            //from method executions with different arguments
            //(print only the last property)
            //console.log(mod[coverageVariable]);
            Object.keys(mod[coverageVariable]).forEach(propKey => {
              let propVal = mod[coverageVariable][propKey]
              console.log(propVal.statementMap)
              console.log(propVal.s)
              console.log(`\n`)
            })

            //let propKeys = Object.keys(mod[coverageVariable]);

            //path to intermediate file
            //let lastPropKey = propKeys[propKeys.length-1];
            //let lastProp = mod[coverageVariable][lastPropKey];
            //console.log(`lastPropKey: ${lastPropKey}`)
            //console.log(lastProp.statementMap);
            //console.log(lastProp.s);
            console.log(`\n\n`)

            return method()

            /*
          console.log(
            useDefaultExport,
            methodName,
            Object.keys(mod),
            typeof method,
          )
          /* */
            //return comboOfArgs.map(args => method(...args))
          }),
        )
      }
    },
  )
}

async function slicedCoverageIs100(
  filename,
  slicedCode,
  tester,
  actualFilepath,
) {
  const mod = getInstrumentedModuleFromString(
    filename,
    slicedCode,
    actualFilepath,
  )
  const slicedResult = await tester(mod)
  /*
  process.stdout.write(
    `\n\nmod[coverageVariable][filename].s\n\n${
      JSON.stringify(mod[coverageVariable][filename].s, null, 2)}`,
  )
  /* */
  const is100 = coverageIs100Percent(mod[coverageVariable])
  return {slicedResult, is100}

  function coverageIs100Percent(coverageData) {
    const cov = coverageData[filename]
    const functions100 = Object.keys(cov.f).every(k => cov.f[k] > 0)
    const statements100 = Object.keys(cov.s).every(k => cov.s[k] > 0)
    const branches100 = Object.keys(cov.b).every(
      k => cov.b[k][0] > 0 && cov.b[k][1] > 0,
    )
    return functions100 && statements100 && branches100
  }
}

function slicedCoverageIs100C(filename, slicedCode, tester, actualFilepath) {
  const instrPromise = getInstrumentedModuleFromStringC(
    filename,
    slicedCode,
    actualFilepath,
  )

  const testerPromise = instrPromise.then(mod => {
    return tester(mod)
  })

  //const slicedResult = await tester(mod)
  /*
  process.stdout.write(
    `\n\nmod[coverageVariable][filename].s\n\n${
      JSON.stringify(mod[coverageVariable][filename].s, null, 2)}`,
  )
  /* */

  const is100Promise = instrPromise.then(mod => {
    return coverageIs100Percent(mod[coverageVariable])
  })

  return Promise.all([is100Promise, testerPromise]).then(promiseResArr => {
    //is100: is100Promise
    //slicedResult: testerPromise
    return {
      is100: promiseResArr[0],
      slicedResult: promiseResArr[1],
    }
  })

  //const is100 =
  //return {slicedResult, is100}

  function coverageIs100Percent(coverageData) {
    const cov = coverageData[filename]
    const functions100 = Object.keys(cov.f).every(k => cov.f[k] > 0)
    const statements100 = Object.keys(cov.s).every(k => cov.s[k] > 0)
    const branches100 = Object.keys(cov.b).every(
      k => cov.b[k][0] > 0 && cov.b[k][1] > 0,
    )
    return functions100 && statements100 && branches100
  }
}

function getInstrumentedModuleFromString(filename, sourceCode, actualFilepath) {
  // for the original source, we don't want to ignore anything
  // but there are some cases where we have to create
  // empty functions that aren't covered
  // to ensure that the resulting code functions properly.
  // So we add an obnoxiously long comment
  // and replace it here.
  const sourceCodeWithoutIstanbulPragma = sourceCode
    .replace(/istanbul/g, 'ignore-istanbul-ignore')
    .replace(/slice-js-coverage-ignore/g, 'istanbul')
  const {code} = babel.transform(sourceCodeWithoutIstanbulPragma, {
    filename,
    babelrc: false,
    // compact: false,
    only: filename,
    presets: ['node6', 'stage-2'],
    plugins: [instrumenter],
  })
  // process.stdout.write('\n\ninstrumentedCode\n\n' + code)
  return requireFromString(code, actualFilepath || filename)
}

/**
 * Instruments source code and dynamically loads the instrumented code.
 * @param{String} filename the file containing the instrumentation results
 * @param{String} sourceCode the code to be instrumented
 * @param{String} actualFilepath the path to the module with the code to be instrumented
 * @returns{Object} the module object of the instrumented module
 */

function getInstrumentedModuleFromStringC(
  filename,
  sourceCode,
  actualFilepath,
) {
  //console.log(`instr`)

  // for the original source, we don't want to ignore anything
  // but there are some cases where we have to create
  // empty functions that aren't covered
  // to ensure that the resulting code functions properly.
  // So we add an obnoxiously long comment
  // and replace it here.
  return new Promise((resolve, reject) => {
    const sourceCodeWithoutIstanbulPragma = sourceCode
      .replace(/istanbul/g, 'ignore-istanbul-ignore')
      .replace(/slice-js-coverage-ignore/g, 'istanbul')

    //instrument code
    const {code} = babel.transform(sourceCodeWithoutIstanbulPragma, {
      filename,
      babelrc: false,
      // compact: false,
      only: filename,
      presets: ['node6', 'stage-2'],
      plugins: [instrumenter],
    })

    //console.log(`loading instr code`)

    //load (execute) the instrumented module code and
    //resolve promise with the instrumented module's module object
    // process.stdout.write('\n\ninstrumentedCode\n\n' + code)

    resolve(requireFromString(code, actualFilepath || filename))
  })
}

/*
 * copied and modified from require-from-string
 */
function requireFromString(code, filepath) {
  const m = new Module(filepath, module.parent)
  m.filename = filepath
  m.paths = Module._nodeModulePaths(path.dirname(filepath))
  m._compile(code, filepath)

  //console.log(m);

  //always run the function, in order to obtain a slice
  //wrap the analyzed code to a function, in order not to be executed during module loading
  let func = m.exports.default

  try {
    func()
    return m.exports
  } catch (err) {
    console.log(`Error in slice generation: the analyzed code contains bugs.`)
    console.log(err)

    //add a surrogate property to m.exports
    //(return an empty slice for buggy test code)
    m.exports.err = true
    return m.exports
  }

  //func()
  //return m.exports
}

/*
 * copied and modified from require-from-string
 */
function requireFromStringC(code, filepath) {
  //console.log(`importing mod: ${filepath}`)
  //return import(filepath);

  let instrModule = `./instrModule.js`
  let instrModuleAbsPath = path.resolve(instrModule)
  fs.writeFileSync(instrModuleAbsPath, code, 'utf-8')

  console.log(`Wrote ${instrModuleAbsPath}`)

  return new Promise((resolve, reject) => {
    console.log('loading prom')

    //resolve(eval(code));

    //const m = new Module(filepath, module.parent)
    //m.filename = filepath
    //m.paths = Module._nodeModulePaths(path.dirname(filepath))
    //m._compile(code, filepath)

    const modObj = require(instrModuleAbsPath)
    console.log(modObj)

    //console.log(m)
    //console.log(m.exports)
    console.log(`loaded module dynamically`)

    //const modObj = require(filepath);
    //console.log(modObj['____sliceCoverage____']);

    //resolve(require(filepath))
    //resolve({})
    //console.log(m.exports)
    //resolve(m.exports);
  })
}

function requireFromStringCUPD(code, filepath) {
  console.log('loading prom')

  const Mocha = require('mocha')

  const mocha = new Mocha({})

  //run the tests from the instrumented module
  //in the example, the instrumented module is loaded dynamically, not the initial module
  mocha.addFile(filepath)

  return new Promise((resolve, reject) => {
    return mocha.run().on('end', () => {
      console.log('All done')

      resolve(requireFromStringC(code, filepath))
    })
  })
}

function instrumenter({types: t}) {
  return {
    visitor: {
      Program: {
        enter(...args) {
          this.__dv__ = getInstrumentVisitor(t, this.file.opts.filename, {
            coverageVariable,
          })
          this.__dv__.enter(...args)
        },
        exit(...args) {
          this.__dv__.exit(...args)
          // expose coverage as part of the module
          const newNode = template(
            `module.exports.${coverageVariable} = global.${coverageVariable};`,
          )()
          args[0].node.body.push(newNode)
        },
      },
    },
  }
}
