window.angular.module('ERP').controller('InventoryKardexCtrl', [
  '$scope', '$timeout', '$window', 'Page', 'Requester', '_siteUrl', '_baseUrl', 'Auth', 'Settings', 'SunatTables', 'FileHandler', '_$', '_riot',
  function ($scope, $timeout, $window, Page, Requester, siteUrl, _baseUrl, Auth, Settings, SunatTables, FileHandler, $, riot) {
    Page.title('Kárdex por producto');

    //const RECORDS_PER_REQUEST = 10;

    var CalcTemplate = $window.CalcTemplate;
    var currentDate = new Date();
    var branches = new Map();
    var data = [];
    var totalInputs = 0;
    var totalOutputs = 0;
    var types = {
      SALDO_INICIAL: 0,
      VENTA: 1,
      DEVOLUCION: 2,
      COMPRA: 3,
      TRASLADO_RECIBIDO: 4,
      TRASLADO_ENVIADO: 5
    };

    //console.log();
    $scope.period = 2;
    $scope.year = currentDate.getFullYear();
    $scope.month = currentDate.getMonth();
    $scope.product = null;
    $scope.branches = [Auth.value('userBranch')];
    $scope.company = null;
    $scope.loading = false;
    $scope.loaded = false;

    $scope.periods = [
      { id: 1, text: 'Mensual' },
      { id: 2, text: 'Anual' }
    ];
    
    Object.keys(Settings.branches).forEach(function (branchName) {
      branches.set(Settings.branches[branchName].branch_id, branchName);
    });

    CalcTemplate.setOptions({
      workerPath: baseUrl('public/lib/calc-template/worker.js')
    });
    
    $scope.submit = function () {
      // Para JS el mes empieza en 0, para PostgreSQL en 1
      var monthSelected = $scope.month + 1;
      var target = $scope.branches.length > 0 ? 'branch' : 'company';
      var dateRange = $scope.period === 1 ? `month/${$scope.year}-${monthSelected}/` : `year/${$scope.year}/`;
      var params = [$scope.product, target, $scope.company, dateRange].join('/');
      
      var sources = [
        {id: 'initial', url: siteUrl(`inventory/get_kardex_initial_stock/${params}`)},
        {id: 'sales', url: siteUrl(`inventory/get_kardex_sales_refunds/${params}`)},
        {id: 'purchases', url: siteUrl(`inventory/get_kardex_purchases/${params}`)}
      ];
      
      if (target === 'branch') {
        sources.push({ id: 'transfers', url: siteUrl(`inventory/get_kardex_transfers/${params}`)});
      }

      $scope.loading = true;
      $scope.loaded = false;

      Requester.on('progress', function (percent) {
        $('[ng-view] .progress-bar').width(`${percent * 100}%`);
      });

      Requester.getObject(sources).then(function (response) {
        console.log('response', response);
        
        $timeout(function () {
          var order = false;
          var initialStock = 0;
          
          totalInputs = 0;
          totalOutputs = 0;
         
          $scope.loading = false;
          $scope.loaded = true;

          data.length = 0;
          
          if ('initial' in response && response.initial.length === 1) {
            data.push({
              date_unix: 0,
              quantity: response.initial[0].quantity,
              type: types.SALDO_INICIAL
            });
          }
          
          if ('sales' in response && response.sales.length > 0) {
            Array.prototype.push.apply(data, response.sales.map(function (sale) {
              sale.date_unix = parseInt(sale.date_unix, 10);
              sale.quantity = parseInt(sale.quantity, 10);
              sale.type = sale.voucher.indexOf('NOTA DE CREDITO') < 0 ? types.VENTA : types.DEVOLUCION;
              sale.serie = sale.serie.zeros(3);
              sale.serial_number = sale.serial_number.zeros(7);
              
              return sale;
            }));
          }
          
          if ('purchases' in response && response.purchases.length > 0) {
            if (data.length > 1) {
              order = true;
            }
            
            Array.prototype.push.apply(data, response.purchases.map(function (purchase) {
              purchase.date_unix = parseInt(purchase.date_unix, 10);
              purchase.quantity = parseInt(purchase.quantity, 10);
              purchase.type = types.COMPRA;
              [purchase.serie, purchase.serial_number] = purchase.serie.split('-');
              
              return purchase;
            }));
          }
          
          if ('transfers' in response && response.transfers.length > 0) {
            if (data.length > 1) {
              order = true;
            }
            
            Array.prototype.push.apply(data, response.transfers.map(function (transfer) {
              transfer.date_unix = parseInt(transfer.date_unix, 10);
              transfer.quantity = parseInt(transfer.quantity, 10);
              transfer.type = transfer.movement === 'SENT' ? types.TRASLADO_ENVIADO : types.TRASLADO_RECIBIDO;
              [transfer.serie, transfer.serial_number] = transfer.serie.split('-');
              
              return transfer;
            }));
          }
          
          if (order) {
            console.log('Se ordenarán los datos');
            data.sort(function (first, second) {
              return first.date_unix - second.date_unix;
            });
          } else {
            console.log('NO se ordenarán los datos');
          }
          
          data.forEach(function (item, index, data) {
            if (item.type === types.SALDO_INICIAL) {
              item.balance = item.quantity;
              totalInputs += item.quantity;
            } else if (item.type === types.DEVOLUCION || item.type === types.COMPRA || item.type === types.TRASLADO_RECIBIDO) {
              item.balance = data[index - 1].balance + item.quantity;
              
              if (item.type === types.DEVOLUCION) {
                totalOutputs -= item.quantity;
              } else {
                totalInputs += item.quantity;
              }
            } else {
              item.balance = data[index - 1].balance - item.quantity;
              totalOutputs += item.quantity;
            }
          });
          
          console.log('datos transformados!', data);
          
          $timeout(function () {
            riot.mount('#kardex-detail', {
              data,
              initialStock,
              types,
              showBranch: $scope.branches.length === 0,
              branches,
              totalInputs,
              totalOutputs,
              'document': function (item) {
                if (item.type === types.VENTA) {
                  return item.voucher.capitalize();
                } else if (item.type === types.DEVOLUCION) {
                  return 'Nota de crédito';
                } else if (item.type === types.COMPRA) {
                  return 'Factura';
                } else if (item.type === types.TRASLADO_ENVIADO || item.type === types.TRASLADO_RECIBIDO) {
                  return 'Guía de remisión';
                } else {
                  return '';
                }
              },
              operation: function (item) {
                if (item.type === types.VENTA) {
                  return 'Venta';
                } else if (item.type === types.DEVOLUCION) {
                  return 'Devolución';
                } else if (item.type === types.COMPRA) {
                  return 'Compra';
                } else if (item.type === types.TRASLADO_ENVIADO || item.type === types.TRASLADO_RECIBIDO) {
                  return 'Transferencia';
                } else {
                  return '';
                }
              },
              inputs: function (item) {
                if (item.type === types.COMPRA || item.type === types.TRASLADO_RECIBIDO || item.type === types.SALDO_INICIAL) {
                  return item.quantity;
                } else {
                  return '';
                }
              },
              outputs: function (item) {
                if (item.type === types.SALDO_INICIAL || item.type === types.COMPRA || item.type === types.TRASLADO_RECIBIDO) {
                  return '';
                } else if (item.type === types.DEVOLUCION) {
                  return -item.quantity;
                } else {
                  return item.quantity;
                }
              },
              getPhysical: function () {
                $scope.download('physical');
              }
            });
          });
        }, 500);
      });
    };

    $scope.download = function (type) {
      var companyInfo = Settings.getCompanyOfBranch($scope.company, Auth.value('userBranch'));
      var branchText = $scope.branches.length > 0 ? Auth.value('userBranch').zeros(2) + ' ' + Auth.value('userBranchName').toUpperCase() : companyInfo.company_address;
      var productData = $('#product-chooser').select2('data');
      var productType = SunatTables.getCode(5, 'MERCADERÍA');
      var measurementUnit = SunatTables.getCode(6, 'UNIDADES');

      if (type === 'physical') {
        FileHandler.get(baseUrl('public/files/inventory/physical_kardex.xlsx'), 'arraybuffer').then(function (buffer) {
          console.log('buffer', buffer);
          var tmpl = new CalcTemplate(buffer);
          
          tmpl.data('C4:C11', [
            getPeriod(),
            companyInfo.company_ruc,
            companyInfo.company_business_name,
            branchText,
            productData.length ? productData[0].code : null,
            productType ? `${productType} MERCADERÍA` : null,
            productData.length ? productData[0].description : null,
            measurementUnit ? `${measurementUnit} UNIDADES` : null
          ]);

          tmpl.data('A15:H15', data.map(function (item) {
            if (item.type === types.SALDO_INICIAL) {
              return [null, null, null, 'SALDO INICIAL', null, item.quantity, null, item.quantity];
            } else if (item.type === types.VENTA) {
              return [item.date_text, SunatTables.getCode(10, item.voucher), item.serie, item.serial_number, SunatTables.getCode(12, 'VENTA'), null, item.quantity, item.balance];
            } else if (item.type === types.DEVOLUCION) {
              return [item.date_text, SunatTables.getCode(10, 'NOTA DE CREDITO'), item.serie, item.serial_number, SunatTables.getCode(12, 'DEVOLUCION'), null, -item.quantity, item.balance];
            } else if (item.type === types.COMPRA) {
              return [item.date_text, SunatTables.getCode(10, 'FACTURA'), item.serie, item.serial_number, SunatTables.getCode(12, 'COMPRA'), item.quantity, null, item.balance];
            } else if (item.type === types.TRASLADO_RECIBIDO) {
              return [item.date_text, SunatTables.getCode(10, 'GUIA REMITENTE'), item.serie, item.serial_number, SunatTables.getCode(12, 'TRASLADO'), item.quantity, null, item.balance];
            } else if (item.type === types.TRASLADO_ENVIADO) {
              return [item.date_text, SunatTables.getCode(10, 'GUIA REMITENTE'), item.serie, item.serial_number, SunatTables.getCode(12, 'TRASLADO'), null, item.quantity, item.balance];
            } else {
              return [null, null, null, null, null, null, null, null];
            }
          }));

          tmpl.data(`F${ 15 + data.length}:G${ 15 + data.length }`, [
            totalInputs,
            totalOutputs
          ]);

          tmpl.blob().then(function (blob) {
            console.log('blob', blob);
            FileHandler.download(blob, getFilename(companyInfo, productData));
          });
        });
      }
    };

    function getFilename(companyInfo, productData) {
      var filename = 'kardex_';

      if (productData.length > 0) {
        filename += productData[0].code.toLowerCase() + '_';
      }

      filename += companyInfo.company_name.toLowerCase() + '_';

      if ($scope.branches.length > 0) {
        filename += `${Auth.value('userBranchName')}_`;
      }

      if ($scope.period === 1) {
        var months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        
        filename += `${months[$scope.month]}_`;
      }
      
      filename += `${$scope.year}.xlsx`;

      return filename;
    }
    
    function getPeriod() {
      if ($scope.period === 1) {
        var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        return `${months[$scope.month]} ${$scope.year}`;
      } else {
        return `${$scope.year}`;
      }
    }

  }
]);