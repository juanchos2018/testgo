window.angular.module('ERP').controller('InventoryCtrl', [
  '$scope', '$window', '$timeout', 'Page', 'Ajax', 'FileHandler', 'Settings', 'Auth', '_$', '_baseUrl', '_siteUrl', '_URI', '_bootbox', '_moment',
  function ($scope, $window, $timeout, Page, Ajax, FileHandler, Settings, Auth, $, baseUrl, siteUrl, URi, bootbox, moment) {
    Page.title('Inventario');

    var currentDate = new Date();
    var CalcTemplate = $window.CalcTemplate;
    var URI = $window.URI;

    const DELAY = 10;
    const RECORDS_PER_REQUEST = 1000;

    CalcTemplate.setOptions({
      workerPath: baseUrl('public/lib/calc-template/worker.js')
    });

    $scope.type = 'FISICO';
    $scope.output = 'XLSX';
    $scope.company = '';
    $scope.branches = [];
    $scope.period = 1;
    $scope.startDate = '';
    $scope.endDate = '';
    $scope.year = currentDate.getFullYear();
    $scope.month = currentDate.getMonth();
    $scope.loading = false;
    $scope.percent = 0;
    $scope.loadingMessage = '';
    $scope.worker = null;
    $scope.companyInfo = null;

    $scope.types = [
      { id: 'FISICO', text: 'Inventario permanente en unidades físicas' },
      { id: 'VALORIZADO', text: 'Inventario permanente valorizado' }
    ];

    $scope.outputs = [
      { id: 'XLSX', text: 'Archivo único (Excel)' },
      { id: 'ZIP', text: 'Múltiples archivos (Zip)' }
    ];

    $scope.typeOpts = {
      placeholder: '- Seleccione -'
    };

    $scope.periods = [
      // {id: 0, text: 'Personalizado'},
      { id: 1, text: 'Mensual' },
      { id: 2, text: 'Anual' }
    ];

    $scope.sunatTables = {};
    $scope.voucherTypes = null;
    $scope.transactionTypes = null;
    $scope.inventoryValues = null;

    $scope.setSunatTables = function (data) {
      data.forEach(function (el) {
        $scope.sunatTables[el.id] = JSON.parse(el.items);
      });

      $scope.voucherTypes = {
        'TICKET': $scope.sunatTables['10'].find(sunatTableFinder('Ticket o cinta emitido por máquina registradora')),
        'BOLETA': $scope.sunatTables['10'].find(sunatTableFinder('Boleta de Venta')),
        'FACTURA': $scope.sunatTables['10'].find(sunatTableFinder('Factura')),
        'NOTA DE CREDITO': $scope.sunatTables['10'].find(sunatTableFinder('Nota de crédito')),
        'GUIA REMITENTE': $scope.sunatTables['10'].find(sunatTableFinder('Guía de remisión - Remitente'))
      };

      $scope.transactionTypes = {
        'VENTA': $scope.sunatTables['12'].find(sunatTableFinder('VENTA')),
        'COMPRA': $scope.sunatTables['12'].find(sunatTableFinder('COMPRA')),
        'CONSIGNACION RECIBIDA': $scope.sunatTables['12'].find(sunatTableFinder('CONSIGNACIÓN RECIBIDA')),
        'CONSIGNACION ENTREGADA': $scope.sunatTables['12'].find(sunatTableFinder('CONSIGNACIÓN ENTREGADA')),
        'TRANSFERENCIA ENTRE ALMACENES': $scope.sunatTables['12'].find(sunatTableFinder('TRANSFERENCIA ENTRE ALMACENES')),
        'DEVOLUCION': $scope.sunatTables['12'].find(sunatTableFinder('DEVOLUCIÓN RECIBIDA'))
      };

      $scope.inventoryValues = {
        productType: $scope.sunatTables['5'].find(sunatTableFinder('MERCADERÍA')),
        measurementUnit: $scope.sunatTables['6'].find(sunatTableFinder('UNIDADES'))
      };
    };

    $scope.$watch('percent', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        $('[ng-view] [easy-pie-chart]').data('easyPieChart').update(newVal);
      }
    });

    $scope.generate = function () {
      var currentBranchDetail = Settings.getBranchDetail($scope.company, Auth.value('userBranch'));
      var dateRange = $scope.period === 1 ? `month/${$scope.year}-${$scope.month}/` : `year/${$scope.year}/`;
      var target = $scope.branches.length === 0 ? 'company' : 'branch';
      var companyOrBranch = target === 'company' ? $scope.company : currentBranchDetail;
      var productsUrl = $window.siteUrl(`inventory/get_products/${$scope.type}`);

      $scope.worker = new Worker(baseUrl('public/js/workers/inventory-data.js?t=' + (new Date().getTime())));
      $scope.companyInfo = Settings.getCompanyOfBranch($scope.company, Auth.value('userBranch'));
      
      $scope.loading = true;

      var sources = [
        {
          message: 'Obteniendo inventario inicial',
          url: URI(`inventory/get_initial_stocks/${target}/${companyOrBranch}/${dateRange}`),
          type: 'initial-stocks'
        },
        {
          message: 'Obteniendo ventas',
          url: URI(`inventory/get_sales/${$scope.type}/${target}/${$scope.company}/${dateRange}`),
          type: 'sales'
        },
        {
          message: 'Obteniendo compras',
          url: URI(`inventory/get_purchases/${$scope.type}/${target}/${companyOrBranch}/${dateRange}`),
          type: 'purchases'
        }
      ];

      if (target === 'branch') {
        sources.push(
          {
            message: 'Obteniendo traslados',
            url: URI(`inventory/get_transfers/${$scope.type}/${target}/${companyOrBranch}/${dateRange}`),
            type: 'transfers'
          }
        );
      }

      if ($scope.period === 1 && $scope.month > 0) { // Si es mensual e inicia a partir de Febrero
        sources.push(
          {
            message: 'Procesando ventas',
            url: URI(`inventory/get_previous_sales/${$scope.type}/${target}/${$scope.company}/${dateRange}`),
            type: 'prev-sales'
          },
          {
            message: 'Procesando devoluciones',
            url: URI(`inventory/get_previous_refunds/${$scope.type}/${target}/${$scope.company}/${dateRange}`),
            type: 'prev-refunds'
          },
          {
            message: 'Procesando compras',
            url: URI(`inventory/get_previous_purchases/${$scope.type}/${target}/${companyOrBranch}/${dateRange}`),
            type: 'prev-purchases'
          }
        );

        if (target === 'branch') {
          sources.push(
            {
              message: 'Procesando traslados recibidos',
              url: URI(`inventory/get_previous_transfers_received/${$scope.type}/${target}/${companyOrBranch}/${dateRange}`),
              type: 'prev-received-transfers'
            },
            {
              message: 'Procesando traslados enviados',
              url: URI(`inventory/get_previous_transfers_sent/${$scope.type}/${target}/${companyOrBranch}/${dateRange}`),
              type: 'prev-sent-transfers'
            }
          );
        }
      }

      $scope.worker.postMessage({
        action: 'init',
        productsUrl
      });

      getData(sources);

      $scope.worker.onmessage = function (e) {
        switch (e.data.response) {
          case 'error':
            console.error('Worker error', e.data.message);
            break;
          
          case 'done':
            var productsData = e.data.data;
            
            if (productsData.size > 0) {
              $scope.loadingMessage = 'Creando estructura de datos';
              $scope.percent = 0;
              
              $scope.$apply();

              FileHandler.get(baseUrl('public/files/inventory/physical_kardex.xlsx'), 'arraybuffer').then(function (buffer) {
                var tmpl = new CalcTemplate(buffer);
                
                setData(productsData.entries(), tmpl, productsData.size);
              });
            }
            break;
        }
      };
    };

    $scope.reset = function () {
      $scope.worker.terminate();
      $scope.worker = null;
      $scope.companyInfo = null;
      $scope.loading = false;
      $scope.percent = 0;
      $scope.loadingMessage = '';
    };

    function getPeriod() {
      var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      if ($scope.period === 1) {
        return `${months[$scope.month]} ${$scope.year}`;
      } else {
        return `${$scope.year}`;
      }
    }

    function getPercent(data) {
      return ((data.page - 1) * RECORDS_PER_REQUEST + data.items.length) / data.total_count;
    }

    function getData(sources, sourceIndex = 0) {
      var source = sources[sourceIndex];
      var sourceData = [];

      $scope.loadingMessage = source.message;

      Ajax.getData(siteUrl(source.url.search({ display: RECORDS_PER_REQUEST, page: 1 }).toString())).then(function _callback(data) {
        if (data.items && data.items.length > 0) {
          Array.prototype.push.apply(sourceData, data.items);

          $scope.percent = 100 / sources.length * (sourceIndex + getPercent(data));
        }

        if (data.next_page) {
          Ajax.getData(siteUrl(source.url.search({ display: RECORDS_PER_REQUEST, page: data.next_page }).toString())).then(_callback);
        } else {
          $scope.worker.postMessage({
            action: 'set-data',
            type: source.type,
            records: sourceData
          });

          sourceData.length = 0;

          $timeout(function () {
            if (sourceIndex + 1 < sources.length) {
              getData(sources, sourceIndex + 1);
            } else {
              $scope.loadingMessage = 'Obteniendo productos';
              $scope.percent = 100;

              $scope.worker.postMessage({ action: 'start' });
            }
          }, DELAY);
        }
      }, function (reason) {
        console.error(reason);
      });
    }

    function setData(entries, template, size, entryIndex = 0) {
      var next = entries.next(), balance = 0;

      if (!next.done) {
        var [product, operations] = next.value;

        if (entryIndex > 0) {
          template.sheetFrom(1, product.code);
        }

        template.data('C4:C11', [
          getPeriod(),
          $scope.companyInfo.company_ruc,
          $scope.companyInfo.company_business_name,
          $scope.branches.length > 0 ? `${ Auth.value('userBranch').zeros(2) } ${ Auth.value('userBranchName').toUpperCase() }` : $scope.companyInfo.company_address,
          product.code,
          $scope.inventoryValues.productType ? `${ $scope.inventoryValues.productType.code } ${ $scope.inventoryValues.productType.description }` : null,
          product.description,
          $scope.inventoryValues.measurementUnit ? `${ $scope.inventoryValues.measurementUnit.code } ${ $scope.inventoryValues.measurementUnit.description }` : null
        ]);

        var input = 0, output = 0;

        var sheetData = operations.map(function (operation, index) {
          var row, quantity;

          if (index === 0) {
            balance = parseInt(operation.quantity, 10);
            input = balance;

            row = [
              null,
              null,
              null,
              'SALDO INICIAL',
              null,
              balance,
              null,
              balance
            ];
          } else {
            switch (operation.type) {
              case 'purchase':
                quantity = parseInt(operation.quantity, 10);
                balance += quantity;

                if (input === null) {
                  input = quantity;
                } else {
                  input += quantity;
                }

                row = [
                  moment(operation.input_date).format('DD/MM/YYYY'), // A
                  $scope.voucherTypes.FACTURA.code, // B
                  operation.serie.split('-').shift(), // C
                  operation.serie.split('-').pop(), // D
                  $scope.transactionTypes.COMPRA.code, // E
                  quantity, // F
                  null, // G
                  balance // H
                ];

                break;
              case 'sale':
                var isRefund = operation.voucher.indexOf('NOTA DE CREDITO') > -1;
                
                quantity = (isRefund ? -1 : 1) * parseInt(operation.quantity, 10);
                balance -= quantity;

                if (output === null) {
                  output = quantity;
                } else {
                  output += quantity;
                }

                row = [
                  moment(operation.sale_date).format('DD/MM/YYYY'), // A
                  getVoucherType(operation.voucher), // B
                  operation.serie.zeros(3), // C
                  operation.serial_number.zeros(7), // D
                  (isRefund ? $scope.transactionTypes.DEVOLUCION.code : $scope.transactionTypes.VENTA.code), // E
                  null, // F
                  quantity, // G
                  balance // H
                ];

                isRefund = null;
                break;
              case 'transfer':
                var isReceived = (operation.branch_detail_target_id == Settings.getBranchDetail($scope.company, Auth.value('userBranch')));

                quantity = parseInt(operation.quantity, 10);
                // balance += (isReceived ? 1 : -1) * quantity;

                if (isReceived) {
                  balance += quantity;
                  
                  if (input === null) {
                    input = quantity;
                  } else {
                    input += quantity;
                  }
                } else {
                  balance -= quantity;
                  
                  if (output === null) {
                    output = quantity;
                  } else {
                    output += quantity;
                  }
                }

                row = [
                  moment(operation.transfer_date).format('DD/MM/YYYY'), // A
                  $scope.voucherTypes['GUIA REMITENTE'].code, // B
                  operation.serie.split('-').shift(), // C
                  operation.serie.split('-').pop(), // D
                  $scope.transactionTypes['TRANSFERENCIA ENTRE ALMACENES'].code, // E
                  (isReceived ? quantity : null), // F
                  (isReceived ? null : quantity), // G
                  balance // H
                ];

                isReceived = null;
                break;
            }
          }
          

          return row;
        });

        if (sheetData.length > 0) {
          template.data('A15:H15', sheetData)
            .data(`F${15 + sheetData.length}:G${15 + sheetData.length}`, [input, output]);
        }
        
        $scope.$apply(function () {
          $scope.percent = 100 * (entryIndex + 1) / size;
        });

        setTimeout(function () {
          setData(entries, template, size, entryIndex + 1);
        }, DELAY);
      } else {
        $scope.$apply(function () {
          $scope.loadingMessage = 'Escribiendo datos en archivo';
        });

        template.blob().then(function (blob) {
          var filename = `inventario_${$scope.companyInfo.company_name}_`;

          if ($scope.branches.length > 0) {
            filename += `${Auth.value('userBranchName')}_`;
          }

          if ($scope.period === 1) {
            var months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
            
            filename += `${months[$scope.month]}_`;
          }
          
          filename += `${$scope.year}.xlsx`;
          
          $scope.reset();

          FileHandler.download(blob, filename.toLowerCase());
        });
      }
    }

    function sunatTableFinder(value) {
      return function (item) {
        return item.description === value;
      };
    }

    function getVoucherType(voucher) {
      switch (voucher) {
        case 'TICKET':
        case 'BOLETA':
        case 'FACTURA':
          return $scope.voucherTypes[voucher].code;
        default:
          if (voucher.indexOf('NOTA DE CREDITO') > -1) {
            return $scope.voucherTypes['NOTA DE CREDITO'].code;
          } else {
            return '';
          }
      }
    }
  }
]);
