"use strict";

var User = require('../models/user');

var bcrypt = require('bcryptjs');

var nodemailer = require('nodemailer');

var sendgridTransport = require('nodemailer-sendgrid-transport');

var transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: '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'
  }
})); // * * * * * * * * * * GET LOGIN * * * * * * * * * * 

exports.getLogin = function (req, res, next) {
  //set message
  var message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  } //render login page


  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    isAuthenticated: false,
    errorMessage: message
  });
}; // * * * * * * * * * * POST LOGIN * * * * * * * * * * 


exports.postLogin = function (req, res, next) {
  //gather info from request
  var email = req.body.email;
  var password = req.body.password; //does the user exist? Compare by email

  User.findOne({
    email: email
  }).then(function (user) {
    //if email address is not in the system, send user back to login page with error message.
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    } //The email exists. Compare the hashed password in mongodb with the hashed password passed through the req.


    bcrypt.compare(password, user.password).then(function (theyMatch) {
      //if they match, then set the session info
      if (theyMatch) {
        req.session.user = user;
        req.session.isLoggedIn = true; //save the session, log any errors, and send Home

        return req.session.save(function (err) {
          console.log("Error: ".concat(err));
          res.redirect('/');
        });
      } //If they don't match, then send back to login page with error message.


      req.flash('error', 'Invalid email or password');
      res.redirect('/login');
    }) //catch any errors, log them, and redirect to login page.
    ["catch"](function (err) {
      console.log("Error: ".concat(err));
      res.redirect('/login');
    });
  }) //catch any errors and log them.
  ["catch"](function (err) {
    console.log("Error: ".concat(err));
  });
}; // * * * * * * * * * * POST LOGOUT * * * * * * * * * * 


exports.postLogout = function (req, res, next) {
  //destroy the session, log any errors, and redirect Home
  req.session.destroy(function (err) {
    console.log("Error: ".concat(err));
    res.redirect('/');
  });
}; // * * * * * * * * * * GET SIGNUP * * * * * * * * * * 


exports.getSignup = function (req, res, next) {
  //set message
  var message = req.flash('error');

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  } //send to signup page with page info


  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false,
    errorMessage: message
  });
}; // * * * * * * * * * * POST SIGNUP * * * * * * * * * * 


exports.postSignup = function (req, res, next) {
  //gather info from form
  var email = req.body.email;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword; //Does user already exist?

  User.findOne({
    email: email
  }).then(function (userdoc) {
    //if email already exists, redirect to login page with error message
    if (userDoc) {
      req.flash('error', 'Email already exists. Please log in.');
      return res.redirect('/login');
    }
    /* * * * * * * * * * * * compare passwords to ensure they match * * * * * * * * * * */
    //If email doesn't exist, hash the password 12 times for good measure.


    return bcrypt.hash(password, 12) //then create a new user with the hashed password
    .then(function (hashedPassword) {
      var user = new User({
        email: email,
        password: hashedPassword,
        cart: {
          items: []
        }
      }); //save the new user

      return user.save();
    }) //then redirect to login and send confirmation email
    .then(function (result) {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'nanci.newell@gmail.com',
        subject: 'Thanks for Signing Up!',
        html: "<h1>You've successfully signed up for Munchkin Madness!</h1><p>We're so happy to find another kindred spirit ready to take down their friends with silliness and adventure!</p>"
      }, function (err, info) {
        //log any errors or sucesses
        if (err) {
          console.log("Error: ".concat(err));
        } else {
          console.log("Message sent: ".concat(info));
        }
      });
    })["catch"](function (err) {
      console.log("Error: ".concat(err));
    });
  })["catch"](function (err) {
    console.log("Error: ".concat(err));
  });
};