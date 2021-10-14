const express = require('express');

const shopController = require('../controllers/shop-controller');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/orders', isAuth, shopController.postOrder);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/checkout', isAuth, shopController.getCheckout);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.get('/checkout', isAuth, shopController.getCheckout);

router.get('/products/:productId', isAuth, shopController.getProduct);

router.post('/search/', isAuth, shopController.postSearch);

router.get('/', shopController.getIndex);

module.exports = router;