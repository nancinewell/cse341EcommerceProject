"use strict";

var Product = require('../models/product');

exports.getProducts = function (req, res, next) {
  Product.fetchAll(function (products) {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      editing: false
    });
  });
};

exports.getAddProduct = function (req, res, next) {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = function (req, res, next) {
  var title = req.body.title;
  var imageUrl = req.body.imageUrl;
  var price = req.body.price;
  var description = req.body.description;
  var product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.getEditProduct = function (req, res, next) {
  var editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  var prodId = req.params.productId;
  Product.findById(prodId, function (product) {
    if (!product) {
      return res.redirect('/');
    }

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = function (req, res, next) {
  var prodId = req.body.productId;
  var updatedTitle = req.body.title;
  var updatedPrice = req.body.price;
  var updatedImageUrl = req.body.imageUrl;
  var updatedDesc = req.body.description;
  var updatedProduct = new Product(prodId, updatedTitle, updatedImageUrl, updatedDesc, updatedPrice);
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = function (req, res, next) {
  var prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};