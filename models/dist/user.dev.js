"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Product = require('../models/product');

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    totalPrice: {
      type: Number
    }
  }
});

userSchema.methods.addToCart = function (product) {
  var cartProductIndex = this.cart.items.findIndex(function (cp) {
    return cp.productId.toString() === product._id.toString();
  });
  var newQuantity = 1;

  var updatedCartItems = _toConsumableArray(this.cart.items);

  var newTotalPrice = product.price;

  if (this.cart.totalPrice) {
    newTotalPrice = this.cart.totalPrice + product.price;
  }

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    newTotalPrice = this.cart.totalPrice + product.price;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });

    newTotalPrice: product.price;
  }

  var updatedCart = {
    items: updatedCartItems,
    totalPrice: newTotalPrice
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId, qty, price) {
  //we have quantity and price of product being removed fed by the parameters
  //remove product(s) from cart
  var updatedCartItems = this.cart.items.filter(function (item) {
    return item.productId.toString() !== productId.toString();
  }); //calculate price

  var beginingPrice = this.cart.totalPrice;
  var totalProductPrice = price * qty;
  var newTotalPrice = beginingPrice - totalProductPrice; //update cart

  this.cart = {
    items: updatedCartItems,
    totalPrice: newTotalPrice
  }; //this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = {
    items: [],
    totalPrice: 0
  };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);