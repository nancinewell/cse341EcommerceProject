"use strict";

var Product = require('../models/product'); // * * * * * * * * * * * * * * GET PRODUCTS * * * * * * * * * * * * * *


exports.getProducts = function (req, res, next) {
  Product.find() //.select('title price -_id') //define which fields should be returned. list items desired, -item for exclusions
  //.populate('userId', 'name')//Mongoose will populate a field with all of the details instead of just the id!
  .then(function (products) {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}; // * * * * * * * * * * * * * * GET PRODUCT * * * * * * * * * * * * * *


exports.getAddProduct = function (req, res, next) {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
}; // * * * * * * * * * * * * * * ADD PRODUCTS * * * * * * * * * * * * * *


exports.postAddProduct = function (req, res, next) {
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  var price = req.body.price;
  var description = req.body.description;
  console.log(req.user);
  var product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id // Mongoose will simply pick out the id from the user. Or you can specify: req.user._id 

  }); //.save() is native to mongoose

  product.save().then(function (result) {
    console.log('Created Product');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    console.log(err);
  });
}; // * * * * * * * * * * * * * * GET EDIT PRODUCT * * * * * * * * * * * * * *


exports.getEditProduct = function (req, res, next) {
  var editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  var prodId = req.params.productId;
  Product.findById(prodId).then(function (product) {
    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })["catch"](function (err) {
    return console.log(err);
  });
}; // * * * * * * * * * * * * * * POST EDIT PRODUCT * * * * * * * * * * * * * *


exports.postEditProduct = function (req, res, next) {
  var prodId = req.body.productId;
  var updatedTitle = req.body.title;
  var updatedPrice = req.body.price;
  var updatedImageUrl = req.body.imageUrl;
  var updatedDesc = req.body.description;
  Product.findById(prodId).then(function (product) {
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save();
  }).then(function (result) {
    console.log('UPDATED PRODUCT!');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    return console.log(err);
  });
}; // * * * * * * * * * * * * * * POST DELETE PRODUCT * * * * * * * * * * * * * *


exports.postDeleteProduct = function (req, res, next) {
  var prodId = req.body.productId; //native Mongoose function... What about findByIdAndDelete()

  Product.findByIdAndRemove(prodId).then(function () {
    console.log('DESTROYED PRODUCT');
    res.redirect('/admin/products');
  })["catch"](function (err) {
    return console.log(err);
  });
};