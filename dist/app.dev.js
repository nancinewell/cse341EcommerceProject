"use strict";

var port = process.env.PORT || 5000;

var path = require('path');

var express = require('express');

var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);

var csrf = require('csurf');

var flash = require('connect-flash');

var User = require('./models/user');

var MONGODB_URI = 'mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/project?retryWrites=true&w=majority';

var cors = require('cors');

var app = express();
var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
var csrfProtection = csrf();
var corsOptions = {
  origin: "https://newell-ecommerce.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); //EJS, set views

app.set('view engine', 'ejs');
app.set('views', 'views'); //establish routes

var adminRoutes = require('./routes/admin-routes');

var shopRoutes = require('./routes/shop-routes');

var authRoutes = require('./routes/auth-routes'); //set path roots


app.use(express["static"](path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false
})); //start session

app.use(session({
  secret: '2Nephi9:29_Ether12:6',
  resave: false,
  saveUninitialized: false,
  store: store
})); //use csurf to prevent cross site attacks

app.use(csrfProtection); //after the session started, before routes

app.use(flash()); //find user to pass through requests if user is logged in

app.use(function (req, res, next) {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id).then(function (user) {
    req.user = user;
    next();
  })["catch"](function (err) {
    return console.log("Error app.js 59: ".concat(err));
  });
}); //set up middleware to send authentication and csrf token on every view rendered

app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
}); //use routes

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes); //error if no route/page found

app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '404'
  });
}); //connection configuration 

var config = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}; //connect

mongoose.connect(MONGODB_URI, config).then(function (result) {
  app.listen(port);
})["catch"](function (err) {
  console.log("Error: ".concat(err));
});