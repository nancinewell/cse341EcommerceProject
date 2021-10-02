"use strict";

var path = require('path');

var bodyParser = require('body-parser');

var express = require('express');

var app = express(); //app.use(bodyParser.urlencoded({extended: false}));

app.use(express["static"](path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

var adminRoutes = require('./routes/admin-routes');

var shopRoutes = require('./routes/shop-routes');

app.use(express["static"](path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '404'
  });
});
app.listen(3000);