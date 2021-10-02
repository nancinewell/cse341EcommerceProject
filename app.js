const PORT = process.env.PORT || 3000
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

//app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

  app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '404' });
  });

app.listen(PORT);