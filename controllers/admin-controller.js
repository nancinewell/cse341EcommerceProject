const Product = require('../models/product');
const { validationResult } = require('express-validator/check');

// * * * * * * * * * * * * * * GET PRODUCTS * * * * * * * * * * * * * *
exports.getProducts = (req, res, next) => {
  //get all products from db
  Product.find({userId: req.user._id})
    .then(products => {
      //render the page using those products
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        user: req.user.name
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log('admin-controller 20');
      return next(error);
    });
};

// * * * * * * * * * * * * * * GET ADD PRODUCT * * * * * * * * * * * * * *
  exports.getAddProduct = (req, res, next) => {
    //send to add product page with page and authentication info
    
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      user: req.user.name,
      errorMessage: [],
      hasError: false,
      validationErrors: []
    });
  };

  // * * * * * * * * * * * * * * POST ADD PRODUCT * * * * * * * * * * * * * *
  exports.postAddProduct = (req, res, next) => {
    //gather new product info from req
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    //handle validation errors
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log`${errors.array()}`;
        return res.status(422).render('admin/edit-product', {
          pageTitle: 'Add Product',
          path: '/admin/add-product',
          editing: false,
          hasError: true,
          user: req.user.name,
          isAuthenticated: false,
          errorMessage: errors.array()[0].msg,
          product: {title: title, imageUrl: imageUrl, price: price, description: description},
          validationErrors: errors.array()
        })
      }

    //create new product in db
    const product = new Product({
      title: title, 
      price: price, 
      description: description, 
      imageUrl: imageUrl,
      userId: req.user
    });
    //Save new product.   .save() is native to mongoose. 
    product
    .save()
      .then(result => {
        //log success and redirect to admin products
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        console.log(`admin-controller 83: ${err}`);
        return res.status(422).render('admin/edit-product', {
          pageTitle: 'Add Product',
          path: '/admin/add-product',
          editing: false,
          user: req.user.name,
          isAuthenticated: false,
          errorMessage: [],
          hasError: false,
          product: {title: title, imageUrl: imageUrl, price: price, description: description},
          validationErrors: errors.array()
        })
      });
    };

// * * * * * * * * * * * * * * POST ADD ANOTHER PRODUCT * * * * * * * * * * * * * *
exports.postAddAnotherProduct = (req, res, next) => {
  //Mostly the same as save, but redirect back to the add-product page to save the user time.
  //gather new product info from req
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  //handle validation errors
  const errors = validationResult(req);
  
  if(!errors.isEmpty()){
      console.log`${errors.array()}`;
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: true,
        user: req.user.name,
        isAuthenticated: false,
        errorMessage: errors.array()[0].msg,
        product: {title: title, imageUrl: imageUrl, price: price, description: description},
        validationErrors: errors.array()
      })
    }

  //create new product in db
  const product = new Product({
    title: title, 
    price: price, 
    description: description, 
    imageUrl: imageUrl,
    userId: req.user
  });
  //Save new product.   .save() is native to mongoose. 
  product
  .save()
    .then(result => {
      //log success and redirect to admin products
      console.log('Created Product');
      res.redirect('/admin/add-product');
    })
    .catch(err => {
      console.log(`admin-controller 142: ${err}`);
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        user: req.user.name,
        isAuthenticated: false,
        errorMessage: [],
        hasError: false,
        product: {title: title, imageUrl: imageUrl, price: price, description: description},
        validationErrors: errors.array()
      })
    });
  };

    // * * * * * * * * * * * * * * GET EDIT PRODUCT * * * * * * * * * * * * * *
  exports.getEditProduct = (req, res, next) => {
    //Is the user in edit mode? Only allow access if in edit mode.
    const editMode = req.query.edit;
    
    //if not in edit mode, redirect Home
    if(!editMode){
      return res.redirect('/');
    }

    //gather product id from params and locate product 
    const prodId = req.params.productId;
    Product.findById(prodId)
      .then(product => {
        //if no product, redirect Home
        if (!product) {
          return res.redirect('/');
        }
        //if product found, send to edit product with product info
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
          hasError: false,
          user: req.user.name,
          errorMessage: "",
          validationErrors: []
        });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log('admin-controller 131');
        return next(error);
      });
};

// * * * * * * * * * * * * * * POST EDIT PRODUCT * * * * * * * * * * * * * *
  exports.postEditProduct = (req, res, next) => {
    //gather updated product info
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    
    //check for validation errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(422).render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: true,
        product: {
          title: updatedTitle,
          imageUrl: updatedImageUrl,
          price: updatedPrice,
          description: updatedDesc
        },
        isAuthenticated: req.session.isLoggedIn,
        hasError: true,
        errorMessage: errors.array()[0].msg
      });
    }

    //locate existing product in db
    Product.findById(prodId)
      .then(product => {
        if(product.userId.toString() !== req.user._id.toString()){
          return res.redirect('/');
        }
        console.log("In the PostEditProduct function");
        //update product details
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        console.log(`admin-controller 216 about to update product`)
        return product.save()
          .then(result => {
            //log the success and redirect to admin products  
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
          })
          .catch(err => {
            res.redirect('/admin/edit-product/:prodId');
            console.log(`admin-controller 225 {$err}`)
          });
      })
      
      .catch(err => {
        res.redirect('/admin/edit-product/:prodId');
        console.log('admin-controller 162');
      });
};

  // * * * * * * * * * * * * * * POST DELETE PRODUCT * * * * * * * * * * * * * *
  exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    //locate the product and delete with native function
    Product.deleteOne({_id: prodId, userId: req.user._id})
      .then(() => {
        //log success and redirect to admin products
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
      })
      .catch(err => {
        res.redirect('/');
        console.log('admin-controller 178');
      });
  };
  