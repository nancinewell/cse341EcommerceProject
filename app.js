const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const adminRoutes = require('./routes/admin-routes');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '404' });
  });

app.listen(3000);