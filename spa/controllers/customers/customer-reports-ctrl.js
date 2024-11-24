window.angular.module('ERP').controller('CustomersReportsCtrl', [
  '$scope', '$timeout', '$window', 'Page', 'Requester', 'Settings', 'FileHandler', 'Auth', '_siteUrl', '_nv', '_d3', '_$', '_moment', '_riot', '_baseUrl',
  function ($scope, $timeout, $window, Page, Requester, Settings, FileHandler, Auth, siteUrl, nv, d3, $, moment, riot, baseUrl) {
    Page.title('Reportes de clientes');
    
    var CalcTemplate = $window.CalcTemplate;

    $scope.loading = false;
    $scope.loaded = false;
    $scope.type = 'HISTORIAL';
    $scope.customer = '';
    $scope.period = 'year';
    $scope.dateRange = null;

    $scope.showCategories = false;
    $scope.showBrands = false;
    $scope.categories = [];
    $scope.brands = [];

    $scope.getPeriod = getPeriod;
    
    $scope.dateRangeOpts = {
      opens: 'left',
      autoApply: true
    };

    $scope.types = [
      {value: 'HISTORIAL', text: 'Historial de compras'}
    ];
    
    $scope.customerOpts = {
      placeholder: '- Seleccione -',
      ajax: {
        url: siteUrl('customers/remote_search'),
        dataType: 'json',
        data: function (params) {
          return {
            q: params.term,
            page: params.page
          };
        }
      },
      templateResult: function(item) {
        if (item.text) {
          return item.text;
        } else {
          var result = '<div class="row">';

          if (item.full_name) {
            result += `<div class="col-lg-12">${ item.full_name }</div>`;
          }

          result += `
              <div class="col-md-4 col-sm-6">
                ${ $scope.getDocType(item.type, item.id_number.length) } Nº ${ item.id_number}
              </div>
              <div class="col-md-8 col-sm-6 text-right">
                ${ item.barcode_card2 ? 'Tarjeta N° ' + item.barcode_card2 : (item.barcode_inticard ? 'Inticard ' + item.barcode_inticard : '') }
              </div>
            </div>
          `;

          return $(result);
        }
      },
      templateSelection: function (item) {
        if (item.text) {
          return item.text;
        } else {
          return $scope.getDocType(item.type, item.id_number.length) + ' Nº ' + item.id_number + (item.full_name ? ' — ' + item.full_name : '');
        }
      }
    };

    $scope.getDocType = function (customerType, idNumberLength) {
      if (customerType === 'PERSONA') {
        return idNumberLength === 8 ? 'DNI' : 'Doc.';
      } else {
        return 'RUC';
      }
    };

    $scope.getTypeSelected = function () {
      var found = $scope.types.find(function (type) {
        return type.value === $scope.type;
      });

      if (found !== undefined) {
        return found.text;
      } else {
        return '';
      }
    };

    $scope.getCustomerSelected = function () {
      if ($('#customer').select2('data').length > 0) {
        var customer = $('#customer').select2('data')[0];

        return $scope.getDocType(customer.type, customer.id_number.length) + ' Nº ' + customer.id_number + (customer.full_name ? ' — ' + customer.full_name : '');
      } else {
        return '';
      }
    };

    $scope.goBack = function () {
      $scope.loaded = false;
    }

    $scope.categoryOpts = {
      chart: {
        type: 'pieChart',
        height: 320,
        donut: true,
        x: function (d) { return d.key; },
        y: function (d) { return d.y; },
        showLabels: true,
        labelsOutside: true,
        donutRatio: .5,
        labelType: 'value',
        showLegend: true,
        objectEquality: true,
        legend: {
          margin: {
            top: 10,
            bottom: 25
          }
        }
      },
      title: {
        enable: true,
        text: 'Compras por línea'
      }
    };

    $scope.brandOpts = {
      chart: {
        type: 'pieChart',
        height: 320,
        donut: true,
        x: function (d) { return d.key; },
        y: function (d) { return d.y; },
        showLabels: true,
        labelsOutside: true,
        donutRatio: .5,
        labelType: 'value',
        showLegend: true,
        objectEquality: true,
        legend: {
          margin: {
            top: 10,
            bottom: 25
          }
        }
      },
      title: {
        enable: true,
        text: 'Compras por marca'
      }
    };
    
    CalcTemplate.setOptions({
      workerPath: baseUrl('public/lib/calc-template/worker.js')
    });

    $scope.generate = function () {
      var startDate, endDate;

      switch ($scope.period) {
        case 'year':
          startDate = 'year';
          endDate = $scope.dateRange;
          break;
        case 'month':
          startDate = 'month';
          endDate = $scope.dateRange.join('-');
          break;
        default:
          [startDate, endDate] = $scope.dateRange;
      }

      var reportParams = `customer_id=${$scope.customer}&start_date=${startDate}&end_date=${endDate}`;

      $scope.loading = true;
      $scope.loaded = false;

      Requester.on('progress', function (percent) {
        $('[ng-view] .progress-bar').width(`${percent * 100}%`);
      });
      
      Requester.getObject([
        {
          id: 'purchases',
          url: siteUrl(`customers/purchase_report?${ reportParams }`)
        },
        {
          id: 'categories',
          url: siteUrl(`customers/purchase_report_detail/categories?${ reportParams }`)
        },
        {
          id: 'brands',
          url: siteUrl(`customers/purchase_report_detail/brands?${ reportParams }`)
        }
      ]).then(function (data) {
        $scope.categories.length = 0;
        $scope.brands.length = 0;

        $timeout(function () {
          var {purchases, categories, brands} = data;

          categories.forEach(castCategoryOrBrandValue);
          categories = categories.filter(filterCategoryOrBrand);

          brands.forEach(castCategoryOrBrandValue);
          brands = brands.filter(filterCategoryOrBrand);

          $scope.loading = false;
          $scope.loaded = true;
          
          purchases.forEach(function (item) {
            item.amount = parseFloat(item.total_amount);
            
            delete item.total_amount;
          });

          $timeout(function () {
            var vouchers = { 'TICKET': 'TCK', 'BOLETA': 'BOL', 'FACTURA': 'FAC', 'NOTA DE CREDITO': 'NC', 'TICKET NOTA DE CREDITO': 'TCK. NC' };

            riot.mount('#output', {
              data: purchases,
              indexed: true,
              moment,
              vouchers,
              totalAmount: purchases.reduce(function (accum, current) {
                return accum + (current.voucher.indexOf('NOTA DE CREDITO') < 0 ? current.amount : -current.amount);
              }, 0),
              numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
              download: function (e) {
                var opts = this.opts;
                //var company = Settings.getCompanyOfBranch($scope.company, Auth.value('userBranch'));
                
                FileHandler.get(baseUrl(`public/files/reports/customer_purchases.xlsx`), 'arraybuffer').then(function (buffer) {
                  var tmpl = new CalcTemplate(buffer);
                  var customer = $('#customer').select2('data').length > 0 ? $('#customer').select2('data')[0] : {};
                  
                  if (customer.barcode_card2) {
                    tmpl.data('C5', customer.barcode_card2);
                  } else if (customer.barcode_inticard) {
                    tmpl.data('A5', 'TARJ. INTICARD Nº');
                    tmpl.data('C5', customer.barcode_inticard);
                  }

                  tmpl.data('C3', customer.full_name || null);
                  tmpl.data('C4', customer.id_number || null);
                  tmpl.data('C6', getPeriod());

                  if (customer.type === 'EMPRESA' || customer.id_number.length !== 8) {
                    tmpl.data('A4', $scope.getDocType(customer.type, customer.id_number.length) + ' Nº');
                  }

                  tmpl.data('A9:H9', purchases.map(function (item, index) {
                    return [
                      index + 1,
                      item.sale_date.split(' ').shift().split('-').reverse().join('/'),
                      item.cashier,
                      vouchers[item.voucher] + '. ' + item.serie.zeros(3) + '-' + item.serial_number.zeros(7),
                      item.regime === 'ZOFRA' ? 'Zofra' : 'General',
                      item.company,
                      item.branch,
                      (item.voucher.indexOf('NOTA DE CREDITO') < 0 ? 1 : -1) * item.amount
                    ];
                  }));

                  tmpl.data(`H${ purchases.length + 9 }`, parseFloat(purchases.reduce(function (accum, current) {
                    return accum + (current.voucher.indexOf('NOTA DE CREDITO') < 0 ? 1 : -1) * current.amount;
                  }, 0).toFixed(2)));
                  
                  tmpl.blob().then(function (blob) {
                    FileHandler.download(blob, getFilename());
                  });
                });
                
                e.preventDefault();
              },
              printableUrl: siteUrl(`customers/purchase_report_printable?${ reportParams }`)
            });

            $scope.showCategories = categories.length > 0;
            $scope.showBrands = brands.length > 0;
            $scope.categories = categories;
            $scope.brands = brands;
          });

        }, 500);
      });
    };
    
    function getPeriod() {
      var months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      var period = '';

      switch ($scope.period) {
        case 'year':
          period = $scope.dateRange;
          break;
        case 'month':
          period = months[$scope.dateRange[1] - 1] + ' ' + $scope.dateRange[0];
          break;
        default:
          period = $scope.dateRange.map(function (item) {
            return item.split('-').reverse().join('/');
          }).join(' - ');
      }
      
      return period;
    }
    
    function getFilename() {
      var filename = 'historial_compras';
      
      if ($('#customer').select2('data').length > 0) {
        var customer = $('#customer').select2('data')[0];

        filename += '_' + customer.id_number;
      }

      if ($scope.period === 'year') {
        filename += '_' + $scope.dateRange;
      } else if ($scope.period === 'month') {
        var months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        
        filename += '_' + months[$scope.dateRange[1] - 1] + '_' + $scope.dateRange[0];
      }
      
      filename += `.xlsx`;
      
      return filename;
    }

    function castCategoryOrBrandValue(item) {
      item.y = parseFloat(item.y);
    }

    function filterCategoryOrBrand(item) {
      return item.y > 0;
    }
  }
]);
