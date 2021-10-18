const port = process.env.PORT || 5000;
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://nodeuser:p1ngpong@cluster0.f2qqp.mongodb.net/project?retryWrites=true&w=majority';

const cors = require('cors') 
const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

const corsOptions = {
    origin: "https://newell-ecommerce.herokuapp.com/",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//EJS, set views
app.set('view engine', 'ejs');
app.set('views', 'views');

//establish routes
const adminRoutes = require('./routes/admin-routes');
const shopRoutes = require('./routes/shop-routes');
const authRoutes = require('./routes/auth-routes');

//set path roots
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

//start session
app.use(session({secret: '2Nephi9:29_Ether12:6', resave: false, saveUninitialized: false, store: store}));

//use csurf to prevent cross site attacks
app.use(csrfProtection); //after the session started, before routes

app.use(flash());

//find user to pass through requests if user is logged in
app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => console.log(`Error app.js 59: ${err}`));
});


//set up middleware to send authentication and csrf token on every view rendered
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


//use routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//error if no route/page found
app.use((req, res, next) => {
  res.status(404).render('404', { pageTitle: 'Page Not Found', path: '404' });
});
  
//connection configuration 
const config = {
  autoIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

//connect
mongoose
  .connect(
    MONGODB_URI, config)
  .then(result => {
    app.listen(port);
  })
  .catch(err => {
    console.log(`Error: ${err}`);
  });