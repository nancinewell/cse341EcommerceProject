"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var path = require('path');

var p = path.join(path.dirname(process.mainModule.filename), 'data', 'cart.json');

module.exports =
/*#__PURE__*/
function () {
  function Cart() {
    _classCallCheck(this, Cart);
  }

  _createClass(Cart, null, [{
    key: "addProduct",
    value: function addProduct(id, productPrice) {
      // Fetch the previous cart
      fs.readFile(p, function (err, fileContent) {
        var cart = {
          products: [],
          totalPrice: 0
        };

        if (!err) {
          cart = JSON.parse(fileContent);
        } // Analyze the cart => Find existing product


        var existingProductIndex = cart.products.findIndex(function (prod) {
          return prod.id === id;
        });
        var existingProduct = cart.products[existingProductIndex];
        var updatedProduct; // Add new product/ increase quantity

        if (existingProduct) {
          updatedProduct = _objectSpread({}, existingProduct);
          updatedProduct.qty = updatedProduct.qty + 1;
          cart.products = _toConsumableArray(cart.products);
          cart.products[existingProductIndex] = updatedProduct;
        } else {
          updatedProduct = {
            id: id,
            qty: 1
          };
          cart.products = [].concat(_toConsumableArray(cart.products), [updatedProduct]);
        }

        cart.totalPrice = cart.totalPrice + +productPrice;
        fs.writeFile(p, JSON.stringify(cart), function (err) {
          console.log(err);
        });
      });
    }
  }, {
    key: "deleteProduct",
    value: function deleteProduct(id, productPrice) {
      fs.readFile(p, function (err, fileContent) {
        if (err) {
          return;
        }

        var updatedCart = _objectSpread({}, JSON.parse(fileContent));

        var product = updatedCart.products.find(function (prod) {
          return parseFloat(prod.id) === parseFloat(id);
        });

        if (!product) {
          return;
        }

        var productQty = product.qty;
        updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;
        updatedCart.products = updatedCart.products.filter(function (prod) {
          return parseFloat(prod.id) !== parseFloat(id);
        });
        fs.writeFile(p, JSON.stringify(updatedCart), function (err) {
          console.log(err);
        });
      });
    }
  }, {
    key: "getCart",
    value: function getCart(cb) {
      fs.readFile(p, function (err, fileContent) {
        var cart = JSON.parse(fileContent);

        if (err) {
          cb(null);
        } else {
          cb(cart);
        }
      });
    }
  }]);

  return Cart;
}();