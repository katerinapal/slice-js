"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * This module should be located in the same directory with 
 * the initial test module for analysis of module deps.
 * Added to keep analysis fixture code.
*/

var expect = require("/home/katerina/visualStudioGit/evaluationProjects/planck.js/test/testutil/expect.js");
var sinon = require('sinon');
//var sinon = require('../node_modules/sinon');

var Vec2 = require("/home/katerina/visualStudioGit/evaluationProjects/planck.js/lib/common/Vec2.js");
var AABB = require("/home/katerina/visualStudioGit/evaluationProjects/planck.js/lib/collision/AABB.js");
var DynamicTree = require("/home/katerina/visualStudioGit/evaluationProjects/planck.js/lib/collision/DynamicTree.js");

/**
 * Slicing can't be applied in the initial test code  
 * since it() runs asynchronously
 * (slices produced before running tests, thus incomplete)
*/

/*describe('Collision', function() {

  it('DynamicTree', function() {
    
    var tree = new DynamicTree();

    var foo = tree.createProxy(AABB(Vec2(0, 0), Vec2(1, 1)), 'foo');
    var bar = tree.createProxy(AABB(Vec2(1, 1), Vec2(2, 2)), 'bar');
    var baz = tree.createProxy(AABB(Vec2(2, 2), Vec2(3, 3)), 'baz');

    expect(tree.getHeight()).be(2);

    expect(tree.getUserData(foo)).be('foo');
    expect(tree.getUserData(bar)).be('bar');
    expect(tree.getUserData(baz)).be('baz');

    expect(tree.getFatAABB(foo).upperBound.x).be.above(1);
    expect(tree.getFatAABB(foo).upperBound.y).be.above(1);
    expect(tree.getFatAABB(foo).lowerBound.x).be.below(0);
    expect(tree.getFatAABB(foo).lowerBound.y).be.below(0);

    var QueryCallback = sinon.spy();
    var callback = QueryCallback;

    tree.query(AABB(Vec2(1, 1), Vec2(2, 2)), callback);
    expect(QueryCallback.calledWith(foo)).be(true);
    expect(QueryCallback.calledWith(bar)).be(true);
    expect(QueryCallback.calledWith(baz)).be(true);

    tree.query(AABB(Vec2(0.3, 0.3), Vec2(0.7, 0.7)),callback);
    expect(QueryCallback.lastCall.calledWith(foo)).be(true);

    tree.query(AABB(Vec2(1.3, 1.3), Vec2(1.7, 1.7)), callback);
    expect(QueryCallback.lastCall.calledWith(bar)).be(true);

    tree.query(AABB(Vec2(2.3, 2.3), Vec2(2.7, 2.7)), callback);
    expect(QueryCallback.lastCall.calledWith(baz)).be(true);

    expect(tree.moveProxy(foo, AABB(Vec2(0, 0), Vec2(1, 1)), Vec2(0.01, 0.01))).be(false);

    expect(tree.moveProxy(baz, AABB(Vec2(3, 3), Vec2(4, 4)), Vec2(0, 0))).be(true);

    tree.query(AABB(Vec2(3.3, 3.3), Vec2(3.7, 3.7)), callback);
    expect(QueryCallback.lastCall.calledWith(baz)).be(true);

    tree.destroyProxy(foo);
    expect(tree.getHeight()).be(1);

    tree.destroyProxy(bar);
    expect(tree.getHeight()).be(0);

    tree.destroyProxy(baz);
    expect(tree.getHeight()).be(0);

  });

  it('BroadPhase', function() {
    var bp = new BroadPhase();

    var AddPair = sinon.spy();
    var callback = AddPair;

    var foo = bp.createProxy(AABB(Vec2(0, 0), Vec2(1, 1)), 'foo');
    var bar = bp.createProxy(AABB(Vec2(2, 2), Vec2(3, 3)), 'bar');

    bp.updatePairs(callback);
    expect(AddPair.callCount).be(0);

    var baz = bp.createProxy(AABB(Vec2(1, 1), Vec2(2, 2)), 'baz');

    AddPair.reset();
    bp.updatePairs(callback);
    expect(AddPair.callCount).be(2);
    expect(AddPair.calledWith('bar', 'baz')).be(true);
    expect(AddPair.calledWith('foo', 'baz')).be(true);

    bp.moveProxy(baz, AABB(Vec2(0.5, 0.5), Vec2(1.5, 1.5)), Vec2());

    AddPair.reset();
    bp.updatePairs(callback);
    expect(AddPair.callCount).be(1);
    expect(AddPair.calledWith('foo', 'baz')).be(true);

  });

});*/

/**
 * Running analysis on the test callback,
 * avoid test execution asynchronisity. 
 * Maybe I shouldn't care about test execution at this phase.
*/

