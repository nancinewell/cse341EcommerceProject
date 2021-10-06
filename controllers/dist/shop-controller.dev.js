"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["products: ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Product = require('../models/product');

var Cart = require('../models/cart'); // * * * * * * * * * * * * * * GET INDEX * * * * * * * * * * * * * *


exports.getIndex = function (req, res, next) {
  Product.find().then(function (products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })["catch"](function (err) {
    console.log(err);
  });
}; // * * * * * * * * * * * * * * GET PRODUCT * * * * * * * * * * * * * *


exports.getProduct = function (req, res, next) {
  var prodId = req.params.productId;
  Product.findById(prodId).then(function (product) {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products'
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}; // * * * * * * * * * * * * * * GET CART * * * * * * * * * * * * * *


exports.getCart = function (req, res, next) {
  req.user.populate('cart.items.productId').then(function (user) {
    var products = user.cart.items;
    var price = user.cart.totalPrice;
    console.log(_templateObject(), products);
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
      price: price
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}; // * * * * * * * * * * * * * * POST CART * * * * * * * * * * * * * *


exports.postCart = function (req, res, next) {
  var prodId = req.body.productId;
  Product.findById(prodId).then(function (product) {
    return req.user.addToCart(product);
  }).then(function (result) {
    console.log("postCart result: ".concat(result));
    res.redirect('/cart');
  });
}; // * * * * * * * * * * * * * * POST CART DELETE PRODUCT * * * * * * * * * * * * * *


exports.postCartDeleteProduct = function (req, res, next) {
  var prodId = req.body.productId;
  req.user.removeFromCart(prodId).then(function (result) {
    res.redirect('/cart');
  })["catch"](function (err) {
    return console.log(err);
  });
}; // * * * * * * * * * * * * * * GET ORDERS * * * * * * * * * * * * * *


exports.getOrders = function (req, res, next) {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
}; // * * * * * * * * * * * * * * POST ORDER * * * * * * * * * * * * * *


exports.postOrder = function (req, res, next) {
  req.user.populate('cart.items.productId').then(function (user) {
    var products = user.cart.items.map(function (i) {
      return {
        quantity: i.quantity,
        product: _objectSpread({}, i.productId._doc)
      };
    });
    var order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      products: products
    });
    return order.save();
  }).then(function (result) {
    return req.user.clearCart();
  }).then(function () {
    res.redirect('/orders');
  })["catch"](function (err) {
    return console.log(err);
  });
};
/*

FIX CHECKOUT PAGE

*/
// * * * * * * * * * * * * * * GET CHECKOUT * * * * * * * * * * * * * *


exports.getCheckout = function (req, res, next) {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
}; // * * * * * * * * * * * * * * POST SEARCH * * * * * * * * * * * * * *

/*

FIX THIS TO MONGOOSE!

*/


exports.postSearch = function (req, res, next) {
  var search = req.body.search;
  Product.find({
    "title": {
      $regex: '.*' + search + '.*',
      $options: 'i'
    }
  }).then(function (products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Search Results',
      path: '/'
    });
  });
};