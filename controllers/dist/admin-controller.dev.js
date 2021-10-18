"use strict";

var Product = require('../models/product'); // * * * * * * * * * * * * * * GET PRODUCTS * * * * * * * * * * * * * *


exports.getProducts = function (req, res, next) {
  //get all products from db
  Product.find().then(function (products) {
    //render the page using those products
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      user: req.user.name
    });
  })["catch"](function (err) {
    console.log("Error: ".concat(err));
  });
}; // * * * * * * * * * * * * * * GET ADD PRODUCT * * * * * * * * * * * * * *


exports.getAddProduct = function (req, res, next) {
  //send to add product page with page and authentication info
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    user: req.user.name
  });
}; // * * * * * * * * * * * * * * POST ADD PRODUCT * * * * * * * * * * * * * *


exports.postAddProduct = function (req, res, next) {
  //gather new product info from req
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  var price = req.body.price;
  var description = req.body.description; //create new product in db

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
    console.log("Error admin-controller 57: ".concat(err));
  });
}; // * * * * * * * * * * * * * * POST ADD ANOTHER PRODUCT * * * * * * * * * * * * * *


exports.postAddAnotherProduct = function (req, res, next) {
  //Mostly the same as save, but redirect back to the add-product page to save the user time.
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  var price = req.body.price;
  var description = req.body.description;
  var product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  }); //.save() is native to mongoose

  product.save().then(function (result) {
    console.log('Created Product');
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      user: req.user.name
    });
  })["catch"](function (err) {
    console.log(err);
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
      user: req.user.name
    });
  })["catch"](function (err) {
    return console.log("Error admin-controller 118: ".concat(err));
  });
}; // * * * * * * * * * * * * * * POST EDIT PRODUCT * * * * * * * * * * * * * *


exports.postEditProduct = function (req, res, next) {
  //gather updated product info
  var prodId = req.body.productId;
  var updatedTitle = req.body.title;
  var updatedPrice = req.body.price;
  var updatedImageUrl = req.body.imageUrl;
  var updatedDesc = req.body.description; //locate existing product in db

  Product.findById(prodId).then(function (product) {
    //update product details
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  }).then(function (result) {
    //log the success and redirect to admin products  
    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    return console.log("Error admin-controller 145: ".concat(err));
  });
}; // * * * * * * * * * * * * * * POST DELETE PRODUCT * * * * * * * * * * * * * *


exports.postDeleteProduct = function (req, res, next) {
  var prodId = req.body.productId; //locate the product and delete with native function

  Product.findByIdAndRemove(prodId).then(function () {
    //log success and redirect to admin products
    console.log('DESTROYED PRODUCT');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    return console.log("Error admin-controller 158: ".concat(err));
  });
};