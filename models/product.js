const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Data Definition: define how the product should look here. 
const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }, 
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', //refer to model
    required: true
  }
  //id automatically added by Mongoose
});

module.exports = mongoose.model('Product', productSchema);