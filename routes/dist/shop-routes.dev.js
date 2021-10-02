"use strict";

var express = require('express');

var shopController = require('../controllers/shop-controller');

var router = express.Router();
router.get('/orders', shopController.getOrders);
router.get('/checkout', shopController.getCheckout);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.get('/products/:productId', shopController.getProduct);
router.post('/search/', shopController.postSearch);
router.get('/', shopController.getIndex);
module.exports = router;