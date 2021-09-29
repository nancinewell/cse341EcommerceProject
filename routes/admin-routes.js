const express = require('express');

const adminController = require('../controllers/admin-controller');

const router = express.Router();

router.post('/search/', shopController.postSearch);

router.get('/', shopController.getIndex);

module.exports = router;