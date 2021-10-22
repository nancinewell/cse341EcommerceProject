"use strict";

var express = require('express');

var _require = require('express-validator'),
    body = _require.body;

var authController = require('../controllers/auth-controller');

var User = require('../models/user');

var router = express.Router();
router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/login', [body('email', 'Please enter a valid email').isEmail().normalizeEmail().trim(), body('password', "Passwords are at least 12 characters long.").isLength({
  min: 12
})], authController.postLogin);
router.post('/signup', [body('name').isString(), body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail().trim().custom(function (value, _ref) {
  var req = _ref.req;
  return User.findOne({
    email: value
  }).then(function (userDoc) {
    if (userDoc) {
      return Promise.reject('Email already exists. Please log in.');
    }
  })["catch"](function (err) {
    console.log("Error auth-route 51: ".concat(err));
  });
}), body('confirmPassword').custom(function (value, _ref2) {
  var req = _ref2.req;

  if (value != req.body.password) {
    throw new Error('Passwords have to match!');
  }

  return true;
}), body('password', "Passwords must be at least 12 characters long.").isLength({
  min: 12
}), body('securityAnswer1').exists().withMessage('Please enter an answer to the Security Question 1'), body('securityAnswer2').isString().withMessage('Please enter an answer to the Security Questions 2'), body('securityAnswer3').isString().withMessage('Please enter an answer to the Security Questions 3')], authController.postSignup);
router.post('/logout', authController.postLogout);
router.post('/reset', [body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail().trim()], authController.postReset);
router.post('/security-questions', authController.postSecurityQuestions);
router.post('/new-password', [body('confirmPassword').custom(function (value, _ref3) {
  var req = _ref3.req;

  if (value != req.body.password) {
    throw new Error('Passwords have to match!');
  }

  return true;
}), body('password', "Passwords must be at least 12 characters long.").isLength({
  min: 12
})], authController.postNewPassword);
module.exports = router;