/*function f() {

    var tree = new DynamicTree();
    var tree2 = new DynamicTree();

    var foo2 = tree2.createProxy(AABB(Vec2(0, 0), Vec2(1, 1)), 'foo2');
  
    var foo = tree.createProxy(AABB(Vec2(0, 0), Vec2(1, 1)), 'foo');

    var foo2 = 5;
    var foo3 = foo2;
    foo3++;
    //console.log(foo3);

    var bar2 = tree2.createProxy(AABB(Vec2(1, 1), Vec2(2, 2)), 'bar2');
    var baz2 = tree2.createProxy(AABB(Vec2(2, 2), Vec2(3, 3)), 'baz2');

    var bar = tree.createProxy(AABB(Vec2(1, 1), Vec2(2, 2)), 'bar');
    var baz = tree.createProxy(AABB(Vec2(2, 2), Vec2(3, 3)), 'baz');

    expect(tree.getHeight()).be(2);
  
    expect(tree.getUserData(foo)).be('foo');
    expect(tree.getUserData(bar)).be('bar');
    expect(tree.getUserData(baz)).be('baz');
  
    expect(tree.getFatAABB(foo).upperBound.x).be.above(1);
    expect(tree.getFatAABB(foo).upperBound.y).be.above(1);
    expect(tree.getFatAABB(foo).lowerBound.x).be.below(0);
    expect(tree.getFatAABB(foo).lowerBound.y).be.below(0);
  
    var QueryCallback = sinon.spy();
    var callback = QueryCallback;

    //return 5;
  
    tree.query(AABB(Vec2(1, 1), Vec2(2, 2)), callback);
    expect(QueryCallback.calledWith(foo)).be(true);
    expect(QueryCallback.calledWith(bar)).be(true);
    expect(QueryCallback.calledWith(baz)).be(true);
  
    tree.query(AABB(Vec2(0.3, 0.3), Vec2(0.7, 0.7)),callback);
    expect(QueryCallback.lastCall.calledWith(foo)).be(true);
  
    tree.query(AABB(Vec2(1.3, 1.3), Vec2(1.7, 1.7)), callback);
    expect(QueryCallback.lastCall.calledWith(bar)).be(true);
  
    tree.query(AABB(Vec2(2.3, 2.3), Vec2(2.7, 2.7)), callback);
    expect(QueryCallback.lastCall.calledWith(baz)).be(true);
  
    expect(tree.moveProxy(foo, AABB(Vec2(0, 0), Vec2(1, 1)), Vec2(0.01, 0.01))).be(false);
  
    expect(tree.moveProxy(baz, AABB(Vec2(3, 3), Vec2(4, 4)), Vec2(0, 0))).be(true);
  
    tree.query(AABB(Vec2(3.3, 3.3), Vec2(3.7, 3.7)), callback);
    expect(QueryCallback.lastCall.calledWith(baz)).be(true);
  
    tree.destroyProxy(foo);
    expect(tree.getHeight()).be(1);
  
    tree.destroyProxy(bar);
    expect(tree.getHeight()).be(0);
  
    tree.destroyProxy(baz);
    expect(tree.getHeight()).be(0);
  
    //g();
  };

function g() {

  console.log(`dummy unused function`);
}
  
export default f;*/

var expObj = function expObj() {
  var tree = new DynamicTree();

  var foo = tree.createProxy(AABB(Vec2(0, 0), Vec2(1, 1)), 'foo');
  var bar = tree.createProxy(AABB(Vec2(1, 1), Vec2(2, 2)), 'bar');
  var baz = tree.createProxy(AABB(Vec2(2, 2), Vec2(3, 3)), 'baz');

  tree.getHeight();

  tree.getUserData(foo);
  tree.getUserData(bar);
  tree.getUserData(baz);

  tree.getFatAABB(foo).upperBound.x;
  tree.getFatAABB(foo).upperBound.y;
  tree.getFatAABB(foo).lowerBound.x;
  tree.getFatAABB(foo).lowerBound.y;

  var QueryCallback = sinon.spy();
  var callback = QueryCallback;

  tree.query(AABB(Vec2(1, 1), Vec2(2, 2)), callback);
  QueryCallback.calledWith(foo);
  QueryCallback.calledWith(bar);
  QueryCallback.calledWith(baz);

  tree.query(AABB(Vec2(0.3, 0.3), Vec2(0.7, 0.7)), callback);
  QueryCallback.lastCall.calledWith(foo);

  tree.query(AABB(Vec2(1.3, 1.3), Vec2(1.7, 1.7)), callback);
  QueryCallback.lastCall.calledWith(bar);

  tree.query(AABB(Vec2(2.3, 2.3), Vec2(2.7, 2.7)), callback);
  QueryCallback.lastCall.calledWith(baz);

  tree.moveProxy(foo, AABB(Vec2(0, 0), Vec2(1, 1)), Vec2(0.01, 0.01));

  tree.moveProxy(baz, AABB(Vec2(3, 3), Vec2(4, 4)), Vec2(0, 0));

  tree.query(AABB(Vec2(3.3, 3.3), Vec2(3.7, 3.7)), callback);
  QueryCallback.lastCall.calledWith(baz);

  tree.destroyProxy(foo);
  tree.getHeight();

  tree.destroyProxy(bar);
  tree.getHeight();

  tree.destroyProxy(baz);
  tree.getHeight();
};

exports.default = expObj;
module.exports = exports.default;