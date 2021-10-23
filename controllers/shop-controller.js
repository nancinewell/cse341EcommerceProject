const Product = require('../models/product');
const Order = require('../models/orders');

// * * * * * * * * * * * * * * GET INDEX * * * * * * * * * * * * * *
exports.getIndex = (req, res, next) => {
  //get all products from db and render in index
  if(!req.user){
    Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Munchkin Madness',
        path: '/'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('shop controller 21');
      return next(error);
    });
  } else {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Munchkin Madness',
        path: '/',
        user: req.user.name
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('shop controller 37');
      return next(error);
    }
    );
  }
};

// * * * * * * * * * * * * * * GET PRODUCT * * * * * * * * * * * * * *
exports.getProduct = (req, res, next) => {
  //get product id from req params
  const prodId = req.params.productId;

  //locate product by id, then render the details page with product info
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        user: req.user.name
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('shop controller 60');
      return next(error);
    });
};
    



// * * * * * * * * * * * * * * GET CHECKOUT * * * * * * * * * * * * * *
exports.getCheckout = (req, res, next) => {
  console.log`req.user: ${req.user}`;
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      const price = user.cart.totalPrice;
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        price: price,
        user: req.user.name
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('shop controller 90');
      return next(error);
    });
};

// * * * * * * * * * * * * * * GET CART * * * * * * * * * * * * * *
exports.getCart = (req, res, next) => {
  //get the cart items and info from the req.user to render in the cart
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      const price = user.cart.totalPrice;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        price: price,
        user: req.user.name
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('shop controller 114');
      return next(error);
    });
};

// * * * * * * * * * * * * * * POST CART * * * * * * * * * * * * * *
  exports.postCart = (req, res, next) => {
    //get product id from req
    const prodId = req.body.productId;
    
    //locate product by id and add it to the cart
    Product.findById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        
        //redirect to the cart
        res.redirect('/cart');
      });
  };

// * * * * * * * * * * * * * * POST CART DELETE PRODUCT * * * * * * * * * * * * * *
  exports.postCartDeleteProduct = (req, res, next) => {
    //gather product info from req
    const prodId = req.body.productId;
    const qty = req.body.quantity;
    const price = req.body.price;

    //remove from cart and redirect back to the cart
    req.user
      .removeFromCart(prodId, qty, price)
      .then(result => {
        res.redirect('/cart');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log('shop controller 152');
        return next(error);
      });
  };

  // * * * * * * * * * * * * * * GET ORDERS * * * * * * * * * * * * * *
  exports.getOrders = (req, res, next) => {
    //locate orders for this user and render orders page with info
    Order.find({'user.userId' : req.user._id})
    .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders,
          user: req.user.name
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log('shop controller 172');
        return next(error);
      });
  };

// * * * * * * * * * * * * * * POST ORDER * * * * * * * * * * * * * *
  exports.postOrder = (req, res, next) => {
    //get price 
    let price = req.user.cart.totalPrice;
    
    //get product info from user's cart
    req.user
      .populate('cart.items.productId')
      .then(user => {

        //get qty, and product info for each product in cart
        const products = user.cart.items.map(i => {
          return{quantity: i.quantity, product: {...i.productId._doc}}
        });

        //set date of order
        const date = new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}).toString();
        
        //create new order using the user, products, qty, date, and total price
        const order = new Order({
          products: products,
          totalPrice: price,
          date: date,
          user: {
            name: req.user.name,
            userId: req.user
          }
        });

        //save the order
        return order.save();
      })
      .then(result => {

        //clear the cart
        return req.user.clearCart();
      }).then(() => {

        //redirect to the orders page
        res.redirect('/orders');
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log('shop controller 221');
        return next(error);
      });
  };
  
  // * * * * * * * * * * * * * * POST SEARCH * * * * * * * * * * * * * *
  exports.postSearch = (req, res, next) => {
    const search = req.body.search;
    let user = null;
    if(req.user){
      user = req.user.name;
    }

    Product.find({"title": { $regex: '.*'+search+'.*', $options: 'i' }})
    .then(products => {
        res.render('shop/index', {
        prods: products,
        pageTitle: 'Search Results',
        path: '/',
        editing: false,
        user: user
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('shop controller 247');
      return next(error);
    });
  }
  


