"use strict";

module.exports = function (req, res, next) {
  //if session is not signed in, return to login page
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }

  next();
};