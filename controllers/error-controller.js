  exports.get404 = (req, res, next) => {
    let user = null;
    if(req.session.isLoggedIn){
      user = req.user.name;
    }
    res.status(404).render('404', { 
      pageTitle: 'Page Not Found', 
      path: '/404',
      isAuthenticated: req.session.isLoggedIn,
      user: user });
  };
  
  exports.get500 = (error, req, res, next) => {
    console.log`${error}`;
    let user = null;
    if(req.session.isLoggedIn){
      user = req.user.name;
    }
    res.status(500).render('500', { 
      pageTitle: 'Error', 
      path: '/500',
      isAuthenticated: req.session.isLoggedIn,
      user: user });
  };