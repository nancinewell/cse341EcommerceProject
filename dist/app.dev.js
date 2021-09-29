"use strict";

var path = require('path');

var bodyParser = require('body-parser');

var express = require('express');

var app = express(); //app.use(bodyParser.urlencoded({extended: false}));

app.use(express["static"](path.join(__dirname, 'public')));

var adminRoutes = require('./routes/admin-routes');

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(function (req, res, next) {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '404'
  });
});
app.listen(3000);