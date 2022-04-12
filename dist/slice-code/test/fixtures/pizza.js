'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makePizza = makePizza;


var pizzaTypes = ['cheese', 'pepperoni', 'meatLovers', 'supreme'];

var getCrust = function getCrust(size, crustType) {
  return size + ': ' + (crustType || 'Hand tossed pizza');
};
var getSauce = function getSauce(size, sauceType) {
  return size + ': ' + sauceType;
};
var getCheese = function getCheese(size, cheeseType) {
  return size + ': ' + cheeseType + ' cheese';
};
var getMeats = function getMeats(size, meats) {
  return size + ': ' + meats.join(', ');
};
var getVeggies = function getVeggies(size, veggies) {
  return size + ': ' + veggies.join(', ');
};

function makePizza(order) {
  if (!pizzaTypes.includes(order.type)) {
    throw new Error(order.type + ' pizza \uD83C\uDF55 is not available \uD83D\uDE26');
  }
  var pizza = {
    type: order.type,
    crust: getCrust(order.size, order.crustType),
    crustEdge: order.crustEdge || 'Garlic Buttery Blend',
    sauce: order.sauceType ? getSauce(order.size, order.sauceType) : undefined,
    cheese: order.cheeseType ? getCheese(order.size, order.cheeseType) : undefined,
    meats: order.meats ? getMeats(order.size, order.meats) : undefined,
    veggies: order.veggies ? getVeggies(order.size, order.veggies) : undefined
  };

  return preparePizza(pizza);
}

function preparePizza(pizza) {
  // todo...
  return pizza;
}