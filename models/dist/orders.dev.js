"use strict";

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var orderSchema = new Schema({
  products: [{
    product: {
      type: Object,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  user: {
    name: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  }
});
module.exports = mongoose.model('Order', orderSchema);