'use strict';

const DELAY = 100;
var self = this;

try {
  var productsUrl;
  var promises = [];
  var productIds = [];
  var products = new Map();
  var dataBank = new Map();

  self.onmessage = function (e) {
    if (e.data) {
      switch (e.data.action) {
        case 'init':
          promises.length = 0;
          productIds.length = 0;
          productsUrl = e.data.productsUrl;

          break;

        case 'set-data':
          setData(e.data.type, e.data.records);

          break;

        case 'start':
          Promise.all(promises).then(getProducts);

          break;
      }
    }
  };

  function buildProduct(data) {
    var product = [];
    var initialStock = 0;
    var stockFound = dataBank.get('initial-stocks').find(productFinder(data.id));

    if (stockFound) {
      initialStock = parseInt(stockFound.store_stock, 10);
    }
    
    if (dataBank.has('prev-sales') && dataBank.has('prev-refunds') && dataBank.has('prev-purchases')) {
      initialStock -= dataBank.get('prev-sales').filter(productFinder(data.id)).reduce(quantityReducer, 0);
      initialStock += dataBank.get('prev-refunds').filter(productFinder(data.id)).reduce(quantityReducer, 0);
      initialStock += dataBank.get('prev-purchases').filter(productFinder(data.id)).reduce(quantityReducer, 0);

      if (dataBank.has('prev-received-transfers') && dataBank.has('prev-sent-transfers')) {
        initialStock += dataBank.get('prev-received-transfers').filter(productFinder(data.id)).reduce(quantityReducer, 0);
        initialStock -= dataBank.get('prev-sent-transfers').filter(productFinder(data.id)).reduce(quantityReducer, 0);
      }
    }

    Array.prototype.push.apply(product, dataBank.get('sales').filter(productFinder(data.id)));
    Array.prototype.push.apply(product, dataBank.get('purchases').filter(productFinder(data.id)));

    if (dataBank.has('transfers')) {
      Array.prototype.push.apply(product, dataBank.get('transfers').filter(productFinder(data.id)));
    }

    product.sort(function (p1, p2) {
      if (p1.timestamp - p2.timestamp === 0) {
        if (p1.type === 'purchase') {
          return -1;
        } else if (p2.type === 'purchase') {
          return 1;
        } else {
          return 0;
        }
      } else {
        return p1.timestamp - p2.timestamp;
      }
    });

    product.unshift({type: 'initial-stock', quantity: initialStock});
    products.set(data, product);
  }

  function setData(type, records) {
    var promise = new Promise(function (resolve, reject) {

      records.forEach(record => {
        if (productIds.indexOf(record.product_id) < 0) {
          productIds.push(record.product_id);
        }

        if (type === 'sales') {
          record.type = 'sale';
          record.timestamp = new Date(record.sale_date);
        } else if (type === 'purchases') {
          record.type = 'purchase';
          record.timestamp = new Date(`${record.input_date} 00:00:00.0`);
        } else if (type === 'transfers') {
          record.type = 'transfer';
          record.timestamp = new Date(`${record.transfer_date} 00:00:00.0`);
        }
      });

      dataBank.set(type, records);

      resolve();
    });

    promises.push(promise);
  }

  function getProducts() {
    if (dataBank.has('initial-stocks') && dataBank.has('sales') && dataBank.has('purchases')) {
      var request = new XMLHttpRequest();

      request.open('post', productsUrl);

      request.addEventListener('load', function () {
        if (this.status === 200) {
          if (this.response.length > 0) {
            JSON.parse(this.response).forEach(buildProduct);

            self.postMessage({
              response: 'done',
              data: products
            });
          } else {
            // No se encontraron datos. Finalizar
          }

          self.close();
        } else {
          self.postMessage({
            response: 'error',
            message: this.statusText
          });
        }
      });

      request.addEventListener('error', function () {
        self.postMessage({
            response: 'error',
            message: this.statusText
          });
      });

      var productsData = new FormData();
      
      productIds.forEach(function (product) {
        productsData.append('products[]', product);
      });

      request.send(productsData);
    } else {
      self.postMessage({response: 'done'});
    }
  }

  function productFinder(id) {
    return function (product) {
      return product.product_id === id;
    };
  }

  function quantityReducer(accum, current) {
    return accum + parseInt(current.quantity, 10);
  }

} catch (err) {
  self.postMessage({
    response: 'error',
    message: err
  });
}
