window.angular.module('ERP').factory('Sales', [
    '$window', '$filter', 'Ajax', 'Auth', 'Settings', '_angular', '_$',
    function ($window, $filter, Ajax, Auth, Settings, angular, $) {
  
      function getSubtotalFromDetail(detail, verifiedCustomer) {
        if (verifiedCustomer) {
          return $window.checkPrecision(detail.offer_price * detail.qty);
        } else {
          return $window.checkPrecision(detail.price * detail.qty);
        }
      }
      
      function getCardAbbrevFrom(card_id, cardTypes) {
        if (cardTypes.length) {
          for (var i = 0; i < cardTypes.length; i++) {
            if (cardTypes[i].id === card_id) { // Ambos son texto
              return cardTypes[i].abbrev;
            }
          }
        }
        
        return false;
      }
      
      
      var Sales = {
        'TICKET': 0,
        'BOLETA': 1,
        'FACTURA': 2,
        'NOTA_DE_CREDITO': 3
      };
      
      Sales.iframe = null;
      
      Sales.getVoucherString = function (voucherType) {
        switch (voucherType) {
          case Sales.TICKET:
          return 'TICKET';
          
          case Sales.BOLETA:
          return 'BOLETA';
          
          case Sales.FACTURA:
          return 'FACTURA';
          
          case Sales.NOTA_DE_CREDITO:
          return 'NOTA DE CREDITO';
          
          default:
          return '';
        }
      };
      
      Sales.showPreview = function (voucherType, customer, details, payments, callback) {
        if (voucherType === Sales.TICKET) { // Si se desea mostrar la vista previa de un Ticket
          var detailData = Sales.getDetailsData(details, customer);
          var previewData = Sales.getPreviewData(detailData, payments);
          var modalMsg = '<div class="row m-t-n-sm">';
          
          previewData.forEach(function () {
            modalMsg += '<div class="col-xs-' + parseInt(12 / previewData.length, 10) + '"><riot-ticket></riot-ticket></div>';
          });
          
          modalMsg += '</div>'; // .row
          
          var modal = $window.bootbox.dialog({
            title: 'Ticket' + (previewData.length > 1 ? 's' : '') + ' de venta',
            message: modalMsg,
            show: false,
            backdrop: true,
            onEscape: true,
            buttons: {
              cancel: {
                label: 'Cancelar',
                className: 'btn-default'
              },
              success: {
                label: 'Guardar e imprimir',
                className: 'btn-success',
                callback: function () {
                  callback.call(Sales, modal);
                  
                  return false;
                }
              }
            }
          });
          
          modal
          .one('show.bs.modal', function () {
            if (previewData.length === 1) {
              modal.find('.modal-dialog').addClass('modal-sm')
            } else if (previewData.length === 3) {
              modal.find('.modal-dialog').addClass('modal-lg')
            } else if (previewData.length === 4) {
              modal.find('.modal-dialog').addClass('modal-xlg')
            }
            
            previewData.forEach(function (sale, index) {
              $window.riot.mount(modal.find('riot-ticket').get(index), 'riot-ticket', sale);
            });
          })
          .on('shown.bs.modal', function () {
            modal.find('.btn-success').focus();
          })
          .modal('show');
        }
      };
      
      Sales.getDetailsData = function (details, customer) {
        var returned = {};
        
        details.forEach(function (detail) {
          var company = detail.company_name;
          var regime = detail.regime;
          
          if (!(company in returned)) {
            returned[company] = {};
          }
          
          if (!(regime in returned[company])) {
            returned[company][regime] = {
              tax: Settings.getTaxFor(regime),
              customer: customer,
              regime: regime,
              company: Settings.getCompanyOfBranch(detail.company_id, Auth.value('userBranch')),
              total: 0,
              original_total: 0
            };
          }
          
          if ('details' in returned[company][regime]) {
            returned[company][regime].details.push(detail);
          } else {
            returned[company][regime].details = [detail];
          }
          
          returned[company][regime].total = $window.checkPrecision(returned[company][regime].total + (customer.verified ? detail.offer_price : detail.price) * detail.qty);
          returned[company][regime].original_total = $window.checkPrecision(returned[company][regime].original_total + detail.price * detail.qty);
        });
        
        return returned;
      };
      
      // La siguiente función obtiene los datos del detalle para un solo documento (una empresa y un régimen)
      Sales.getDetailData = function (details, customer, company, regime) {
        var returned = {
          tax: Settings.getTaxFor(regime),
          customer: customer,
          regime: regime,
          company: Settings.getCompanyOfBranch(company, Auth.value('userBranch')),
          details: details,
          total: 0
        };
        
        details.forEach(function (detail) {
          returned.total = $window.checkPrecision(returned.total + ('unit_price' in detail ? detail.unit_price : (customer.verified ? detail.offer_price || detail.price : detail.price)) * ('quantity' in detail ? detail.quantity : detail.qty));
        });
        
        return returned;
      };
      
      // Sales.getPreviewData: reparte los pagos y devuelve los datos como un arreglo
      
      Sales.getPreviewData = function (sale, payments) {
        var data = [];
        
        Object.keys(sale).forEach(function (company) {
          if (company in payments) {
            var totalPaid = payments[company].reduce(function (previous, current) {
              return { amount: $window.checkPrecision(previous.amount + current.amount) };
            }).amount;
            
            if (Object.keys(sale[company]).length === 1) {
              var regime = ('General' in sale[company] ? 'General' : 'ZOFRA');
              
              sale[company][regime].paid = totalPaid;
              
              data.push(sale[company][regime]);
            } else { // El detalle de la empresa tiene dos regímenes: [General, ZOFRA]
              if (sale[company].General.total + sale[company].ZOFRA.total === totalPaid) { // Pago exacto
                sale[company].General.paid = sale[company].General.total;
                sale[company].ZOFRA.paid = sale[company].ZOFRA.total;
              } else if (sale[company].General.total < sale[company].ZOFRA.total) {
                sale[company].General.paid = sale[company].General.total;
                sale[company].ZOFRA.paid =  totalPaid - sale[company].General.total;
              } else {
                sale[company].ZOFRA.paid = sale[company].ZOFRA.total;
                sale[company].General.paid =  totalPaid - sale[company].ZOFRA.total;
              }
              
              data.push(sale[company].General);
              data.push(sale[company].ZOFRA);
            }
          } else {
            console.error('No se encontraron pagos correspondientes a ' + company);
          }
        });
        
        return data;
      };
      
      Sales.getRecords = function (voucherType, customer, saleman, saleDetails, payments, saleId, serie, serialNumber) { // saleId es opcional, si se trata de una NOTA DE CREDITO
        var sale = Sales.getDetailsData(saleDetails, customer);
        var details = {};
        var data = [];
        
        if (voucherType === Sales.TICKET || voucherType === Sales.BOLETA || voucherType === Sales.FACTURA) {
          Object.keys(sale).forEach(function (company) {
            if (company in payments) {
              details[company] = {};
              
              Object.keys(sale[company]).forEach(function (regime) {
                details[company][regime] = [];
                
                sale[company][regime].details.forEach(function (detail) {
                  details[company][regime].push({
                    // sale_id: Se obtiene de agregar la nueva venta (ticket)
                    quantity: detail.qty,
                    price: (customer.verified ? detail.offer_price : detail.price),
                    // subtotal: Generado automáticamente por un trigger en PostgreSQL
                    product_barcode_id: detail.id,
                    cost: detail.cost,
                    pack_list_id: detail.pack_list_id || null
                  });
                });
              });
              
              var cashTotal = 0, cardTotal = 0, cardItems = [];
              
              payments[company].forEach(function (payment) {
                if (payment.method === 'TARJETA') {
                  cardTotal = $window.checkPrecision(cardTotal + payment.amount);
                  cardItems.push(angular.copy(payment));
                } else { // method = EFECTIVO
                  cashTotal = $window.checkPrecision(cashTotal + payment.amount);
                  // Se suma todo el EFECTIVO sean soles, dólares o pesos
                }
              });
              
              cardItems.length > 1 && cardItems.sort(function (a, b) {
                if (a.amount > b.amount) {
                  return 1;
                }
                if (a.amount < b.amount) {
                  return -1;
                }
                
                return 0;
              });
              
              if (Object.keys(sale[company]).length === 1) {
                var regime = ('General' in sale[company] ? 'General' : 'ZOFRA');
                var saleData = sale[company][regime];
                var creditCards = [];
                
                cardItems.length && cardItems.forEach(function (card) {
                  creditCards.push({
                    // sale_id: Obtenido al guardar la nueva venta
                    operation_code: card.operation,
                    verification_code: card.security,
                    amount: card.amount,
                    credit_card_type_id: card.type
                  });
                });
                
                data.push({
                  salesman_id: saleman.id || null,
                  // cashier_id: Llenar de la sesión en PHP (no es seguro hacerlo desde Angular),
                  customer_id: customer.id || null,
                  coupon_id: null,
                  igv: $window.checkPrecision(saleData.total * saleData.tax / (1 + saleData.tax)),
                  total_amount: saleData.total,
                  original_total_amount: saleData.original_total,
                  state: 'SOLD',
                  voucher: Sales.getVoucherString(voucherType),
                  regime: saleData.regime,
                  refund_origin_id: null,
                  refund_target_id: null,
                  sale_point_id: $window.localStorage.currentSalePoint,
                  // cash_amount: Se genera automáticamente con un trigger en PostgreSQL
                  total_cash_amount: cashTotal,
                  credit_card_amount: cardTotal,
                  // branch_id: Llenar de la sesión en PHP
                  company_id: saleData.company.company_id,
                  sale_details: details[company][regime],
                  credit_cards: creditCards
                });
              } else { // El detalle de la empresa tiene dos regímenes: [General, ZOFRA]
                var totalGeneral = sale[company].General.total,
                totalZOFRA = sale[company].ZOFRA.total;
                
                var companyPayments = {
                  'General': {
                    debt: totalGeneral,
                    cashTotal: 0,
                    cardTotal: 0,
                    creditCards: []
                  },
                  'ZOFRA': {
                    debt: totalZOFRA,
                    cashTotal: 0,
                    cardTotal: 0,
                    creditCards: []
                  }
                };
                
                // Se toma como regimen inicial el que tenga menor deuda
                var regime = (companyPayments.General.debt < companyPayments.ZOFRA.debt ? 'General' : 'ZOFRA');
                
                for (var i = 0; i < cardItems.length; i++) {
                  var card = cardItems[i];
                  
                  if (companyPayments[regime].debt <= 0) {
                    // Si la deuda actual ya está cancelada, debemos pasar a la otra
                    regime = (regime === 'General' ? 'ZOFRA' : 'General');
                  }
                  
                  if (card.amount <= companyPayments[regime].debt) {
                    companyPayments[regime].debt = $window.checkPrecision(companyPayments[regime].debt - card.amount);
                    companyPayments[regime].cardTotal = $window.checkPrecision(companyPayments[regime].cardTotal + card.amount);
                    companyPayments[regime].creditCards.push({
                      // sale_id: Obtenido al guardar la nueva venta
                      operation_code: card.operation,
                      verification_code: card.security,
                      amount: card.amount,
                      credit_card_type_id: card.type
                    });
                  } else {
                    var amount = companyPayments[regime].debt;
                    
                    companyPayments[regime].debt = 0;
                    companyPayments[regime].cardTotal = $window.checkPrecision(companyPayments[regime].cardTotal + amount);
                    companyPayments[regime].creditCards.push({
                      // sale_id: Obtenido al guardar la nueva venta
                      operation_code: card.operation,
                      verification_code: card.security,
                      amount: amount,
                      credit_card_type_id: card.type
                    });
                    
                    card.amount = $window.checkPrecision(card.amount - amount);
                    cardItems.push(card);
                  }
                }
                
                if (companyPayments.General.debt || companyPayments.ZOFRA.debt) {
                  if (companyPayments.General.debt < companyPayments.ZOFRA.debt) {
                    if (companyPayments.General.debt > 0) {
                      // Llenar el cash de General y el resto del total en ZOFRA
                      companyPayments.General.cashTotal = companyPayments.General.debt;
                      companyPayments.ZOFRA.cashTotal = $window.checkPrecision(cashTotal - companyPayments.General.cashTotal);
                    } else if (companyPayments.ZOFRA.debt > 0) {
                      // Solo llenar ZOFRA
                      companyPayments.ZOFRA.cashTotal = cashTotal;
                    }
                  } else {
                    if (companyPayments.ZOFRA.debt > 0) {
                      // Llenar el cash de ZOFRA y el resto del total en General
                      companyPayments.ZOFRA.cashTotal = companyPayments.ZOFRA.debt;
                      companyPayments.General.cashTotal = $window.checkPrecision(cashTotal - companyPayments.ZOFRA.cashTotal);
                    } else if (companyPayments.General.debt > 0) {
                      // Solo llenar ZOFRA
                      companyPayments.General.cashTotal = cashTotal;
                    }
                  }
                }
                
                var saleData;
                
                // Agregando la venta del ticket de régimen General
                regime = 'General';
                saleData = sale[company][regime];
                
                data.push({
                  salesman_id: saleman.id || null,
                  // cashier_id: Llenar de la sesión en PHP (no es seguro hacerlo desde Angular),
                  customer_id: customer.id || null,
                  coupon_id: null,
                  igv: $window.checkPrecision(saleData.total * saleData.tax / (1 + saleData.tax)),
                  total_amount: saleData.total,
                  original_total_amount: saleData.original_total,
                  state: 'SOLD',
                  voucher: Sales.getVoucherString(voucherType),
                  regime: saleData.regime,
                  refund_origin_id: null,
                  refund_target_id: null,
                  sale_point_id: $window.localStorage.currentSalePoint,
                  // cash_amount: Se genera automáticamente con un trigger en PostgreSQL
                  total_cash_amount: companyPayments[regime].cashTotal,
                  credit_card_amount: companyPayments[regime].cardTotal,
                  // branch_id: Llenar de la sesión en PHP
                  company_id: saleData.company.company_id,
                  sale_details: details[company][regime],
                  credit_cards: companyPayments[regime].creditCards
                });
                
                // Agregando la venta del ticket de régimen ZOFRA
                regime = 'ZOFRA';
                saleData = sale[company][regime];
                
                data.push({
                  salesman_id: saleman.id || null,
                  // cashier_id: Llenar de la sesión en PHP (no es seguro hacerlo desde Angular),
                  customer_id: customer.id || null,
                  coupon_id: null,
                  igv: $window.checkPrecision(saleData.total * saleData.tax / (1 + saleData.tax)),
                  total_amount: saleData.total,
                  original_total_amount: saleData.original_total,
                  state: 'SOLD',
                  voucher: Sales.getVoucherString(voucherType),
                  regime: saleData.regime,
                  refund_origin_id: null,
                  refund_target_id: null,
                  sale_point_id: $window.localStorage.currentSalePoint,
                  // cash_amount: Se genera automáticamente con un trigger en PostgreSQL
                  total_cash_amount: companyPayments[regime].cashTotal,
                  credit_card_amount: companyPayments[regime].cardTotal,
                  // branch_id: Llenar de la sesión en PHP
                  company_id: saleData.company.company_id,
                  sale_details: details[company][regime],
                  credit_cards: companyPayments[regime].creditCards
                });
              }
            } else {
              console.error('No se encontraron pagos correspondientes a ' + company);
            }
          });
        } else if (voucherType === Sales.NOTA_DE_CREDITO) {
          Object.keys(sale).forEach(function (company) {
            details[company] = {};
            
            Object.keys(sale[company]).forEach(function (regime) {
              details[company][regime] = [];
              
              sale[company][regime].details.forEach(function (detail) {
                details[company][regime].push({
                  // sale_id: Se obtiene de agregar la nueva venta (ticket)
                  quantity: detail.qty,
                  price: detail.price, // No hay precio de oferta si es una NOTA DE CREDITO
                  // subtotal: Generado automáticamente por un trigger en PostgreSQL
                  product_barcode_id: detail.id,
                  cost: detail.cost,
                  pack_list_id: detail.pack_list_id || null
                });
              });
              
              var saleData = sale[company][regime];
              
              data.push({
                salesman_id: saleman.id || null,
                // cashier_id: Llenar de la sesión en PHP (no es seguro hacerlo desde Angular),
                customer_id: customer.id || null,
                coupon_id: null,
                igv: $window.checkPrecision(saleData.total * saleData.tax / (1 + saleData.tax)),
                total_amount: saleData.total,
                state: 'REFUNDED',
                voucher: 'NOTA DE CREDITO',
                regime: saleData.regime,
                refund_origin_id: saleId,
                refund_target_id: null,
                sale_point_id: $window.localStorage.currentSalePoint || null,
                // cash_amount: Se genera automáticamente con un trigger en PostgreSQL
                total_cash_amount: saleData.total,
                credit_card_amount: 0,
                // branch_id: Llenar de la sesión en PHP
                company_id: saleData.company.company_id,
                sale_details: details[company][regime],
                serie: serie || 0,
                serial_number: serialNumber || 0
              });
            });
            
          });
        }
        
        return data;
      };
      
      Sales.getRecord = function (voucherType, company, regime, customer, saleman, saleDetails, payments, config) {
        var sale = Sales.getDetailData(saleDetails, customer, company, regime);
        var details = [];
        var data;
        
        if (voucherType === Sales.TICKET || voucherType === Sales.BOLETA || voucherType === Sales.FACTURA) {
          if (sale.company.company_name in payments) {
            sale.details.forEach(function (detail) {
              details.push({
                // sale_id: Se obtiene de agregar la nueva venta (ticket)
                quantity: detail.qty,
                price: 'unit_price' in detail ? detail.unit_price : (customer.verified ? detail.offer_price : detail.price),
                // subtotal: Generado automáticamente por un trigger en PostgreSQL
                product_barcode_id: detail.id,
                cost: detail.cost,
                pack_list_id: detail.pack_list_id || null
              });
            });
            
            var cashTotal = 0, cardTotal = 0, cardItems = [];
            
            payments[sale.company.company_name].forEach(function (payment) {
              if (payment.method === 'TARJETA') {
                cardTotal = $window.checkPrecision(cardTotal + payment.amount);
                cardItems.push(angular.copy(payment));
              } else { // method = EFECTIVO
                cashTotal = $window.checkPrecision(cashTotal + payment.amount);
                // Se suma todo el EFECTIVO sean soles, dólares o pesos
              }
            });
            
            cardItems.length > 1 && cardItems.sort(function (a, b) {
              if (a.amount > b.amount) {
                return 1;
              }
              if (a.amount < b.amount) {
                return -1;
              }
              
              return 0;
            });
            
            //var regime = ('General' in sale[company] ? 'General' : 'ZOFRA');
            //var saleData = sale[company][regime];
            var creditCards = [];
            
            cardItems.length && cardItems.forEach(function (card) {
              creditCards.push({
                // sale_id: Obtenido al guardar la nueva venta
                operation_code: card.operation,
                verification_code: card.security,
                amount: card.amount,
                credit_card_type_id: card.type
              });
            });
            
            data = {
              salesman_id: saleman.id || null,
              // cashier_id: Llenar de la sesión en PHP (no es seguro hacerlo desde Angular),
              customer_id: customer.id || null,
              coupon_id: null,
              igv: $window.checkPrecision(sale.total * sale.tax / (1 + sale.tax)),
              total_amount: sale.total,
              state: 'SOLD',
              voucher: Sales.getVoucherString(voucherType),
              regime: regime,
              refund_origin_id: null,
              refund_target_id: null,
              // cash_amount: Se genera automáticamente con un trigger en PostgreSQL
              total_cash_amount: cashTotal,
              credit_card_amount: cardTotal,
              // branch_id: Llenar de la sesión en PHP
              company_id: company,
              sale_details: details,
              credit_cards: creditCards,
              sale_point_id: $window.localStorage.currentSalePoint,
              serie: config.serie,
              serial_number: config.serial_number,
              sale_date: config.sale_date
            };
          } else {
            console.error('No se encontraron pagos correspondientes para esta empresa', sale.company.company_name);
          }
        } else if (voucherType === Sales.NOTA_DE_CREDITO) {
          console.log('sale', sale);
          sale.details.forEach(function (detail) {
            details.push({
              // sale_id: Se obtiene de agregar la nueva venta (ticket)
              quantity: detail.quantity,
              price: detail.price,
              // subtotal: Generado automáticamente por un trigger en PostgreSQL
              product_barcode_id: detail.product_barcode_id,
              cost: detail.cost,
              pack_list_id: null // Las devoluciones no tienen paquetes de descuento
            });
          });
          
          data = {
            salesman_id: null,
            // cashier_id: Llenar de la sesión en PHP (no es seguro hacerlo desde Angular),
            customer_id: customer.id || null,
            coupon_id: null,
            igv: $window.checkPrecision(sale.total * sale.tax / (1 + sale.tax)),
            total_amount: sale.total,
            state: 'REFUNDED',
            voucher: Sales.getVoucherString(voucherType),
            regime: regime,
            refund_origin_id: config.reference_id,
            refund_reason_id: config.refund_reason_id,
            other_refund_reason: config.other_refund_reason,
            // refund_target_id: Se debe guardar cuando se registre en la BD
            // cash_amount: Se genera automáticamente con un trigger en PostgreSQL
            total_cash_amount: sale.total,
            credit_card_amount: 0,
            // branch_id: Llenar de la sesión en PHP
            company_id: company,
            sale_details: details,
            // credit_cards: []: No hay tarjetas para las NC
            sale_point_id: config.sale_point_id,
            serie: config.serie,
            serial_number: config.serial_number,
            sale_date: config.sale_date
          };
        }
        
        return data;
      };
      
      Sales.buildSerie = function (serie, serial, serieDigits, serialDigits) {
        if (serie && serial) {
          serie = serie.toString();
          serial = serial.toString();
          serieDigits = serieDigits || 3;
          serialDigits = serialDigits || 7;
          
          return serie.zeros(serieDigits) + '-' + serial.zeros(serialDigits);
        } else {
          return '000';
        }
      };
      
      Sales.data = function (voucher, info, details) {
        info = info || {};
        
        var total = info.total;
        
        if (total === undefined || total === null) {
          total = 0;
          
          details.forEach(function (detail) {
            total += detail.quantity * detail.price; // Es precio porque es venta
          });
          
          info.total = total;
        }
        
        if ('tax' in info) {
          info.tax = parseFloat(info.tax);
        }
        
        /*
        info = {
          salesman?,
          customer?,
          cashier?,
          coupon?,
          tax,
          state?,
          regime?,
          serie,
          serial,
          origin?,
          target?,
          total,
          cash?,
          card?
        }
        */
        
        var igv = (total * info.tax) / (1 + info.tax);
        
        var data = {
          salesman_id: info.salesman || '',
          cashier_id: info.cashier || Auth.value('userId') || '',
          customer_id: info.customer || '',
          coupon_id: info.coupon || '',
          sale_date: '',
          igv: igv,
          total_amount: total,
          state: info.state || (voucher === Sales.NOTA_DE_CREDITO ? 'REFUNDED' : 'SOLD'),
          active: 't',
          voucher: voucher,
          regime: info.regime || '',
          serie: info.serie,
          serial_number: info.serial,
          refund_origin_id: info.origin || '',
          refund_target_id: info.target || '',
          sale_point_id: Auth.value('userSalePoint') || '',
          branch_id: Auth.value('userBranch') || '',
          cash_amount: info.cash || 0,
          credit_card_amount: info.card || 0
        };
        
        data.product_detail = [];
        data.price = [];
        data.quantity = [];
        data.subtotal = [];
        data.cost = [];
        
        details.forEach(function (detail) {
          data.product_detail.push(detail.product_detail);
          data.price.push(detail.price);
          data.quantity.push(detail.quantity);
          data.subtotal.push(parseInt(detail.quantity) * parseFloat(detail.price));
          data.cost.push(detail.cost);
        });
        
        return data;
      };
      
      Sales.save = function (voucher, info, details, onsuccess, onerror) {
        var data = new FormData();
        var url = $window.siteUrl('sales/save_sale');
        
        data.set(Sales.data(voucher, info, details));
        
        Ajax.post(url, data).then(function (res) {
          if (typeof onsuccess === 'function') {
            onsuccess.call(res, res.data);
          }
        }, function (err) {
          if (typeof onerror === 'function') {
            onerror.call(err, err.reason);
          }
        });
      };
      
      Sales.print = function (voucher, target, info, details, onsuccess, onerror) {
        
        if (target) {
          if (typeof target === 'string') {
            target = $(target);
          }
        } else {
          target = $('<iframe src="about:blank" id="voucher-printer-' + (new Date).getTime() + '" class="hidden-content-"></iframe>').appendTo('[ng-view]:first');
        }
        
        var ifrWin = target.get(0).contentWindow;
        var ifrDoc = ifrWin.document;
        var htmlBody = '';
        var cssText = '';
        
        var htmlHeaderTop = ''
        +	'<!doctype html>'
        +	'<html lang="es-PE">'
        +	'<head>'
        +	'	<meta charset="utf-8" />'
        +	'   <style type="text/css">'
        ;
        
        var htmlHeaderBottom = ''
        +	'   </style>'
        +	'</head>'
        +	'<body>'
        ;
        
        var htmlFooter = ''
        +	'</body>'
        +	'</html>'
        ;
        
        info.tax = parseFloat(info.tax);
        
        cssText += ''
        +   '* { margin: 0; padding: 0; font-family: sans-serif; font-size: 9pt; }'
        +   '@page { size: 80mm auto; }'
        +   '@page:left, @page:right { margin-left: -1cm; margin-right: -1cm; }'
        +   '@page:first { margin-top: -2cm; }'
        +   'body { line-height: 10pt; background-color: white; max-width: 80mm; }'
        +   '.bigger { font-size: 1.4em; }'
        +   '.smaller { font-size: 0.8em; }'
        +   '.text-center { text-align: center; }'
        +   '.text-right { text-align: right; }'
        +   '[class^="separator"] { height: 0; border: none; margin: 10px 0; border-top: 1px dashed #000; clear: both; }'
        +   '.separator-double { height: 2px; border-bottom: 1px solid #000; border-top-style: solid; }'
        +   '.m-t { margin-top: 0.5em; }'
        +   '.m-b { margin-bottom: 0.2em; }'
        +   '[class^="col-"] { display: inline-block; float: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }'
        +   '.row { display: inline-block; width: 100%; }'
        +   '.col-20 { width: 20%; }'
        +   '.col-25 { width: 25%; }'
        +   '.col-30 { width: 30%; }'
        +   '.col-35 { width: 35%; }'
        +   '.col-40 { width: 40%; }'
        +   '.col-50 { width: 50%; }'
        +   '.col-60 { width: 60%; }'
        +   '.col-75 { width: 75%; }'
        +   '.col-80 { width: 80%; }'
        ;
        
        htmlBody += ''
        +   '<div class="text-center bigger m-b">' + escapeHtml(info.company) + '</div>'
        +   '<div class="text-center">R.U.C. N°  ' + escapeHtml(info.ruc) + '</div>'
        +   '<div class="text-center m-t">' + escapeHtml(info.address) + '</div>'
        +   '<div class="text-center">'
        +       [info.addressDepartment, info.addressProvince, info.addressDistrict].map(escapeHtml).join(' ')
        +   '</div>'
        +   '<div class="text-center m-t">' + escapeHtml(info.taxAddress) + '</div>'
        +   '<div class="text-center">'
        +       [info.taxAddressDepartment, info.taxAddressProvince, info.taxAddressDistrict].map(escapeHtml).join(' ')
        +   '</div>'
        +   '<div class="text-center">'
        +   (info.customerType === 'PERSONA' ? 'BOLETA DE VENTA' : 'FACTURA') +'ELECTRONICA'
        +   '</div>'
        +   '<div class="separator"></div>'
        +   '<div class="row">'
        +   '   <div class="col-30">Nro. Serie</div>'
        +   '   <div class="col-35">: ' + escapeHtml(info.printer) + '</div>'
        +   '   <div class="col-35 text-right">' + escapeHtml(info.date) + '</div>'
        +   '</div>'
        +   '<div class="row">'
        +   '   <div class="col-30">' + (voucher === Sales.NOTA_DE_CREDITO ? 'N.C.' : escapeHtml(voucher).capitalize()) + ' Nro.</div>'
        +   '   <div class="col-35">: ' + escapeHtml(info.serie) + '</div>'
        +   '   <div class="col-35 text-right">' + escapeHtml(info.time) + ' Hrs.</div>'
        +   '</div>'
        ;
        
        // Si es una Nota de Crédito, se debe mostrar su origen (TICKET, BOLETA, FACTURA)
        if (voucher === Sales.NOTA_DE_CREDITO && info.originVoucher && info.originSerie) {
          htmlBody += ''
          +   '<div class="row">'
          +   '   <div class="col-30">' + escapeHtml(info.originVoucher).capitalize() + ' Nro.</div>'
          +   '   <div class="col-70">: ' + escapeHtml(info.originSerie) + '</div>'
          +   '</div>'
          ;
        }
        
        htmlBody += ''
        +   '<div class="separator"></div>'
        +   '<div class="row">'
        +   '   <div class="col-20">Cliente</div>'
        +   '   <div class="col-80">: ' + (escapeHtml(info.customer) || '(Público General)') + '</div>'
        +   '</div>'
        ;
        
        if (info.customer) { // Si es un cliente registrado
          htmlBody += ''
          +   '<div class="row">'
          +   '   <div class="col-20">' + (info.customerType === 'PERSONA' ? 'D.N.I.' : 'R.U.C.') + '</div>'
          +   '   <div class="col-80">: ' + escapeHtml(info.customerDoc) + '</div>'
          +   '</div>'
          ;
        }
        
        if (/*info.customerType === 'PERSONA' && */ info.customerAddress) { // Si es una empresa, se muestra la dirección
          htmlBody += ''
          +   '<div class="row">'
          +   '   <div class="col-20">Dirección</div>'
          +   '   <div class="col-80">: ' + escapeHtml(info.customerAddress) + '</div>'
          +   '</div>'
          ;
        }
        
        var totalAmount = 0, subAmount = 0, igvAmount = 0, igv = 0, changeAmount = 0;
        
        if (details.length) { // Si la venta tiene detalles
          htmlBody += ''
          +   '<div class="separator-double"></div>'
          ;
          
          details.forEach(function (detail, index) {
            var sub = parseInt(detail.quantity) * parseFloat(detail.price);
            
            if (info.regime === 'ZOFRA') {
              htmlBody += ''
              +   '<div>D.S. ' + escapeHtml(detail.output_statement) + '</div>'
              ;
            }
            
            htmlBody += ''
            +   '<div class="row">'
            +   '   <div class="col-25">C. ' + escapeHtml(detail.code) + '</div>'
            +   '   <div class="col-75 text-right">' + escapeHtml(detail.product) + ' - ' + escapeHtml(detail.size) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-50">' + escapeHtml(detail.quantity) + ' &times; S/' + escapeHtml(parseFloat(detail.price).toFixed(2)) + '</div>'
            +   '   <div class="col-20 text-right">S/</div>'
            +   '   <div class="col-30 text-right">' + escapeHtml(parseFloat(detail.subtotal).toFixed(2)) + '</div>'
            +   '</div>'
            ;
            
            totalAmount += parseFloat(detail.subtotal);
            
            if (index !== details.length - 1) {
              htmlBody += ''
              +   '<div class="separator"></div>'
              ;
            }
          });
        }
        
        if (info.tax > 0) {
          igvAmount = totalAmount * (info.tax / (1 + info.tax));
          subAmount = totalAmount - igvAmount;
          igv = info.tax * 100;
        }
        
        htmlBody += ''
        +   '<div class="separator-double"></div>'
        ;
        
        // Calculando el Subtotal e IGV
        if (igv > 0) {
          htmlBody += ''
          +   '<div class="row">'
          +   '   <div class="col-50">SUBTOTAL</div>'
          +   '   <div class="col-20 text-right">S/</div>'
          +   '   <div class="col-30 text-right">' + subAmount.toFixed(2) + '</div>'
          +   '</div>'
          +   '<div class="row">'
          +   '   <div class="col-50">I.G.V. (18%)</div>'
          +   '   <div class="col-20 text-right">S/</div>'
          +   '   <div class="col-30 text-right">' + igvAmount.toFixed(2) + '</div>'
          +   '</div>'
          ;
        }
        
        // Mostrando el Total
        htmlBody += ''
        +   '<div class="row">'
        +   '   <div class="col-50">TOTAL</div>'
        +   '   <div class="col-20 text-right">S/</div>'
        +   '   <div class="col-30 text-right">' + totalAmount.toFixed(2) + '</div>'
        +   '</div>'
        +   '<div class="separator"></div>'
        ;
        
        // Si es una venta, se muestran las cantidades pagadas (FECTIVO y TARJETA)
        if (voucher !== Sales.NOTA_DE_CREDITO) {
          changeAmount = info.totalCash - info.cash;
          
          htmlBody += ''
          +   '<div class="row">'
          +   '   <div class="col-50">EFECTIVO</div>'
          +   '   <div class="col-20 text-right">S/</div>'
          +   '   <div class="col-30 text-right">' + info.cash.toFixed(2) + '</div>'
          +   '</div>'
          +   '<div class="row">'
          +   '   <div class="col-50">CAMBIO</div>'
          +   '   <div class="col-20 text-right">S/</div>'
          +   '   <div class="col-30 text-right">' + changeAmount.toFixed(2) + '</div>'
          +   '</div>'
          +   '<div class="row">'
          +   '   <div class="col-50">TARJETA</div>'
          +   '   <div class="col-20 text-right">S/</div>'
          +   '   <div class="col-30 text-right">' + info.card.toFixed(2) + '</div>'
          +   '</div>'
          +   '<div class="separator"></div>'
          ;
          
          // Mostramos los PUNTOS GANADOS y ACUMULADOS, si es que es un cliente registrado
          
          if (info.customer && info.points && info.totalPoints) {
            htmlBody += ''
            +   '<div class="text-center">'
            +   '   Usted ha ganado ' + info.points + ' punto(s), acum. ' + info.totalPoints + ' punto(s) en total.'
            +   '</div>'
            +   '<div class="separator"></div>'
            ;
          }
          
          if (info.regime === 'ZOFRA') {
            htmlBody += ''
            +   '<div class="text-center smaller">VENTA EXONERADA DEL IGV-ISC-IPM.</div>'
            +   '<div class="text-center m-t smaller">PROHIBIDA LA VENTA FUERA DE LA ZONA COMERCIAL DE TACNA. RES. DE SUPERINTENDENCIA N° 007-99/SUNAT REGLAMENTO DE COMPROB. DE PAGO, D. LEG. N° 821, ART. 12 D.S. N° 112-97-EF.</div>'
            +   '<div class="text-center m-t smaller">EFECTUE SU DECLARACION JURADA ANTE ADUANAS.</div>'
            ;
          } else {
            htmlBody += ''
            +   '<div class="text-center smaller">REGIMEN GENERAL CON IMPUESTO PAGADO PARA TODA LA REPUBLICA DEL PERÚ INCLUIVO IGV.</div>'
            ;
          }
        }
        
        htmlBody += ''
        +   '<div class="text-center m-t smaller">TODO CAMBIO DE MERCADERIA SE HARA DENTRO DE LAS 48 HORAS PREVIA PRESENTACION DEL COMPROBANTE Y VERIFICACION DE LA MISMA.</div>'
        ;
        
        htmlBody += ''
        +   '<script>'
        +   '   window.print();'
        +   '</script>'
        ;
        
        // ACTIVAR EL SIGUIENTE COMENTARIO PARA IMPRIMIR
        
        /*htmlFooter = ''
        +   '<script type="text/javascript">'
        +   '   window.print();'
        +   '</script>'
        +   htmlFooter
        ;*/
        
        ifrDoc.open('text/html', 'replace');
        ifrDoc.write(htmlHeaderTop);
        ifrDoc.write(cssText);
        ifrDoc.write(htmlHeaderBottom);
        ifrDoc.write(htmlBody);
        ifrDoc.write(htmlFooter);
        ifrDoc.close();
      };
      
      Sales.getPrintCashout = function (target, company, data_t, data_b, data_n, cards, info, tickets, categories, data_f, type, report_date) {
        
        var content = '';
        var total_cash = 0;
        var total_credit_card = 0;
        var paid_total = 0;
        var total_by_category = 0;
        var today_hour = moment().format('HH:mm:ss');
        var today_date = moment().format('DD/MM/YYYY');
        
        var t_total_nc = 0;
        var t_total_sum = 0;
        var t_canceled = 0;
        var t_total = 0;
        console.log("boletas",data_b);
        console.log("tickets",data_t);
        console.log("facturas",data_f);
        console.log("cards",cards);
        
        var branch = Settings.branches[Auth.value('userBranchName')];
        var company = Settings.getCompanyOfBranch(company, Auth.value('userBranch'));
        if(data_t !== false) {
          if (typeof(data_t[0].total_cash) !== "undefined"){
            total_cash = parseFloat(data_t[0].total_cash);
          }
          
          if (typeof(data_t[0].total_credit_card) !== "undefined"){
            total_credit_card += parseFloat(data_t[0].total_credit_card);
          }
        }
        console.log("gatos",data_b);
        if(data_b !== false) {
          
          for (var i = 0; i < data_b.length; i++) {
            console.log("gatossss",data_b[i].total_cash);
            total_cash += parseFloat(data_b[i].total_cash);
          }
          
          // if (typeof(data_b.total_credit_card) !== "undefined"){
          for (var i = 0; i < data_b.length; i++) {
            total_credit_card += parseFloat(data_b[i].total_credit_card);
            console.log("mila",data_b[i].total_credit_card);
          }
          //}
        }
        
        if(data_f !== false) {
          
          for (var i = 0; i < data_f.length; i++) {
            console.log("gatossss",data_f[i].total_cash);
            total_cash += parseFloat(data_f[i].total_cash);
          }
          
          // if (typeof(data_f.total_credit_card) !== "undefined"){
          for (var i = 0; i < data_f.length; i++) {
            total_credit_card += parseFloat(data_f[i].total_credit_card);
            console.log("monchi",data_f[i].total_credit_card);
          }
          //}
        }
        
        if(data_n !== false ){
          for (var i = 0; i < data_n.length; i++) {
              t_total_nc += parseFloat(data_n[i].total);
          }
        }
        
        //console.log(company);
        if(type) {
          content += ''
          +   '<div class="text-center bigger m-b">' + type + '</div>'
          +   '<div class="separator-double"></div>'
          ;
        }
        content += ''
        +   '<div class="text-center m-b">' + escapeHtml(company.company_business_name) + '</div>'
        +   '<div class="text-center m-b">' + escapeHtml(branch.branch_address) + '</div>'
        +   '<div class="separator"></div>'
        +   '<div class="row">'
        +   '   <div class="col-65">R.U.C. N°</div>'
        +   '   <div class="col-5 text-right">:</div>'
        +   '   <div class="col-30 text-right">' + escapeHtml(company.company_ruc) + '</div>'
        +   '</div>'
        ;
        if(report_date !== false ){
              content += ''
              +   '<div class="row">'
              +   '   <div class="col-65">Fecha de Consulta</div>'
              +   '   <div class="col-5 text-right">:</div>'
              +   '   <div class="col-30 text-right">' + escapeHtml(report_date) + '</div>'
              +   '</div>'
              ;
        }
        content += ''
        +   '<div class="row">'
        +   '   <div class="col-65">Fecha de Impresion</div>'
        +   '   <div class="col-5 text-right">:</div>'
        +   '   <div class="col-30 text-right">' + escapeHtml(today_date) + '</div>'
        +   '</div>'
        +   '<div class="row">'
        +   '   <div class="col-65">Hora de Impresion</div>'
        +   '   <div class="col-5 text-right">:</div>'
        +   '   <div class="col-30 text-right">' + escapeHtml(today_hour) + '</div>'
        +   '</div>'
        +   '<div class="row">'
        +   '   <div class="col-65">Nro. Serie</div>'
        +   '   <div class="col-5 text-right">:</div>'
        +   '   <div class="col-30 text-right">' + escapeHtml(info[0].printer_serial) + '</div>'
        +   '</div>'
        +   '<div class="separator"></div>'
        ;
        if(data_b !== false ){
          content += ''
          +   '<div class="row">'
          +   '   <div class="col-65">Total OJO Efectivo Ventas</div>'
          +   '   <div class="col-10 text-right">S/ :</div>'
          +   '   <div class="col-25 text-right">' + $window.checkPrecision(total_cash).toFixed(2) + '</div>'
          +   '</div>'
          ;
        }
        content += ''
        +   '<div class="row">'
        +   '   <div class="col-65">Total Notas de Credito</div>'
        +   '   <div class="col-10 text-right">S/ :</div>'
        +   '   <div class="col-25 text-right"> (-) '
        ;
        if(data_n !== false){
          content += ''+ $window.checkPrecision(t_total_nc).toFixed(2);
        }else{
          content += '0.00';
        }
        content += ''
        + '</div>'
        +   '</div>'
        +   '<div class="row">'
        +   '   <div class="col-65">Total Efectivo en Caja</div>'
        +   '   <div class="col-10 text-right">S/ :</div>'
        +   '   <div class="col-25 text-right">'
        ;
        
        content += ''
        + ($window.checkPrecision(total_cash - t_total_nc) || 0).toFixed(2);
       
        
        content += ''
        + '</div>'
        +   '</div>'
        ;
        if (data_t !== false) {
          for (var i = 0; i < data_t.length; i++) {
            
            content += ''
            +   '<div class="separator-double"></div>'
            +   '<div class="text-center">REPORTE DE TICKETS - ' + (data_t[i].com).toUpperCase() + '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">Nro de Transacciones</div>'
            +   '   <div class="col-10 text-right">:</div>'
            +   '   <div class="col-25 text-right">' + (escapeHtml(data_t[i].transactions) || 0 ) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-70">Nro Ticket Inicial</div>'
            +   '   <div class="col-30 text-right">: ' + data_t[i].serie.zeros(4) + '-' + data_t[i].min.zeros(7) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-70">Nro Ticket Final</div>'
            +   '   <div class="col-30 text-right">: ' + data_t[i].serie.zeros(4) + '-' + data_t[i].max.zeros(7) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">Valor de Venta</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_t[i].total - data_t[i].igv).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">I.G.V.</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_t[i].igv).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">Venta total del dia</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_t[i].total).toFixed(2) + '</div>'
            +   '</div>'
            ;
          }
        }
        content += ''
        +   '<div class="separator"></div>'
        +   '<div class="text-center">REPORTE DE FACTURAS </div>'
        ;
        //console.log("gatooo",data_f.length);
        //console.log("ticktes",data_t.length);
        //console.log("cards",cards.length);
        if (data_f !== false) {
          
          for (var i = 0; i < data_f.length; i++) {
            //console.log('gato');
            
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-65">Nro de Transacciones</div>'
            +   '   <div class="col-10 text-right">:</div>'
            +   '   <div class="col-25 text-right">' + (escapeHtml(data_f[i].transactions) || 0 ) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-70">Nro factura Inicial</div>'
            +   '   <div class="col-30 text-right">: ' + data_f[i].serie.zeros(4) + '-' + data_f[i].min.zeros(5) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-70">Nro factura Final</div>'
            +   '   <div class="col-30 text-right">: ' + data_f[i].serie.zeros(4) + '-' + data_f[i].max.zeros(5) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">Valor de Venta</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_f[i].total - data_f[i].igv).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">I.G.V.</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_f[i].igv).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">Venta total del dia</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_f[i].total).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="separator"></div>'
            ;
            
          };
        }
        
        content += ''
        +   '<div class="separator"></div>'
        +   '<div class="text-center">REPORTE DE BOLETAS </div>'
        ;
        //console.log("gatooo",data_b.length);
        //console.log("ticktes",data_t.length);
        //console.log("cards",cards.length);
        if (data_b !== false) {
          
          for (var i = 0; i < data_b.length; i++) {
            //console.log('gato');
            
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-65">Nro de Transacciones</div>'
            +   '   <div class="col-10 text-right">:</div>'
            +   '   <div class="col-25 text-right">' + (escapeHtml(data_b[i].transactions) || 0 ) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-70">Nro Boleta Inicial</div>'
            +   '   <div class="col-30 text-right">: ' + data_b[i].serie.zeros(4) + '-' + data_b[i].min.zeros(5) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-70">Nro Boleta Final</div>'
            +   '   <div class="col-30 text-right">: ' + data_b[i].serie.zeros(4) + '-' + data_b[i].max.zeros(5) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">Valor de Venta</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_b[i].total - data_b[i].igv).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">I.G.V.</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_b[i].igv).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-65">Venta total del dia</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_b[i].total).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="separator"></div>'
            ;
            
          };
        }
        
        
        
        
        console.log("notas",data_n);
        content += ''
        +   '<div class="separator"></div>'
        +   '<div class="text-center">REPORTE DE NOTAS DE CREDITO </div>'
        ;

        if (data_n !== false) {
          for (var i = 0; i < data_n.length; i++) {
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-65">Nro de Transacciones</div>'
            +   '   <div class="col-10 text-right">:</div>'
            +   '   <div class="col-25 text-right">' + (escapeHtml(data_n[i].transactions) || 0 ) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-70">Nro NC Inicial</div>'
            +   '   <div class="col-30 text-right">: ' + data_n[i].serie.zeros(4) + '-' + data_n[i].min.zeros(5) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-70">Nro NC Final</div>'
            +   '   <div class="col-30 text-right">: ' + data_n[i].serie.zeros(4) + '-' + data_n[i].max.zeros(5) + '</div>'
            +   '</div>'
            /*+   '<div class="row">'
            +   '   <div class="col-65">Valor de Devolucion</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_n[i].total - data_n[i].igv).toFixed(2) + '</div>'
            +   '</div>'*/
            +   '<div class="row">'
            +   '   <div class="col-65">Total Devolucion</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + $window.checkPrecision(data_n[i].total).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="separator"></div>'
            ;
          };
        }
        
        content += ''
        +   '<div class="separator-double"></div>'
        +   '<div class="text-center">DETALLE TARJETAS</div>'
        ;
        for (var i = 0; i < cards.length; i++) {
          //data.forEach(){
          content += ''
          +   '<div class="row">'
          +   '   <div class="col-65">' + (escapeHtml(cards[i].abbrev) || 0 ) + '</div>'
          +   '   <div class="col-10 text-right">S/ :</div>'
          +   '   <div class="col-25 text-right">' + (escapeHtml(cards[i].tt_amount) || 0 ) + '</div>'
          +   '</div>'
          ;
        }
        content += ''
        +   '   <div class="col-65 medium">TOTAL</div>'
        +   '   <div class="col-10 text-right">S/ :</div>'
        +   '   <div class="col-25 medium text-right">' + ($window.checkPrecision(total_credit_card).toFixed(2) || 0 ) + '</div>'
        +   '</div>'
        ;
        
        /* Rechazado para Cierre de Caja T_T
        content += ''
        +   '<div class="separator"></div>'
        +   '<div class="text-center">VENTA POR LINEA</div>'
        ;
        for (var i = 0; i < categories.length; i++) {
          
          content += ''
          +   '<div class="row">'
          +   '   <div class="col-65">' + (escapeHtml(categories[i].category) || 0 ) + '</div>'
          +   '   <div class="col-10 text-right">S/ :</div>'
          +   '   <div class="col-25 text-right">' + (escapeHtml(categories[i].total_amount) || 0 ) + '</div>'
          +   '</div>'
          ;
          total_by_category += parseFloat(categories[i].total_amount);
        }
        content += ''
        +   '   <div class="col-65 medium">TOTAL</div>'
        +   '   <div class="col-10 text-right">S/ :</div>'
        +   '   <div class="col-25 medium text-right">' + ($window.checkPrecision(total_by_category).toFixed(2) || 0 ) + '</div>'
        +   '</div>'
        ;*/
        
        
        
        /*if(type == 'CIERRE FIN DE CAJA(Z)' ){
          content += ''
          +   '<div class="separator"></div>'
          +   '<div class="text-center">RESUMEN DE TICKETS</div>'
          ;
          
          for (var i = 0; i < tickets.length; i++) {
            
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-15">' + (escapeHtml(tickets[i].abbrev)) + '</div>'
            +   '   <div class="col-20">' + (escapeHtml(tickets[i].num)) + '</div>'
            +   '   <div class="col-30 text-right">' + (escapeHtml(tickets[i].state)) + '</div>'
            +   '   <div class="col-10 text-right">S/ :</div>'
            +   '   <div class="col-25 text-right">' + (escapeHtml(tickets[i].total_amount)) + '</div>'
            +   '</div>'
            ;
            if(tickets[i].abbrev == 'N/C'){
              t_total_nc += parseFloat(tickets[i].total_amount);
            }else{
              if(tickets[i].state == 'CANCELED'){
                t_canceled += parseFloat(tickets[i].total_amount);
              }else{
                t_total_sum += parseFloat(tickets[i].total_amount);
              }
              
            }
            t_total = t_total_sum;
          }
          content += ''
          +   '   <div class="col-65 medium ">TOTAL</div>'
          +   '   <div class="col-10 text-right">S/ :</div>'
          +   '   <div class="col-25 medium text-right">' + ($window.checkPrecision(t_total).toFixed(2) || 0 ) + '</div>'
          +   '</div>'
          ;
        }*/
        
        content += ''
        +   '<div class="separator-double"></div>'
        +   '<div class="text-center">VENTA DE TARJETAS LFA</div>'
        ;
        for (var i = 0; i < categories.length; i++) {
          
          content += ''
          +   '<div class="row">'
          +   '   <div class="col-45">' + (escapeHtml(categories[i].description) || 0 ) + '</div>'
          +   '   <div class="col-10">S/ ' + (escapeHtml(categories[i].price) || 0 ) + '</div>'
          +   '   <div class="col-10 text-right">' + (escapeHtml(categories[i].num) || 0 ) + '</div>'
          +   '   <div class="col-10 text-right">S/ :</div>'
          +   '   <div class="col-25 text-right">' + (escapeHtml(categories[i].total) || 0 ) + '</div>'
          +   '</div>'
          ;
          total_by_category += parseFloat(categories[i].total);
        }
        content += ''
        +   '   <div class="col-65 medium">TOTAL</div>'
        +   '   <div class="col-10 text-right">S/ :</div>'
        +   '   <div class="col-25 medium text-right">' + ($window.checkPrecision(total_by_category).toFixed(2) || 0 ) + '</div>'
        +   '</div>'
        ;
        
        
        
        
        paid_total += parseFloat(total_cash) + parseFloat(total_credit_card);
        content += ''
        +   '<div class="separator-double"></div>'
        +   '<div class="text-center">VENTAS POR TIPO DE PAGO - ' + (data_t.com || '') + '</div>'
        +   '<div class="row">'
        +   '   <div class="col-65">Ventas Efectivo</div>'
        +   '   <div class="col-10 text-right">S/ :</div>'
        +   '   <div class="col-25 text-right">' + ($window.checkPrecision(total_cash-t_total_nc).toFixed(2) || 0 ) + '</div>'
        +   '</div>'
        +   '<div class="row">'
        +   '   <div class="col-65">Ventas Tarjeta</div>'
        +   '   <div class="col-10 text-right">S/ :</div>'
        +   '   <div class="col-25 text-right">' + ($window.checkPrecision(total_credit_card).toFixed(2) || 0 ) + '</div>'
        +   '</div>'
        +   '<div class="row">'
        +   '   <div class="col-65 medium">TOTAL</div>'
        +   '   <div class="col-10 text-right">S/ :</div>'
        +   '   <div class="col-25 medium text-right">' + ($window.checkPrecision(paid_total-t_total_nc).toFixed(2) || 0 ) + '</div>'
        +   '</div>'
        ;
        
        return content;
      };
      
      Sales.printCashout = function (target, company, data_t, data_b, data_n, cards, info, tickets, category, data_f, type, report_date) {//target,data,info,reportType,details, cardTypes) {
        //console.log('details', details, 'data.sale_details', data.sale_details);
        var ticketHtml = '<!doctype html><html lang="es-PE"><head><meta charset="utf-8">' + Sales.getTicketPrintCSS() + '</head><body>';
        //console.log(info);
        if (data_t.constructor.name === 'Array') { // Varios tickets
          data_t.forEach(function (ticket, index) {
            //ticketHtml += Sales.getPrintCashout(voucherType, ticket, customer, saleman, details, cardTypes);
            ticketHtml += Sales.getPrintCashout(target, company, data_t, data_b, data_n, cards, info, tickets, category, data_f, type, report_date);
            
            if (index !== data_t.length - 1) { // No es el último recorrido del buble
              ticketHtml += '<div class="page-break"></div>';
            }
          });
        } else if (Auth.value('userBranchName') in Settings.branches) { // Es un solo ticket yla sucursal es válida
          ticketHtml += Sales.getPrintCashout(target, company, data_t, data_b, data_n, cards, info, tickets, category, data_f, type, report_date);
        }
        
        if ('silentPrint' in $window) {
          ticketHtml += '</body></html>'
          
          $window.silentPrint(ticketHtml);
        } else {
          if (target) {
            target = $(target);
          } else {
            target = Sales.iframe || (Sales.iframe = $('<iframe src="about:blank" class="hidden-content-">').appendTo('[ng-view]:parent'));
          }
          
          if (target.length) {
            var doc = target.get(0).contentWindow.document;
            
            ticketHtml += '<script>window.print()</script></body></html>'
            doc.open('text/html', 'replace');
            doc.write(ticketHtml);
            doc.close();
          }
        }
      }
      
      Sales.getTicketPrintCSS = function () {
        return `
        <style type="text/css">
        * {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
          font-size: 8pt;
          line-height: 1rem;
        }
        
        @page {
          margin-left: 0;
          margin-right: 0;
          /*margin-top: -2cm;*/
          margin-bottom: 0;
          
          size: 80mm auto;
        }
        
        @media print {
          .page-break {
            display: block;
            page-break-before: always;
          }
        }
        
        body {
          line-height: 10pt;
          background-color: white;
          max-width: 10cm;
        }
        
        .bigger {
          font-size: 1.3em;
        }
        
        .medium {
          font-size: 1em;
        }
        .smaller {
          font-size: 0.8em;
        }
        
        .text-center {
          text-align: center;
        }
        
        .text-right {
          text-align: right;
        }
        
        [class^="separator"] {
          height: 0; border: none;
          margin: 1px 0;
          margin-bottom: 3px;
          border-top: 1px dashed #000;
          clear: both;
        }
        
        .separator-double {
          height: 2px;
          border-bottom: 1px solid #000;
          border-top-style: solid;
        }
        
        .m-t {
          margin-top: 0.5em;
        }
        
        .m-b {
          margin-bottom: 0.2em;
        }
        
        [class^="col-"] {
          display: inline-block;
          float: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .row {
          display: inline;
          width: 100%;
        }
        
        .col-5      { width: 5%; }
        .col-10     { width: 10%; }
        .col-15     { width: 15%; }
        .col-20     { width: 20%; }
        .col-25     { width: 25%; }
        .col-30     { width: 30%; }
        .col-35     { width: 35%; }
        .col-40     { width: 40%; }
        .col-45     { width: 45%; }
        .col-50     { width: 50%; }
        .col-55     { width: 55%; }
        .col-60     { width: 60%; }
        .col-65     { width: 65%; }
        .col-70     { width: 70%; }
        .col-75     { width: 75%; }
        .col-80     { width: 80%; }
        .col-85     { width: 85%; }
        .col-90     { width: 90%; }
        .col-95     { width: 95%; }
        .col-100    { width: 100%; }
        </style>
        `;
      };
      
      Sales.getPrintContent = function (voucherType, data, customer, saleman, details, cardTypes, packs) {
        var content = '';
        
        if (voucherType === Sales.TICKET || voucherType === Sales.NOTA_DE_CREDITO || voucherType === Sales.FACTURA || voucherType === Sales.BOLETA) {
          var branch = Settings.branches[Auth.value('userBranchName')];
          var company = Settings.getCompanyOfBranch(data.company_id, Auth.value('userBranch'));
          var saleTicketMessage = Settings.getItem('sale_ticket_message', 'text').trim();
          var returnTicketMessage = Settings.getItem('return_ticket_message', 'text').trim();
          var promoTicketStatus = Boolean(Number(Settings.getItem('promo_ticket_status', 'numeric')));
        
          var hasDetailsWithoutPacks = false;
          //console.log(company);
          content += ''
          +   '<div class="text-center m-b">' + escapeHtml(company.company_business_name) + '</div>'
          +   '<div class="text-center">R.U.C. N°  ' + escapeHtml(company.company_ruc) + '</div>'
          +   '<div class="text-center m-t">' + escapeHtml(company.company_address) + '</div>'
          +   '<div class="text-center">'
          +       [company.company_department, company.company_province, company.company_district].map(escapeHtml).join(' ')
          +   '</div>'
          +   '<div class="text-center m-t">' + escapeHtml(branch.branch_address) + '</div>'
          +   '<div class="text-center">'
          +       [branch.branch_department, branch.branch_province, branch.branch_district].map(escapeHtml).join(' ')
          +   '</div>'
          +   '<div class="text-center m-t">' + escapeHtml(Sales.getVoucherString(voucherType)) + '  ELECTRONICA' + '</div>'
          +   '<div class="text-center m-t">' + escapeHtml(data.serie).zeros(4) + '-' + escapeHtml(data.serial_number).zeros(7) + '</div>'
          +   '<div class="separator"></div>'
          +   '<div class="row">'
          +   '   <div class="col-30"> Fecha: </div>'
          +   '   <div class="col-35">: ' +  escapeHtml(data.date) + '</div>'
          +   '   <div class="col-35 text-right">' + escapeHtml(data.time) + '</div>'
          +   '</div>'
          
          ;
          
          if (voucherType === Sales.NOTA_DE_CREDITO) {
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-30">Referencia</div>'
            +   '   <div class="col-70">: ' + escapeHtml(data.reference) + '</div>'
            +   '</div>'
            ;
          }
          
          // Si es una Nota de Crédito, se debe mostrar su origen (TICKET, BOLETA, FACTURA)
          /*if (voucher === Sales.NOTA_DE_CREDITO && info.originVoucher && info.originSerie) {
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-30">' + escapeHtml(info.originVoucher).capitalize() + ' Nro.</div>'
            +   '   <div class="col-70">: ' + escapeHtml(info.originSerie) + '</div>'
            +   '</div>'
            ;
          }*/
          
          content += ''
          +   '<div class="separator"></div>'
          +   '<div class="row">'
          +   '   <div class="col-20">Cliente</div>'
          +   '   <div class="col-80">: ' + (escapeHtml(customer.full_name) || '(Público general)') + '</div>'
          +   '</div>'
          ;
          
          if (customer.id) { // Si es un cliente registrado
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-20">' + (customer.type === 'PERSONA' ? (customer.id_number && customer.id_number.length === 8 ? 'D.N.I.' : 'DOC.') : 'R.U.C.') + '</div>'
            +   '   <div class="col-80">: ' + escapeHtml(customer.id_number || '') + '</div>'
            +   '</div>'
            ;
            if (customer.type === 'EMPRESA') {
              content += ''
              +   '<div class="row">'
              +   '   <div class="col-20">Dirección</div>'
              +   '   <div class="col-80">: ' + escapeHtml(customer.address) + '</div>'
              +   '</div>'
              ;
            }
           /*  if (customer.address) { // Si se tiene registrada su dirección
              content += ''
              +   '<div class="row">'
              +   '   <div class="col-20">Dirección</div>'
              +   '   <div class="col-80">: ' + escapeHtml(customer.address) + '</div>'
              +   '</div>'
              ;
            } */
          }
  
          if (data.sale_details && data.sale_details.length) { // Si la venta tiene detalles
            content += ''
            +   '<div class="separator-double"></div>'
            ;
  
            data.sale_details.forEach(function (saleDetail, index) {
              
              if (!saleDetail.pack_list_id) {
                
                var detail;
                
                if ('product' in saleDetail) {
                  // Esto es si se imprime desde detalle de venta
                  saleDetail.qty = saleDetail.quantity;
                  saleDetail.description = saleDetail.product;
                  saleDetail.offer_price = saleDetail.price;
                  
                  detail = saleDetail;
                } else {
                  detail = details.find(function (detail) {
                    return detail.id === saleDetail.product_barcode_id && !detail.pack_list_id;
                  });
                }
                
                if (!detail) return ;
  
                hasDetailsWithoutPacks = true;
                
                content += ''
                +   '<div class="row">'
                +   '   <div class="col-70">C. ' + escapeHtml(detail.code) + ' - ' + escapeHtml(detail.description) + '</div>'
                +   '   <div class="col-30 text-right">T. ' + escapeHtml(detail.size) + '</div>'
                +   '</div>'
                ;
                
                if (detail.regime === 'ZOFRA') {
                  content += ''
                  +   '<div class="row">'
                  +   '   <div class="col-100">D.S. ' + escapeHtml(detail.output_statement) + '</div>'
                  +   '</div>'
                  ;
                }
                
                content += ''
                +   '<div class="row">'
                +   '   <div class="col-50">' + escapeHtml(detail.qty) + ' &times; S/' + escapeHtml(parseFloat(customer.verified ? detail.offer_price : detail.price).toFixed(2)) + '</div>'
                +   '   <div class="col-20 text-right">S/</div>'
                +   '   <div class="col-30 text-right">' + getSubtotalFromDetail(detail, customer.verified).toFixed(2) + '</div>'
                +   '</div>'
                ;
                
                /*if (index === data.sale_details.length - 1) {
                  content += ''
                  +   '<div class="separator-double"></div>'
                  ;
                } else {
                  content += ''
                  +   '<div class="separator" style="margin-top: 0px; margin-bottom: 2px"></div>'
                  ;
                }*/
              }
              
            });
  
            if (Array.isArray(packs) && customer.verified) {
              packs.filter(function (pack) {
                return pack.regime === data.regime && pack.company_id == data.company_id;
              }).forEach(function (pack, packIdx) {
                if (hasDetailsWithoutPacks || packIdx > 0) {
                  content += '<div class="separator"></div>';
                }
  
                content += `
                  <div class="row">
                    <div class="col-70">${ pack.description.toUpperCase() }</div>
                    <div class="col-30 text-right">${ pack.price.toFixed(2) }</div>
                  </div>
                  <div class="separator"></div>
                `;
  
                pack.details.forEach(function (packDetail) {
                  content += `
                    <div class="row">
                      <div class="col-70">${ packDetail.qty } &times; C. ${ escapeHtml(packDetail.code) + ' - ' + escapeHtml(packDetail.description) }</div>
                      <div class="col-30 text-right">T. ${ escapeHtml(packDetail.size) }</div>
                    </div>
                  `;
                  
                  if (packDetail.regime === 'ZOFRA') {
                    content += `
                      <div class="row">
                        <div class="col-100">D.S. ${ escapeHtml(packDetail.output_statement) }</div>
                      </div>
                    `;
                  }
                  
                  /*content += `
                    <div class="row">
                      <div class="col-50">${ escapeHtml(packDetail.qty) + ' &times; S/.' + parseFloat(packDetail.offer_price || packDetail.price).toFixed(2) }</div>
                      <div class="col-20 text-right">S/.</div>
                      <div class="col-30 text-right">${ getSubtotalFromDetail(packDetail, customer.verified).toFixed(2) }</div>
                    </div>
                  `;*/
                });
              });
            }
          }
  
          content += '<div class="separator-double"></div>';
          
          if (data.regime === 'General' && customer.type === 'EMPRESA') { // Solo si es FACTURA se muestra el IGV
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-50">SUBTOTAL</div>'
            +   '   <div class="col-20 text-right">S/</div>'
            +   '   <div class="col-30 text-right">' + $window.checkPrecision(data.total_amount - data.igv).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-50">I.G.V. (' + Settings.getTaxFor(data.regime) * 100 + '%)</div>'
            +   '   <div class="col-20 text-right">S/</div>'
            +   '   <div class="col-30 text-right">' + data.igv.toFixed(2) + '</div>'
            +   '</div>'
            ;
          }
          
          // Mostrando el Total
          content += ''
          +   '<div class="row">'
          +   '   <div class="col-50">TOTAL</div>'
          +   '   <div class="col-20 text-right">S/</div>'
          +   '   <div class="col-30 text-right">' + data.total_amount.toFixed(2) + '</div>'
          +   '</div>'
          +   '<div class="separator"></div>'
          ;
          
          // Si es una venta, se muestran las cantidades pagadas (FECTIVO y TARJETA)
          if (voucherType !== Sales.NOTA_DE_CREDITO) {
            var cash_amount = $window.checkPrecision(data.total_amount - data.credit_card_amount);
            
            if (data.credit_card_amount && data.credit_cards && data.credit_cards.length) {
              data.credit_cards.forEach(function (creditCard) {
                content += ''
                +   '<div class="row">'
                +   '   <div class="col-50">TARJETA ' + getCardAbbrevFrom(creditCard.credit_card_type_id, cardTypes) + ' ***' + creditCard.verification_code + '</div>'
                +   '   <div class="col-20 text-right">S/</div>'
                +   '   <div class="col-30 text-right">' + (parseFloat(creditCard.amount) || 0).toFixed(2) + '</div>'
                +   '</div>'
                ;
                
              });
            }
            
            content += ''
            +   '<div class="row">'
            +   '   <div class="col-50">EFECTIVO</div>'
            +   '   <div class="col-20 text-right">S/</div>'
            +   '   <div class="col-30 text-right">' + parseFloat(data.total_cash_amount).toFixed(2) + '</div>'
            +   '</div>'
            +   '<div class="row">'
            +   '   <div class="col-50">CAMBIO</div>'
            +   '   <div class="col-20 text-right">S/</div>'
            +   '   <div class="col-30 text-right">' + (data.total_cash_amount - cash_amount).toFixed(2) + '</div>'
            +   '</div>'
            ;
            
            content += '<div class="separator"></div>';
            
            // Mostramos los PUNTOS GANADOS y ACUMULADOS, si es que es un cliente registrado
            
            /*if (info.customer && info.points && info.totalPoints) {
              content += ''
              +   '<div class="text-center">'
              +   '   Usted ha ganado ' + info.points + ' punto(s), acum. ' + info.totalPoints + ' punto(s) en total.'
              +   '</div>'
              +   '<div class="separator"></div>'
              ;
            }*/
  
            if (promoTicketStatus && customer.verified && data.original_total_amount > data.total_amount) {
              content += `
                <div class="text-center bigger m-b">
                  <br />USTED HA AHORRADO S/ ${ (data.original_total_amount - data.total_amount).toFixed(2) } <br />GRACIAS A SU TARJETA LFA SPORTS.
                </div>
              `;
            }
            content += ''
            +   '<div class="separator"></div>'
            +   '<div class="text-center smaller">Representacion Impresa de la ' + escapeHtml(Sales.getVoucherString(voucherType)) + ' ELECTRONICA</div>'
            +   '<div class="separator"></div>'
            ;
            if (data.regime === 'ZOFRA') {
              content += ''
              +   '<div class="text-center smaller">VENTA EXONERADA DEL IGV-ISC-IPM.</div>'
              +   '<div class="text-center m-t smaller">PROHIBIDA LA VENTA FUERA DE LA ZONA COMERCIAL DE TACNA. RES. DE SUPERINTENDENCIA N° 007-99/SUNAT REGLAMENTO DE COMPROB. DE PAGO, D. LEG. N° 821, ART. 12 D.S. N° 112-97-EF.</div>'
              +   '<div class="text-center m-t smaller">EFECTUE SU DECLARACION JURADA ANTE ADUANAS.</div>'
              ;
            } else {
              content += ''
              +   '<div class="text-center smaller">REGIMEN GENERAL CON IMPUESTO PAGADO PARA TODA LA REPUBLICA DEL PERÚ INCLUIVO IGV.</div>'
              ;
            }
          }
          
          if (voucherType !== Sales.NOTA_DE_CREDITO) {
            if (saleTicketMessage.length) { // Si se configuró un mensaje personalizado
              content += '<div class="text-center m-t smaller">' + saleTicketMessage.replace(/(?:\r\n|\r|\n)/g, '<br />') + '</div>';
            }
            
            if (returnTicketMessage.length) { // Si se configuró un mensaje personalizado
              content += '<div class="text-center m-t smaller">' + returnTicketMessage.replace(/(?:\r\n|\r|\n)/g, '<br />') + '</div>';
            }
            
            content += ''
            // +   '<div class="text-center m-t smaller">ESTIMADO CLIENTE LOS CAMBIOS SOLO SON '
            // +   'REALIZADOS DE LUNES A JUEVES</div>'
            // +   '<div class="text-center m-t smaller">ESTE COMPROBANTE ES INDISPENSABLE PARA '
            // +   'CUALQUIER CAMBIO.</div>'
            +   '<div class="text-center m-t smaller">"GRACIAS POR SU COMPRA"</div>'
            ;
          }
        }
        
        return content;
      };
      
      // El voucherType se utiliza para diferenciar TICKET y NOTA_DE_CREDITO (ambos se imprimen mediante ticketera)
      Sales.printTicket = function (voucherType, target, data, customer, saleman, details, cardTypes, packs) {
        var ticketHtml = '<!doctype html><html lang="es-PE"><head><meta charset="utf-8">' +
        Sales.getTicketPrintCSS() +
        '</head><body>';
        
        if (Array.isArray(data)) { // Varios tickets
          data.forEach(function (ticket, index) {
            ticketHtml += Sales.getPrintContent(voucherType, ticket, customer, saleman, details, cardTypes, packs);
            
            if (index !== data.length - 1) { // No es el último recorrido del buble
              ticketHtml += '<div class="page-break"></div>';
            }
          });
        } else if (Auth.value('userBranchName') in Settings.branches) { // Es un solo ticket yla sucursal es válida
          ticketHtml += Sales.getPrintContent(voucherType, data, customer, saleman, details, cardTypes, packs);
        }
        
        if ('silentPrint' in $window) {
          ticketHtml += '</body></html>'
          
          $window.silentPrint(ticketHtml);
        } else {
          console.log('target', target);
          if (target) {
            target = $(target);
          } else {
            target = Sales.iframe || (Sales.iframe = $('<iframe src="about:blank" class="hidden-content">').appendTo($('[ng-view]').parent()));
          }
          console.log('Valor final de target', target);
          
          if (target.length) {
            console.log('iframe: target.get(0)', target.get(0));
            var doc = target.get(0).contentWindow.document;
            
            ticketHtml += '<script>window.print()</script></body></html>'
            doc.open('text/html', 'replace');
            doc.write(ticketHtml);
            doc.close();
          }
        }
      };
      
      return Sales;
    }
  ]);
  