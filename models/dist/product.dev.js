"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fs = require('fs');

var path = require('path');

var p = path.join(path.dirname(process.mainModule.filename), 'data', 'products.json');

var getProductsFromFile = function getProductsFromFile(cb) {
  fs.readFile(p, function (err, fileContent) {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports =
/*#__PURE__*/
function () {
  function Product(id, title, imageUrl, description, price) {
    _classCallCheck(this, Product);

    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  _createClass(Product, [{
    key: "save",
    value: function save() {
      var _this = this;

      getProductsFromFile(function (products) {
        if (_this.id) {
          var existingProductIndex = products.findIndex(function (prod) {
            return parseFloat(prod.id) === parseFloat(_this.id);
          });
          console.log("existingProductIndex = " + existingProductIndex);

          var updatedProducts = _toConsumableArray(products);

          updatedProducts[existingProductIndex] = _this;
          fs.writeFile(p, JSON.stringify(updatedProducts), function (err) {
            console.log("Error: ".concat(err));
          });
        } else {
          var tempId = Product.maxId();
          console.log("tempId: ".concat(tempId));
          _this.id = tempId + 1;
          console.log("this.id: ".concat(_this.id));
          products.push(_this);
          console.log("this.id: ".concat(_this.id));
          fs.writeFile(p, JSON.stringify(products), function (err) {
            console.log("Error: ".concat(err));
          });
        }
      });
    }
  }], [{
    key: "deleteById",
    value: function deleteById(id) {
      getProductsFromFile(function (products) {
        var product = products.find(function (prod) {
          return prod.id === id;
        });
        var updatedProducts = products.filter(function (prod) {
          return prod.id !== id;
        });
        fs.writeFile(p, JSON.stringify(updatedProducts), function (err) {
          if (!err) {
            Cart.deleteProduct(id, product.price);
          }
        });
      });
    }
  }, {
    key: "fetchAll",
    value: function fetchAll(cb) {
      getProductsFromFile(cb);
    }
  }, {
    key: "findById",
    value: function findById(id, cb) {
      getProductsFromFile(function (products) {
        var product = products.find(function (p) {
          return parseFloat(p.id) === parseFloat(id);
        });
        cb(product);
      });
    }
  }, {
    key: "maxId",
    value: function maxId() {
      var id = 0;
      getProductsFromFile(function (products) {
        id = Math.max.apply(Math, _toConsumableArray(products.map(function (i) {
          return i.id;
        })));
        console.log("INNER id= ".concat(id));

        if (id !== 0) {
          return id;
        } else {
          return 0;
        }
      });
      console.log("OUTER id= ".concat(id));
      return id++;
    }
  }]);

  return Product;
}();