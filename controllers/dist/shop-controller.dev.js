"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["req.user: ", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Product = require('../models/product');

var Order = require('../models/orders'); // * * * * * * * * * * * * * * GET INDEX * * * * * * * * * * * * * *


exports.getIndex = function (req, res, next) {
  //get all products from db and render in index
  Product.find().then(function (products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
}; // * * * * * * * * * * * * * * GET PRODUCT * * * * * * * * * * * * * *


exports.getProduct = function (req, res, next) {
  //get product id from req params
  var prodId = req.params.productId; //locate product by id, then render the details page with product info

  Product.findById(prodId).then(function (product) {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuthenticated: req.session.isLoggedIn
    });
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
}; // * * * * * * * * * * * * * * GET CHECKOUT * * * * * * * * * * * * * *


exports.getCheckout = function (req, res, next) {
  console.log(_templateObject(), req.user);
  req.user.populate('cart.items.productId').then(function (user) {
    var products = user.cart.items;
    var price = user.cart.totalPrice;
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout',
      products: products,
      price: price
    });
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
}; // * * * * * * * * * * * * * * GET CART * * * * * * * * * * * * * *


exports.getCart = function (req, res, next) {
  //get the cart items and info from the req.user to render in the cart
  req.user.populate('cart.items.productId').then(function (user) {
    var products = user.cart.items;
    var price = user.cart.totalPrice;
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: products,
      price: price,
      isAuthenticated: req.session.isLoggedIn
    });
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
}; // * * * * * * * * * * * * * * POST CART * * * * * * * * * * * * * *


exports.postCart = function (req, res, next) {
  //get product id from req
  var prodId = req.body.productId; //locate product by id and add it to the cart

  Product.findById(prodId).then(function (product) {
    return req.user.addToCart(product);
  }).then(function (result) {
    //redirect to the cart
    res.redirect('/cart');
  });
}; // * * * * * * * * * * * * * * POST CART DELETE PRODUCT * * * * * * * * * * * * * *


exports.postCartDeleteProduct = function (req, res, next) {
  //gather product info from req
  var prodId = req.body.productId;
  var qty = req.body.quantity;
  var price = req.body.price; //remove from cart and redirect back to the cart

  req.user.removeFromCart(prodId, qty, price).then(function (result) {
    res.redirect('/cart');
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
}; // * * * * * * * * * * * * * * GET ORDERS * * * * * * * * * * * * * *


exports.getOrders = function (req, res, next) {
  //locate orders for this user and render orders page with info
  Order.find({
    'user.userId': req.user._id
  }).then(function (orders) {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn
    });
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
}; // * * * * * * * * * * * * * * POST ORDER * * * * * * * * * * * * * *


exports.postOrder = function (req, res, next) {
  //get price 
  var price = req.user.cart.totalPrice; //get product info from user's cart

  req.user.populate('cart.items.productId').then(function (user) {
    //get qty, and product info for each product in cart
    var products = user.cart.items.map(function (i) {
      return {
        quantity: i.quantity,
        product: _objectSpread({}, i.productId._doc)
      };
    }); //set date of order

    var date = new Date().toLocaleDateString('en-us', {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric"
    }).toString(); //create new order using the user, products, qty, date, and total price

    var order = new Order({
      products: products,
      totalPrice: price,
      date: date,
      user: {
        name: req.user.name,
        userId: req.user
      }
    }); //save the order

    return order.save();
  }).then(function (result) {
    //clear the cart
    return req.user.clearCart();
  }).then(function () {
    //redirect to the orders page
    res.redirect('/orders');
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
};
/*

FIX CHECKOUT PAGE

*/
// // * * * * * * * * * * * * * * GET CHECKOUT * * * * * * * * * * * * * *
// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
// * * * * * * * * * * * * * * POST SEARCH * * * * * * * * * * * * * *

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