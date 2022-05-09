'use strict';

var _ = require('./');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this is just here to make it so we can generate a coverage report with jest easily
if (global.test) {
  test('works', function () {});
}

//normalized paths to resolve module dependencies
var entryfileAbsPath = process.argv[process.argv.length - 2];
var testerVar = process.argv[process.argv.length - 1];

//console.log(entryfileAbsPath);
//console.log(testerVar);

function f() {

  return (0, _2.default)(require.resolve(entryfileAbsPath), function (_ref) {
    var _ref$tree = _ref.tree,
        tree = _ref$tree === undefined ? testerVar : _ref$tree;


    //return func()
    //return func();
    //return DynamicTree;
    //return query();
    //return f();
    return tree;

    //return a;
  }).then(function (res) {

    console.log(res);
  }).catch(function (err) {

    console.log('err: ' + err);
  });
}

f();