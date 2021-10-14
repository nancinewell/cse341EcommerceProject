const port = process.env.PORT || 5000;
const path = require('path');
 
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');
const cors = require('cors') 
const app = express();
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const corsOptions = {
    origin: "https://newell-ecommerce.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(session({secret: 'aLongStringValue', resave: false, saveUninitialized: false}));

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(session({secret: 'aLongStringValue', resave: false, saveUninitialized: false, store: store}));
app.use(flash());

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/project?retryWrites=true&w=majority';

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("615cbf31533eac08ff42b06f")
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(`Error: ${err}`));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

  app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '404' });
  });
  
  mongoose
  .connect(
    MONGODB_URL
  ).then(result => {
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

      })
    //})
    .catch(err => {
    console.log(`Error: ${err}`);
  })//})

  