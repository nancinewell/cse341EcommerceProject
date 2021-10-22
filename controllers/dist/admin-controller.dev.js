"use strict";

function _templateObject2() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Product = require('../models/product');

var _require = require('express-validator/check'),
    validationResult = _require.validationResult; // * * * * * * * * * * * * * * GET PRODUCTS * * * * * * * * * * * * * *


exports.getProducts = function (req, res, next) {
  //get all products from db
  Product.find({
    userId: req.user._id
  }).then(function (products) {
    //render the page using those products
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      user: req.user.name
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('admin-controller 20');
    return next(error);
  });
}; // * * * * * * * * * * * * * * GET ADD PRODUCT * * * * * * * * * * * * * *


exports.getAddProduct = function (req, res, next) {
  //send to add product page with page and authentication info
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    user: req.user.name,
    errorMessage: [],
    hasError: false,
    validationErrors: []
  });
}; // * * * * * * * * * * * * * * POST ADD PRODUCT * * * * * * * * * * * * * *


exports.postAddProduct = function (req, res, next) {
  //gather new product info from req
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  var price = req.body.price;
  var description = req.body.description; //handle validation errors

  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(_templateObject(), errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      user: req.user.name,
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      validationErrors: errors.array()
    });
  } //create new product in db


  var product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  }); //Save new product.   .save() is native to mongoose. 

  product.save().then(function (result) {
    //log success and redirect to admin products
    console.log('Created Product');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    console.log("admin-controller 83: ".concat(err));
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      user: req.user.name,
      isAuthenticated: false,
      errorMessage: [],
      hasError: false,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      validationErrors: errors.array()
    });
  });
}; // * * * * * * * * * * * * * * POST ADD ANOTHER PRODUCT * * * * * * * * * * * * * *


exports.postAddAnotherProduct = function (req, res, next) {
  //Mostly the same as save, but redirect back to the add-product page to save the user time.
  //gather new product info from req
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  var price = req.body.price;
  var description = req.body.description; //handle validation errors

  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(_templateObject2(), errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      user: req.user.name,
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      validationErrors: errors.array()
    });
  } //create new product in db


  var product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  }); //Save new product.   .save() is native to mongoose. 

  product.save().then(function (result) {
    //log success and redirect to admin products
    console.log('Created Product');
    res.redirect('/admin/add-product');
  })["catch"](function (err) {
    console.log("admin-controller 142: ".concat(err));
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      user: req.user.name,
      isAuthenticated: false,
      errorMessage: [],
      hasError: false,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      validationErrors: errors.array()
    });
  });
}; // * * * * * * * * * * * * * * GET EDIT PRODUCT * * * * * * * * * * * * * *


exports.getEditProduct = function (req, res, next) {
  //Is the user in edit mode? Only allow access if in edit mode.
  var editMode = req.query.edit; //if not in edit mode, redirect Home

  if (!editMode) {
    return res.redirect('/');
  } //gather product id from params and locate product 


  var prodId = req.params.productId;
  Product.findById(prodId).then(function (product) {
    //if no product, redirect Home
    if (!product) {
      return res.redirect('/');
    } //if product found, send to edit product with product info


    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      hasError: false,
      user: req.user.name,
      errorMessage: "",
      validationErrors: []
    });
  })["catch"](function (err) {
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('admin-controller 131');
    return next(error);
  });
}; // * * * * * * * * * * * * * * POST EDIT PRODUCT * * * * * * * * * * * * * *


exports.postEditProduct = function (req, res, next) {
  //gather updated product info
  var prodId = req.body.productId;
  var updatedTitle = req.body.title;
  var updatedPrice = req.body.price;
  var updatedImageUrl = req.body.imageUrl;
  var updatedDesc = req.body.description; //check for validation errors

  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc
      },
      isAuthenticated: req.session.isLoggedIn,
      hasError: true,
      errorMessage: errors.array()[0].msg
    });
  } //locate existing product in db


  Product.findById(prodId).then(function (product) {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }

    console.log("In the PostEditProduct function"); //update product details

    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    console.log("admin-controller 216 about to update product");
    return product.save().then(function (result) {
      //log the success and redirect to admin products  
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })["catch"](function (err) {
      res.redirect('/admin/edit-product/:prodId');
      console.log("admin-controller 225 {$err}");
    });
  })["catch"](function (err) {
    //res.redirect('/admin/edit-product/:prodId');
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('admin-controller 253');
    return next(error);
  });
}; // * * * * * * * * * * * * * * POST DELETE PRODUCT * * * * * * * * * * * * * *


exports.postDeleteProduct = function (req, res, next) {
  var prodId = req.body.productId; //locate the product and delete with native function

  Product.deleteOne({
    _id: prodId,
    userId: req.user._id
  }).then(function () {
    //log success and redirect to admin products
    console.log('DESTROYED PRODUCT');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    // res.redirect('/');
    var error = new Error(err);
    error.httpStatusCode = 500;
    console.log('admin-controller 131');
    return next(error);
  });
};