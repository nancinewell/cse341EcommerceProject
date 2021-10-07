"use strict";

var port = process.env.PORT || 5000;

var path = require('path');

var mongoose = require('mongoose');

var express = require('express');

var bodyParser = require('body-parser');

var User = require('./models/user');

var cors = require('cors');

var app = express();
var corsOptions = {
  origin: "https://newell-ecommerce.herokuapp.com/",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
var MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/project?retryWrites=true&w=majority';
app.set('view engine', 'ejs');
app.set('views', 'views');

var adminRoutes = require('./routes/admin-routes');

var shopRoutes = require('./routes/shop-routes');

app.use(express["static"](path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(function (req, res, next) {
  User.findById("615cbf31533eac08ff42b06f").then(function (user) {
    req.user = user;
    next();
  })["catch"](function (err) {
    return console.log("Error: ".concat(err));
  });
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '404'
  });
});
mongoose.connect(MONGODB_URL).then(function (result) {
  // User.findOne().then(user =>{
  //   if(!user){
  //     const user = new User({
  //       name: 'AdminUser',
  //       email: 'admin@email.com',
  //       cart: {
  //         items: []
  //       }
  //     });
  //     user.save(); 
  app.listen(port);
}) //})
["catch"](function (err) {
  console.log("Error: ".concat(err));
}); //})