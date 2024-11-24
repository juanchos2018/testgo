window.angular.module('ERP').controller('ManpowerReportsCtrl', [
  '$scope', '$timeout', '$window', 'Page', 'Requester', 'Settings', 'FileHandler', 'Auth', '_siteUrl', '_nv', '_d3', '_$', '_moment', '_riot', '_baseUrl',
  function ($scope, $timeout, $window, Page, Requester, Settings, FileHandler, Auth, siteUrl, nv, d3, $, moment, riot, baseUrl) {
    Page.title('Reportes de recursos humanos');
    
    var CalcTemplate = $window.CalcTemplate;

    $scope.loading = false;
    $scope.loaded = false;
    $scope.type = 'RESUMEN';
    $scope.employee = '';
    $scope.period = 'month';
    $scope.dateRange = null;
    $scope.company = '';
    $scope.data = [];

    $scope.dateRangeOpts = {
      opens: 'left',
      autoApply: true
    };

    $scope.types = [
      {value: 'RESUMEN', text: 'Resumen de ventas por vendedores'},
      {value: 'DETALLE', text: 'Detalle de ventas de vendedor'}
    ];

    $scope.nvd3Data = [
      {key: 'Cantidad', bar: true, values: []},
      {key: 'Monto', values: []}
    ];
    
    CalcTemplate.setOptions({
      workerPath: baseUrl('public/lib/calc-template/worker.js')
    });

    $scope.getPeriod = getPeriod;

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

    $scope.getCompanySelected = function () {
      var company = Settings.getCompanyOfBranch($scope.company, Auth.value('userBranch'));

      return company.company_name;
    };

    $scope.getEmployeeSelected = function () {
      return $('#employee').select2('data').length > 0 ? $('#employee').select2('data')[0].text.substr(5) || '' : '';
    };

    $scope.goBack = function () {
      console.log('vuelve?');
      $scope.loaded = false;
    }

    $scope.generate = function () {
      var startDate, endDate, hasDetails = false;

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

      var reportParams = $scope.type === 'RESUMEN' ? '' : `employee_id=${$scope.employee}&`;

      reportParams += `start_date=${startDate}&end_date=${endDate}&company_id=${$scope.company}`;

      $scope.loading = true;
      $scope.loaded = false;

      Requester.on('progress', function (percent) {
        $('[ng-view] .progress-bar').width(`${percent * 100}%`);
      });

      console.log('Ejecutando generate', new Date() .getTime());
      
      Requester.getArray([siteUrl(`manpower/${ $scope.type === 'RESUMEN' ? 'summary' : 'sale' }_report?${ reportParams }`)]).then(function (data) {
        console.log('Ejecutando getArray', new Date() .getTime());
        console.log('data', data);
        $timeout(function () {
          $scope.loading = false;
          $scope.loaded = true;
          $scope.data.length = 0;

          if ($scope.type === 'RESUMEN') {
            $scope.nvd3Data[0].color = '#4f99b4';
            $scope.nvd3Data[1].color = '#d67777';
          } else if ($scope.type === 'DETALLE') {
            $scope.nvd3Data[0].color = '#ccf';
            //$scope.nvd3Data[1].color = '#333';
            $scope.nvd3Data[1].color = '#d67777';
          }

          $scope.nvd3Data[0].values.length = 0;
          $scope.nvd3Data[1].values.length = 0;

          $scope.data = data.map(function (item) {
            item.quantity = parseInt(item.quantity, 10);
            item.amount = parseFloat(item.amount);

            if ($scope.type === 'RESUMEN' && item.quantity > 0 && item.amount > 0) {
              $scope.nvd3Data[0].values.push({ label: item.full_name, value: item.quantity, type: 'quantity' });
              $scope.nvd3Data[1].values.push({ label: item.full_name, value: item.amount, type: 'amount' });
            } else if ($scope.type === 'DETALLE') {
              $scope.nvd3Data[0].values.push([item.date, item.quantity]);
              $scope.nvd3Data[1].values.push([item.date, item.amount]);

              if (item.quantity > 0 && !hasDetails) {
                hasDetails = true;
              }
            }

            return item;
          });

          console.log('nvd3Data', $scope.nvd3Data);

          $timeout(function () {
            riot.mount('#output', {
              type: $scope.type,
              data: $scope.data,
              indexed: $scope.type === 'RESUMEN',
              moment,
              download: function (e) {
                var opts = this.opts;
                var company = Settings.getCompanyOfBranch($scope.company, Auth.value('userBranch'));
                
                FileHandler.get(baseUrl(`public/files/reports/seller_${ opts.type === 'RESUMEN' ? 'summary' : 'sales' }.xlsx`), 'arraybuffer').then(function (buffer) {
                  var tmpl = new CalcTemplate(buffer);
                  
                  if (opts.type === 'RESUMEN') {
                    tmpl.data('C3:C5', [
                      company.company_name,
                      Auth.value('userBranchName'),
                      getPeriod()
                    ]).data('A8:E8', $scope.data.map(function (item, index) {
                      return [
                        index + 1,
                        item.id.zeros(4),
                        item.full_name,
                        item.amount,
                        item.quantity
                      ];
                    }));
                  } else {
                    tmpl.data('B3:B6', [
                      company.company_name,
                      Auth.value('userBranchName'),
                      getPeriod(),
                      $('#employee').select2('data').length > 0 ? $('#employee').select2('data')[0].text.substr(5) || '' : ''
                    ]);
                    // console.log('data.length', $scope.data.length);
                    if ($scope.data.length > 0) {
                      var days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                      var dow = moment($scope.data[0].date).day();
                      
                      tmpl.data('A9:D9', $scope.data.map(function (item, index) {
                        return [
                          item.date.split('-').reverse().join('/'),
                          days[(dow + index) % 7],
                          item.amount,
                          item.quantity
                        ];
                      }));
                    }
                  }
                  
                  tmpl.blob().then(function (blob) {
                    FileHandler.download(blob, getFilename(company));
                  });
                });
                
                e.preventDefault();
              },
              filterCode: function (item) {
                return item.id.zeros(4).indexOf(this.value) > -1;
              },
              printableUrl: siteUrl(`manpower/${ $scope.type === 'RESUMEN' ? 'summary' : 'sale' }_printable?${ reportParams }`)
            });

            if ($scope.type === 'RESUMEN' && $scope.nvd3Data[0].values.length > 0) {
              var quantityFactor = Math.round($scope.nvd3Data[1].values.reduce(findMaxValue, 0) / $scope.nvd3Data[0].values[0].value);

              $('#chart svg').height(Math.max($scope.nvd3Data[0].values.length * 45, 150) + 'px');

              nv.addGraph(function() {
                var chart = nv.models.multiBarHorizontalChart()
                  .x(function(d) { return d.label; })
                  .y(function(d) { return d.type === 'quantity' ? -quantityFactor * d.value : d.value; })
                  .valueFormat(function (d) { return d < 0 ? (-d / quantityFactor).toLocaleString() : 'S/' + d.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); })
                  .margin({top: 30, right: 20, bottom: 50, left: 280})
                  .showValues(true)
                  //.tooltips(false)
                  //.transitionDuration(350)
                  .showControls(false)
                  .showYAxis(false);

                chart.tooltip.enabled(false);

                chart.yAxis
                  .tickFormat(d3.format(',.2f'));

                d3.select('#chart svg')
                  .datum($scope.nvd3Data)
                  .call(chart);

                nv.utils.windowResize(chart.update);

                return chart;
              });
            } else if ($scope.type === 'DETALLE') {
              nv.addGraph(function() {
                var chart = nv.models.linePlusBarChart()
                  .margin({top: 30, right: 60, bottom: 50, left: 70})
                  //We can set x data accessor to use index. Reason? So the bars all appear evenly spaced.
                  .x(function(d, i) { return i; })
                  .y(function(d, i) { return d[1]; })
                  .options({focusEnable: false})
                ;

                chart.xAxis.tickFormat(function(d) {
                  var dx = $scope.nvd3Data[0].values[d] && $scope.nvd3Data[0].values[d][0] || 0;

                  return window.moment(dx).format('DD-MMM');
                });

                chart.y1Axis
                  .tickFormat(d3.format(',f'));

                chart.y2Axis
                  .tickFormat(function(d) { return 'S/' + d3.format(',f')(d) });

                if (!hasDetails) { // No hay datos de detalle
                  chart.lines.forceY([100]);
                  chart.bars.forceY([100]);
                  
                }

                d3.select('#chart svg')
                  .datum($scope.nvd3Data)
                  .transition()
                  .duration(0)
                  .call(chart)
                ;

                nv.utils.windowResize(chart.update);

                return chart;
              });
            }
          });

        }, 500);
      });
    };
    
    function findMaxValue(accum, current) {
      return current.value > accum ? current.value : accum;
    }
    
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
    
    function getFilename(company) {
      // var company = Settings.getCompanyOfBranch($scope.company, Auth.value('userBranch'));
      var filename = `${company.company_name.toLowerCase()}_${ Auth.value('userBranchName').toLowerCase() }_${ $scope.type === 'RESUMEN' ? 'resumen_vendedores' : 'vendedor' }`;
      
      if ($scope.type === 'DETALLE' && $('#employee').select2('data').length > 0) {
        filename += '_' + $('#employee').select2('data')[0].id.zeros(4);
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
  }
]);
