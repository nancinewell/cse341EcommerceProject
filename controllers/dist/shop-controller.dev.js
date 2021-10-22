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
  if (!req.user) {
    Product.find().then(function (products) {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })["catch"](function (err) {
      var error = new Error(err);
      error.httpStatusCode = 500;
      console.log('shop controller 21');
      return next(error);
    });
  } else {
    Product.find().then(function (products) {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        user: req.user.name
      });
    })["catch"](function (err) {
      var error = new Error(err);
      error.httpStatusCode = 500;
      console.log('shop controller 37');
      return next(error);
    });
  }
}; // * * * * * * * * * * * * * * GET PRODUCT * * * * * * * * * * * * * *


exports.getProduct = function (req, res, next) {
  //get product id from req params
  var prodId = req.params.productId; //locate product by id, then render the details page with product info

  Product.findById(prodId).then(function (product) {
    res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      user: req.user.name
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('shop controller 60');
    return next(error);
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
      price: price,
      user: req.user.name
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('shop controller 90');
    return next(error);
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
      user: req.user.name
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('shop controller 114');
    return next(error);
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
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('shop controller 152');
    return next(error);
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
      user: req.user.name
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('shop controller 172');
    return next(error);
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
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('shop controller 221');
    return next(error);
  });
}; // * * * * * * * * * * * * * * POST SEARCH * * * * * * * * * * * * * *


exports.postSearch = function (req, res, next) {
  var search = req.body.search;
  var user = null;

  if (req.user) {
    user = req.user.name;
  }

  Product.find({
    "title": {
      $regex: '.*' + search + '.*',
      $options: 'i'
    }
  }).then(function (products) {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Search Results',
      path: '/',
      editing: false,
      user: user
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('shop controller 247');
    return next(error);
  });
};