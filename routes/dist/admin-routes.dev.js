"use strict";

var express = require('express');

var adminController = require('../controllers/admin-controller');

var router = express.Router();
router.get('/products', adminController.getProducts);
router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);
module.exports = router;