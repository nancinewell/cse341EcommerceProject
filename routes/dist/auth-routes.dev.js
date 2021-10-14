"use strict";

var express = require('express');

var authController = require('../controllers/auth-controller');

var router = express.Router();
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
module.exports = router;