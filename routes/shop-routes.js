const express = require('express');

const shopController = require('../controllers/shop-controller');

const router = express.Router();

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.get('/products/:productId', shopController.getProduct);

router.post('/search/', shopController.postSearch);

router.get('/', shopController.getIndex);

module.exports = router;