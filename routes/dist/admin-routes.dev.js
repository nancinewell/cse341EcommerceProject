"use strict";

var express = require('express');

var _require = require('express-validator'),
    body = _require.body;

var adminController = require('../controllers/admin-controller');

var isAuth = require('../middleware/is-auth');

var router = express.Router();
router.get('/products', isAuth, adminController.getProducts);
router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/add-product', [body('title', 'Please enter a valid title for your product').isString(), body('imageUrl', 'Please provide a valid URL for the image of your product').isURL().trim().isLength({
  min: 5
}), body('price', 'Please provide a valid amount for your product price. No dollar sign please.').isDecimal({
  max: 2
}), body('description', 'Please provide a valid description for your product.').isString().trim().isLength({
  min: 5
})], isAuth, adminController.postAddProduct);
router.post('/add-another', [body('title', 'Please enter a valid title for your product').isString(), body('imageUrl', 'Please provide a valid URL for the image of your product').isURL().trim().isLength({
  min: 5
}), body('price', 'Please provide a valid amount for your product price. No dollar sign please.').isDecimal({
  max: 2
}), body('description', 'Please provide a valid description for your product.').isString().trim().isLength({
  min: 5
})], isAuth, adminController.postAddAnotherProduct);
router.post('/edit-product', [body('title', 'Please enter a valid title for your product').isString(), body('imageUrl', 'Please provide a valid URL for the image of your product').isURL().trim().isLength({
  min: 5
}), body('price', 'Please provide a valid amount for your product price. No dollar sign please.').isDecimal({
  max: 2
}), body('description', 'Please provide a valid description for your product.').isString().trim().isLength({
  min: 5
})], isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
module.exports = router;