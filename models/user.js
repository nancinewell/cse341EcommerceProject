const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
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

userSchema.methods.removeFromCart = function(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
          return item.productId.toString() !== productId.toString();
        });
        this.cart.items = updatedCartItems;
        return this.save();
      }

userSchema.methods.clearCart = function(){
    this.cart = {items: []};
    return this.save();
};

module.exports = mongoose.model('User', userSchema);