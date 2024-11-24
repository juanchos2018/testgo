'use strict';

const self = this;

self.stocks = new Map();
self.products = new Map();
self.sizes = new Map();

self.onmessage = function (e) {
  if (e.data && 'records' in e.data && 'sizeGrouped' in e.data && 'hasStock' in e.data && 'orderedBy' in e.data && 'productsUrl' in e.data && 'sizesUrl' in e.data && 'companies' in e.data) {
    //var sizeGrouped = e.data.sizeGrouped;
    var sizeGrouped = true;
    var hasStock = e.data.hasStock;
    var orderedBy = e.data.orderedBy;
    var productsUrl = e.data.productsUrl;
    var sizesUrl = e.data.sizesUrl;
    var companies = e.data.companies;
    
    var products = [];
    var sizes = [];
    
    Object.keys(e.data.records).forEach(function (type) {
      var records = e.data.records[type];
      
      if (type === 'initial') {
        records.forEach(function (initialStock) {
          if (!self.stocks.has(initialStock.company_id)) {
            self.stocks.set(initialStock.company_id, []);
          }
          
          if (products.indexOf(initialStock.product_id) < 0) {
            products.push(initialStock.product_id);
          }
          
          if (sizeGrouped) {
            self.stocks.get(initialStock.company_id).push({
              product_id: initialStock.product_id,
              store_stock: parseInt(initialStock.store_stock, 10)
            });
          } else {
            if (sizes.indexOf(initialStock.size_id) < 0) {
              sizes.push(initialStock.size_id);
            }
          
            self.stocks.get(initialStock.company_id).push({
              product_id: initialStock.product_id,
              size_id: initialStock.size_id,
              store_stock: parseInt(initialStock.store_stock, 10)
            });
          }
        });
      } else {
        records.forEach(function (record) {
          if (!self.stocks.has(record.company_id)) {
            if (products.indexOf(record.product_id) < 0) {
              products.push(record.product_id);
            }
            
            if (sizeGrouped) {
              self.stocks.set(record.company_id, [{
                product_id: record.product_id,
                store_stock: parseInt(record.quantity, 10) * (type === 'sales' || type === 'transfers-sent' ? -1 : 1)
              }]);
            } else {
              if (sizes.indexOf(record.size_id) < 0) {
                sizes.push(record.size_id);
              }
              
              self.stocks.set(record.company_id, [{
                product_id: record.product_id,
                size_id: record.size_id,
                store_stock: parseInt(record.quantity, 10) * (type === 'sales' || type === 'transfers-sent' ? -1 : 1)
              }]);
            }
          } else {
            var companyStocks = self.stocks.get(record.company_id), stockFound;
            
            if (sizeGrouped) {
              stockFound = companyStocks.find(function (stock) {
                return stock.product_id === record.product_id;
              });
            } else {
              stockFound = companyStocks.find(function (stock) {
                return stock.product_id === record.product_id && stock.size_id === record.size_id;
              });
            }
            
            if (stockFound !== undefined) {
              stockFound.store_stock += parseInt(record.quantity, 10) * (type === 'sales' || type === 'transfers-sent' ? -1 : 1);
            } else {
              if (products.indexOf(record.product_id) < 0) {
                products.push(record.product_id);
              }
              
              if (sizeGrouped) {
                companyStocks.push({
                  product_id: record.product_id,
                  store_stock: parseInt(record.quantity, 10) * (type === 'sales' || type === 'transfers-sent' ? -1 : 1)
                });
              } else {
                if (sizes.indexOf(record.size_id) < 0) {
                  sizes.push(record.size_id);
                }
                
                companyStocks.push({
                  product_id: record.product_id,
                  size_id: record.size_id,
                  store_stock: parseInt(record.quantity, 10) * (type === 'sales' || type === 'transfers-sent' ? -1 : 1)
                });
              }
            }
          }
        });
      }
    });
    
    if (products.length > 0) {
      getData(productsUrl, products).forEach(function (product) {
        if (!self.products.has(product.company_id)) {
          self.products.set(product.company_id, new Map());
        }

        self.products.get(product.company_id).set(product.id, product);
      });
    }
    
    if (sizes.length > 0) {
      getData(sizesUrl, sizes).forEach(function (size) {
        self.sizes.set(size.id, size);
      });
    }
    
    var result = [];
    
    self.stocks.forEach(function (productStocks, companyId) {
      productStocks.forEach(function (productStock) {
        if (!hasStock || productStock.store_stock !== 0) {
          var productFound = self.products.get(companyId).get(productStock.product_id);
          var companyFound = companies.find(function (company) {
            return company.company_id === companyId;
          });
          
          if (sizeGrouped) {
            result.push({
              code: productFound.code,
              product: productFound.description,
              regime: productFound.regime === 'ZOFRA' ? 'Zofra' : 'General',
              brand: productFound.brand,
              company: companyFound.company_name,
              current_stock: productStock.store_stock,
              invoice_currency: productFound.invoice_currency,
              invoice_cost: productFound.invoice_cost,
              cost_currency: productFound.cost_currency,
              cost: productFound.cost
            });
          } else {
            result.push({
              code: productFound.code,
              product: productFound.description,
              product_size: self.sizes.get(productStock.size_id).description,
              regime: productFound.regime === 'ZOFRA' ? 'Zofra' : 'General',
              brand: productFound.brand,
              company: companyFound.company_name,
              current_stock: productStock.store_stock,
              invoice_currency: productFound.invoice_currency,
              invoice_cost: productFound.invoice_cost,
              cost_currency: productFound.cost_currency,
              cost: productFound.cost
            });
          }
        }
      });
    });
    
    if (orderedBy) {
      var order = orderedBy.split(' ');
      
      if (order.length === 2) {
        orderData(result, order[0], order[1] === 'asc');
      }
    }
    //console.log('resultado desde WORKER!', result);
    self.postMessage({
      result
    });
  } else {
    self.postMessage({
      error: 'No se ingresaron los parámetros necesarios'
    });
  }
  
  self.close();
};

function getData(url, ids) {
  var req = new XMLHttpRequest();
  var data = new FormData();
  
  req.open('POST', url, false);
  req.responseType = 'json';
  
  ids.forEach(function (id) {
    data.append('ids[]', id);
  });
  
  req.send(data);
  
  if (req.status === 200) {
    return req.response;
  } else {
    return [];
  }
}

function orderData(data, rel, asc) {
  data.sort(function (a, b) {
    var first = rel === 'current_stock' ? a.current_stock : a[rel].toLowerCase();
    var second = rel === 'current_stock' ? b.current_stock : b[rel].toLowerCase();
    
    if (first < second) {
      return asc ? -1 : 1;
    }
    
    if (first > second) {
      return asc ? 1 : -1;
    }
    
    return 0;
  });
}
