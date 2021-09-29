"use strict";

var express = require('express');

var adminController = require('../controllers/admin-controller');

var router = express.Router();
router.post('/search/', shopController.postSearch);
router.get('/', shopController.getIndex);
module.exports = router;