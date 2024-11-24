window.angular.module('ERP').controller('ProductsStocksCtrl', [
    '$scope', '$window', 'Page', 'Ajax', 'FileHandler', 'Requester', 'Auth', 'Settings', '_siteUrl', '_baseUrl', '_bootbox', '_$',
    function ($scope, $window, Page, Ajax, FileHandler, Requester, Auth, Settings, siteUrl, baseUrl, bootbox, $) {
      var CalcTemplate = $window.CalcTemplate;
      var moment = $window.moment;
      var companies = Settings.getCompaniesOfBranch();
      var setTimeout = window.setTimeout;
      var timestamp = null;
      var timeStart = null;
      var progressStart = null;
      var remainingShown = false;

      Page.title('Existencias de productos');

      CalcTemplate.setOptions({
        workerPath: baseUrl('public/lib/calc-template/worker.js')
      });

      $scope.download = function (stock, grouped, order) {
        var dialog = bootbox.dialog({
          title: 'Descargar existencias',
          closeButton: false,
          show: false,
          message: `
            <div class="row m-b-sm">
              <div class="col-lg-12"><label>Origen</label></div>
              <div class="col-sm-6">
                <div class="radio i-checks">
                  <label>
                    <input type="radio" value="records" name="origin" checked>
                    <i></i> Registros actuales
                  </label>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="radio i-checks">
                  <label>
                    <input type="radio" value="inventory" name="origin">
                    <i></i> Inventario (conteo por operaciones)
                  </label>
                </div>
              </div>
            </div>
            <div class="row date-container" style="display:none">
              <div class="col-sm-6">
                <div class="row">
                  <div class="col-lg-12"><label>Mes</label></div>
                  <div class="col-lg-9">
                    <select class="form-control month-input">
                      <option value="0">- Todos los meses -</option>
                      <option value="1">Enero</option>
                      <option value="2">Febrero</option>
                      <option value="3">Marzo</option>
                      <option value="4">Abril</option>
                      <option value="5">Mayo</option>
                      <option value="6">Junio</option>
                      <option value="7">Julio</option>
                      <option value="8">Agosto</option>
                      <option value="9">Septiembre</option>
                      <option value="10">Octubre</option>
                      <option value="11">Noviembre</option>
                      <option value="12">Diciembre</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="col-sm-6">
                <div class="row">
                  <div class="col-lg-12"><label class="required">Año</label></div>
                  <div class="col-lg-6">
                    <input type="number" class="form-control text-center year-input" min="2015" max="2100">
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-lg-12">
                <div class="alert alert-warning m-t m-b-none" role="alert" style="display:none" id="grouped-message">
                  La opción seleccionada mostrará las tallas agrupadas
                </div>
              </div>
            </div>
            <div class="row m-t" style="display:none" data-progress>
              <div class="col-lg-12 loading-progress">
                <div class="progress progress-sm progress-striped m-b-sm">
                  <div class="progress-bar bg-success" style="width: 0"></div>
                </div>
                <p class="m-b-none">Obteniendo datos: <span class="percent">0</span>%.</p>
              </div>

              <div class="col-lg-12 write-progress" style="display:none">
                <div class="progress progress-sm progress-striped m-b-sm">
                  <div class="progress-bar bg-success" style="width: 0"></div>
                </div>
                <p class="m-b-none">
                  Escribiendo datos: <span class="percent">0</span>%. 
                  <span class="remaining" style="display:none">Tiempo restante estimado: <span class="remaining-time"></span></span>
                </p>
              </div>
            </div>
          `,
          buttons: {
            download: {
              label: 'Aceptar',
              className: 'btn-primary',
              callback: function () {
                var origin = $('input[name="origin"]:checked', modal).val();
                
                if (origin === 'records' || $('.year-input', modal).get(0).checkValidity()) {
                  var modal = this;
                  var params = [];
                  var templateUrl = `public/files/inventory/${!grouped && origin !== 'inventory' ? 'size_' : ''}stock_summary.xlsx`;
                  var productsUrl = siteUrl(`products/get_for_summary`);
                  var sizesUrl = siteUrl(`sizes/get_for_summary`);
                  var orderedBy = order ? (order.rel + ' ' + (order.asc ? 'asc' : 'desc')) : null;
                  
                  $('input[name="origin"], .year-input, .month-input, .modal-footer > button', modal).attr('disabled', true);
                  
                  $('[data-progress]', modal).show()
                    .find('.loading-progress').show()
                    .end().find('.write-progress').hide()
                    .end().find('.progress-bar').width('0%')
                  ;
                  
                  order && params.push(`order=${ encodeURIComponent(orderedBy) }`);
                  stock && params.push('filters[][stock]');
                  grouped && params.push('filters[][group]');
                  
                  Requester.on('progress', function (progress) {
                    var percent = Math.round(progress * 100);
                    //console.log('Requester percent', percent);
                    $('[data-progress] > .loading-progress', modal).find('.progress-bar').width(`${percent}%`)
                      .end().find('.percent').text(percent)
                    ;
                  });

                  if (origin === 'inventory') {
                    var year = $('.year-input', modal).val();
                    var monthInput = $('.month-input', modal);
                    var month = monthInput.val();
                    var monthText = monthInput.find('option:selected').text();
                    var period = (month == 0 ? year : `${ monthText.substr(0, 3) }. ${ year }`);
                    var sources = {};
                    
                    sources[siteUrl(`products/get_initial_stocks/${year}`)] = 'initial';
                    sources[siteUrl(`products/get_summary_sales/${ year }/${month}${ grouped ? '?size_grouped' : ''}`)] = 'sales'; // Puede ser sales si se cambia el Web Worker
                    sources[siteUrl(`products/get_summary_refunds/${ year }/${month}${ grouped ? '?size_grouped' : ''}`)] = 'refunds';
                    sources[siteUrl(`products/get_summary_purchases/${ year }/${month}${ grouped ? '?size_grouped' : ''}`)] = 'purchases';
                    sources[siteUrl(`products/get_summary_transfers_received/${ year }/${month}${ grouped ? '?size_grouped' : ''}`)] = 'transfers-received';
                    sources[siteUrl(`products/get_summary_transfers_sent/${ year }/${month}${ grouped ? '?size_grouped' : ''}`)] = 'transfers-sent';
                    
                    Requester.getObject(Object.keys(sources)).then(function (result) {
                      var worker = new Worker(baseUrl('public/js/workers/product-stock-data.js?t=' + (new Date().getTime())));
                      var records = {};
                      
                      //$('[data-progress] .progress-bar', modal).removeClass('progress-bar').width(0); //.delay(5000).addClass('progress-bar');
                      
                      Object.keys(result).forEach(function (url) {
                        records[sources[url]] = result[url];
                      });
                      
                      worker.postMessage({
                        records,
                        sizeGrouped: grouped,
                        hasStock: stock,
                        orderedBy,
                        productsUrl,
                        sizesUrl,
                        companies
                      });
                      
                      worker.onmessage = function (e) {
                        if ('result' in e.data) {
                          var data = e.data.result;
                          
                          FileHandler.get(baseUrl(templateUrl), 'arraybuffer').then(function (buffer) {
                            var tmpl = new CalcTemplate(buffer);
                            var total_stock = data.reduce(function (accum, current) {
                              return accum + parseInt(current.current_stock, 10);
                            }, 0);

                            tmpl.data('B3', Auth.value('userBranchName'));
                            
                            tmpl.data('A6:K6', data.map(function (item, index) {
                              return [
                                index + 1,
                                item.code,
                                item.product,
                                item.brand,
                                item.regime,
                                item.company,
                                item.current_stock,
                                item.invoice_currency === 'S' ? 'PEN' : 'USD',
                                parseFloat(item.invoice_cost),
                                item.cost_currency === 'S' ? 'PEN' : 'USD',
                                parseFloat(item.cost)
                              ];
                            }))
                            .data(`G${6 + data.length}`, total_stock || 0)
                            .data('K3', period);
                            
                            tmpl.on('progress', templateProgress.bind(modal));
                            
                            tmpl.on('error', error => {
                              console.error(error);
                            });
                            
                            setTimeout(function () {
                              $('[data-progress]', modal).find('.loading-progress').hide()
                                .end().find('.write-progress').show()
                              ;

                              timestamp = new Date();

                              timeStart = new Date();
                              progressStart = 0;
                              remainingShown = false;

                              tmpl.blob().then(function (blob) {
                                var filename = `existencias_inventario_${Auth.value('userBranchName').toLowerCase()}_${month == 0 ? year : monthText.substr(0, 3).toLowerCase() + '-' + year}.xlsx`;
                                
                                FileHandler.download(blob, filename);
                                
                                $('input[name="origin"], .year-input, .month-input, .modal-footer > button', modal).attr('disabled', false);
                                $('[data-progress]', modal).hide().end().find('.progress-bar').width(0);
                              });
                            }, 500);
                          });
                        }
                      };
                    });
                  } else {
                    Promise.all([
                      FileHandler.get(baseUrl(templateUrl), 'arraybuffer'),
                      Requester.getArray([siteUrl(`products/get_stocks?${params.join('&')}`)])
                    ]).then(function (result) {
                      var [buffer, data] = result;

                      //console.log('progressBar', $('[data-progress] .progress-bar', modal).get(0));
                      //$('[data-progress] .progress-bar', modal).removeClass('progress-bar').width(0); //.delay(5000).addClass('progress-bar');
                      
                      var tmpl = new CalcTemplate(buffer);
                      var total_stock = data.reduce(function (accum, current) {
                        return accum + parseInt(current.current_stock, 10);
                      }, 0);

                      tmpl.data('B3', Auth.value('userBranchName'));
        
                      if (grouped) {
                        tmpl.data('A6:K6', data.map(function (item, index) {
                          return [
                            index + 1,
                            item.code,
                            item.product,
                            item.brand,
                            item.regime === 'ZOFRA' ? 'Zofra' : 'General',
                            item.company,
                            parseInt(item.current_stock, 10),
                            item.invoice_currency === 'S' ? 'PEN' : 'USD',
                            parseFloat(item.invoice_cost),
                            item.cost_currency === 'S' ? 'PEN' : 'USD',
                            parseFloat(item.cost)
                          ];
                        }))
                        .data(`G${6 + data.length}`, total_stock || 0)
                        .data('J3', 'FECHA')
                        .data('K3', moment().format('DD/MM/YY'));
        
                      } else {
                        tmpl.data('A6:L6', data.map(function (item, index) {
                          return [
                            index + 1,
                            item.code,
                            item.product,
                            item.product_size,
                            item.brand,
                            item.regime === 'ZOFRA' ? 'Zofra' : 'General',
                            item.company,
                            parseInt(item.current_stock, 10),
                            item.invoice_currency === 'S' ? 'PEN' : 'USD',
                            parseFloat(item.invoice_cost),
                            item.cost_currency === 'S' ? 'PEN' : 'USD',
                            parseFloat(item.cost)
                          ];
                        }))
                        .data(`H${6 + data.length}`, total_stock || 0)
                        .data('K3', 'FECHA')
                        .data('L3', moment().format('DD/MM/YY'));
                      }
                      
                      tmpl.on('progress', templateProgress.bind(modal));
                      
                      tmpl.on('error', error => {
                        console.error(error);
                      });

                      setTimeout(function () {
                        $('[data-progress]', modal).find('.loading-progress').hide()
                          .end().find('.write-progress').show()
                        ;

                        timestamp = new Date();
                        
                        timeStart = new Date();
                        progressStart = 0;
                        remainingShown = false;

                        tmpl.blob().then(function (blob) {
                          var filename = `existencias_${Auth.value('userBranchName').toLowerCase()}_${moment().format('YYYY-MM-DD')}.xlsx`;
                          
                          FileHandler.download(blob, filename);
                          
                          $('input[name="origin"], .year-input, .month-input, .modal-footer > button', modal).attr('disabled', false);
                          $('[data-progress]', modal).hide().end().find('.progress-bar').width(0);;
                        });
                      }, 500);
                    });
                  }
                } else {
                  $('.year-input', modal).focus().select();
                }
                
                
                return false;
              }
            },
            cancel: {
              label: 'Cerrar',
              className: 'btn-default'
            }
          }
        });
        
        dialog.on('show.bs.modal', function () {
          dialog.find('.month-input').val('0');
          dialog.find('.year-input').val(new Date() .getFullYear());

          dialog.find('[name="origin"]').change(function (e) {
            if (e.target.checked && e.target.value === 'inventory') {
              !grouped && dialog.find('#grouped-message').show();
              dialog.find('.date-container').show();
              dialog.find('.year-input').attr('required', true);
            } else {
              !grouped && dialog.find('#grouped-message').hide();
              dialog.find('.date-container').hide();
              dialog.find('.year-input').attr('required', false);
            }
          });
        }).modal('show');
      };

      function getTime(seconds) {
        var result = '';

        if (seconds >= 60) {
          result = `${Math.floor(seconds / 60)} min. `;
        }

        if (seconds === 0 || seconds % 60 > 0) {
          result += `${seconds % 60} seg.`;
        }

        return result;
      }

      function templateProgress(progress) {
        var percent = Math.round(progress * 100);
        //console.log('progreso', percent);

        $('[data-progress] > .write-progress', this).find('.progress-bar').width(`${percent}%`)
          .end().find('.percent').text(percent)
        ;

        if (new Date() - timestamp > 1000 && progress > 0) { // Pasó más de 1 segundo
          var remaining = Math.round((1 - progress) * (new Date() - timeStart)  / (1000 * (progress - progressStart))); // Tiempo restante en segundos

          if (!remainingShown && remaining >= 5) {
            $('[data-progress] > .write-progress .remaining', this).show()
              .find('.remaining-time').text(`${getTime(remaining)}`)
            ;

            remainingShown = true;
          } else if (remainingShown) {
            $('[data-progress] > .write-progress .remaining > .remaining-time', this).text(`${getTime(remaining)}`)
            ;
          }
          
          timestamp = new Date();
          //progressStart = progress;
        }
        //$('[data-progress] .progress-bar', modal).width(`${progress * 100}%`);
      }
    }
]);
