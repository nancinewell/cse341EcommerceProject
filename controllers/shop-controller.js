const Product = require('../models/product');
const Cart = require('../models/cart');

// * * * * * * * * * * * * * * GET INDEX * * * * * * * * * * * * * *
exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// * * * * * * * * * * * * * * GET PRODUCT * * * * * * * * * * * * * *
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};
    
// * * * * * * * * * * * * * * GET CART * * * * * * * * * * * * * *
exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      const price = user.cart.totalPrice;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        price: price
      });
    })
    .catch(err => console.log(err));
};

// * * * * * * * * * * * * * * POST CART * * * * * * * * * * * * * *
  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        return req.user.addToCart(product);
      })
      .then(result => {
        res.redirect('/cart');
      });
  };

// * * * * * * * * * * * * * * POST CART DELETE PRODUCT * * * * * * * * * * * * * *
  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const qty = req.body.quantity;
    const price = req.body.price;
    req.user
      .removeFromCart(prodId, qty, price)
      .then(result => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
  };

  // * * * * * * * * * * * * * * GET ORDERS * * * * * * * * * * * * * *
  exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders'
    });
  };

// * * * * * * * * * * * * * * POST ORDER * * * * * * * * * * * * * *
  exports.postOrder = (req, res, next) => {
    req.user
      .populate('cart.items.productId')
      .then(user => {
        const products = user.cart.items.map(i => {
          return{quantity: i.quantity, product: {...i.productId._doc}}
        });
        const order = new Order({
          user: {
            name: req.user.name,
            userId: req.user
          },
          products: products
        });
        return order.save();
      })
      .then(result => {
        return req.user.clearCart();
      }).then(() => {
        res.redirect('/orders');
      })
      .catch(err => console.log(err));
  };
  /*
  
  FIX CHECKOUT PAGE
  
  */


  // * * * * * * * * * * * * * * GET CHECKOUT * * * * * * * * * * * * * *
  exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout'
    });
  };
  
  // * * * * * * * * * * * * * * POST SEARCH * * * * * * * * * * * * * *
  /*
  
  FIX THIS TO MONGOOSE!
  
  */
  exports.postSearch = (req, res, next) => {
    const search = req.body.search;
    Product.find({"title": { $regex: '.*'+search+'.*', $options: 'i' }})
    .then(products => {
        res.render('shop/index', {
        prods: products,
        pageTitle: 'Search Results',
        path: '/'
      });
    });
  };