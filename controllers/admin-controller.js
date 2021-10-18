const Product = require('../models/product');

// * * * * * * * * * * * * * * GET PRODUCTS * * * * * * * * * * * * * *
exports.getProducts = (req, res, next) => {
  //get all products from db
  Product.find()
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
      console.log(`Error: ${err}`);
    });
};

// * * * * * * * * * * * * * * GET ADD PRODUCT * * * * * * * * * * * * * *
  exports.getAddProduct = (req, res, next) => {
    //send to add product page with page and authentication info
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      user: req.user.name
    });
  };

  // * * * * * * * * * * * * * * POST ADD PRODUCT * * * * * * * * * * * * * *
  exports.postAddProduct = (req, res, next) => {
    //gather new product info from req
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
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
        console.log(`Error admin-controller 57: ${err}`);
      });
    };

// * * * * * * * * * * * * * * POST ADD ANOTHER PRODUCT * * * * * * * * * * * * * *
exports.postAddAnotherProduct = (req, res, next) => {
  //Mostly the same as save, but redirect back to the add-product page to save the user time.
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title, 
    price: price, 
    description: description, 
    imageUrl: imageUrl,
    userId: req.user
  });
  //.save() is native to mongoose
  product.save()
    .then(result => {
      console.log('Created Product');
      res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        user: req.user.name
      });
    })
    .catch(err => {
      console.log(err);
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
          user: req.user.name
        });
      })
      .catch(err => console.log(`Error admin-controller 118: ${err}`));
};

// * * * * * * * * * * * * * * POST EDIT PRODUCT * * * * * * * * * * * * * *
  exports.postEditProduct = (req, res, next) => {
    //gather updated product info
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    
    //locate existing product in db
    Product.findById(prodId)
      .then(product => {
        //update product details
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product.save();
      })
      .then(result => {
        //log the success and redirect to admin products  
        console.log('UPDATED PRODUCT!');
        res.redirect('/admin/products');
        })
      .catch(err => console.log(`Error admin-controller 145: ${err}`));
};

  // * * * * * * * * * * * * * * POST DELETE PRODUCT * * * * * * * * * * * * * *
  exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    //locate the product and delete with native function
    Product.findByIdAndRemove(prodId)
      .then(() => {
        //log success and redirect to admin products
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
      })
      .catch(err => console.log(`Error admin-controller 158: ${err}`));
  };
  