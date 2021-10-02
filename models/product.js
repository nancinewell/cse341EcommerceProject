const fs = require('fs');
const path = require('path');
const Cart = require('./cart');
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);



const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  };

  module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
      this.id = id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.description = description;
      this.price = price;
    }
    
    static idCounter=0;

    save() {
      
        getProductsFromFile(products => {
          if (this.id) {
            const existingProductIndex = products.findIndex(
              prod => parseFloat(prod.id) === parseFloat(this.id)
            );
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = this;
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
              console.log(`Error: ${err}`);
            });
          } else {
            Product.getMaxId().then(() => {
              Product.max++;
              this.id= Product.max.toString();
            products.push(this);
  
            
            fs.writeFile(p, JSON.stringify(products), err => {
              console.log(`Error: ${err}`);
            });
          }
        )
        .catch(err => console.log(err));
      };

      })       
    }


    static max = 0;

    static getMaxId(){
      return new Promise((res, rej) => {
        
        getProductsFromFile(products => {
          for(let product of products){
            if(parseInt(product.id) > Product.max){
              Product.max = product.id;
            }
          }
          if(Product.max > 0){
            res();
          } else {
            rej("max still = zero");
          }
        })        
        
      });
  }
    
  

    static deleteById(id) {
      getProductsFromFile(products => {
        const product = products.find(prod => prod.id === id);
        const updatedProducts = products.filter(prod => prod.id !== id);
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          if (!err) {
            Cart.deleteProduct(id, product.price);
          }
        });
      });
    }
    static fetchAll(cb) {
      getProductsFromFile(cb);
    }
  
    static findById(id, cb){
      getProductsFromFile(products => {
      const product = products.find(p => parseFloat(p.id) === parseFloat(id));
      cb(product);
      })
    }

    

  };
  