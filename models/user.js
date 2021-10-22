const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Product = require('../models/product');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { 
            type: Number, 
            required: true 
      }
    }
    ],
    totalPrice: {
        type: Number
    }
  },
  securityQuestion1: {
    type: String,
    required: true
  },
  securityQuestion2: {
    type: String,
    required: true
  },
  securityQuestion3: {
    type: String,
    required: true
  },
  securityAnswer1: {
    type: String,
    required: true
  },
  securityAnswer2: {
    type: String,
    required: true
  },
  securityAnswer3: {
    type: String,
    required: true
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  let newTotalPrice = product.price; 
  if(this.cart.totalPrice){
    newTotalPrice = this.cart.totalPrice + product.price;
  }
  
  
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    newTotalPrice = this.cart.totalPrice + product.price;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
    newTotalPrice: product.price;
  }
  const updatedCart = {
    items: updatedCartItems,
    totalPrice: newTotalPrice
  };
  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function(productId, qty, price) {
  //we have quantity and price of product being removed fed by the parameters

  //remove product(s) from cart
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  
  //calculate price
  let beginingPrice = this.cart.totalPrice;
  let totalProductPrice = price * qty;
  let newTotalPrice = beginingPrice-totalProductPrice;
  
  //update cart
  this.cart = {items: updatedCartItems, totalPrice: newTotalPrice};
  
  //this.cart.items = updatedCartItems;
  return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = {items: [], totalPrice: 0};
    return this.save();
};

module.exports = mongoose.model('User', userSchema);