const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Game Shop',
        path: '/'
      });
    });
  };

  exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    
        Product.findById(prodId, product => {
            res.render('shop/product-detail', {product: product, pageTitle: product.title, path: '/products'});
        })
    
    };
    

  exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
      Product.fetchAll(products => {
        const cartProducts = [];
        for (product of products){
          const cartProductData = cart.products.find(
            prod => parseFloat(prod.id) === parseFloat(product.id)
            );
          if (cartProductData) {
            cartProducts.push({productData: product, qty: cartProductData.qty });
          }
        }
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: cartProducts,
          cart: cart
        });
      })
    })
  };

  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
      Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
  };

  exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
      Cart.deleteProduct(prodId, product.price);  
      res.redirect('/cart');
    });
  }

  exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders'
    });
  };

  exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Checkout'
    });
  };
  
  exports.postSearch = (req, res, next) => {
    const search = req.body.search.toLowerCase();
    let filteredProducts = [];
    Product.fetchAll(products => {
        filteredProducts = products.filter( product => product.title.toLowerCase().includes(search));
        res.render('shop/index', {
        prods: filteredProducts,
        pageTitle: 'Search Results',
        path: '/'
      });
    });
  };