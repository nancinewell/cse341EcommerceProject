"use strict";

var express = require('express');

var adminController = require('../controllers/admin-controller');

var isAuth = require('../middleware/is-auth');

var router = express.Router();
router.get('/products', isAuth, adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', isAuth, adminController.postAddProduct);
router.post('/add-another', isAuth, adminController.postAddAnotherProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
module.exports = router;