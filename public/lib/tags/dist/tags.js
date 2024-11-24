riot.tag2('riot-active-switch', '<label class="switch m-b-none"> <input type="checkbox" checked="{opts.value == \'t\'}" name="checkbox" onchange="{activate}"> <span></span> </label>', 'riot-active-switch input[type="checkbox"]:disabled + span,[data-is="riot-active-switch"] input[type="checkbox"]:disabled + span{ opacity: .5; }', '', function(opts) {
        var self = this
        var url = window.siteUrl('app/riot_active_switch')

        this.activate = function(e) {

            e.target.disabled = 'disabled'

            self.request && self.request.abort()

            self.request = new XMLHttpRequest()
            self.request.open('get', url + '/' + self.opts.target + '/' + self.opts.reference + '/' + (e.target.checked ? 't' : 'f'))
            self.request.responseType = 'json'
            self.request.onload = function () {
                var data = self.request.response

                if (!data || !data.ok) {
                    e.target.checked = !e.target.checked
                }

                e.target.removeAttribute('disabled')
            }
            self.request.onerror = function () {
                e.target.checked = !e.target.checked
                e.target.removeAttribute('disabled')
            }
            self.request.send()
        }.bind(this)
});

riot.tag2('riot-bottom-panel', '<footer class="footer bg-white b-t b-light no-padder"> <div class="row"> <div each="{panels}" class="col-lg-{parent.size} f16"> <i if="{icon}" class="{icon} v-middle"></i> {text} </div> </div> </footer>', 'riot-bottom-panel,[data-is="riot-bottom-panel"]{ position: absolute; left: 0; bottom: 0; right: 0; } riot-bottom-panel footer,[data-is="riot-bottom-panel"] footer{ font-size: 8px; min-height: auto !important; } riot-bottom-panel .row,[data-is="riot-bottom-panel"] .row{ display: inline; } riot-bottom-panel .row > div,[data-is="riot-bottom-panel"] .row > div{ font-size: 13px; }', '', function(opts) {
		var self = this

		self.panels = self.opts.panels
		self.size = parseInt(12 / self.opts.panels.length, 10)
});

riot.tag2('riot-dropdown', '<div class="dropdown"> <a href="#" data-toggle="dropdown" role="button"> {opts.label} <span class="caret"></span> </a> <ul class="dropdown-menu dropdown-menu-right"> <li each="{opts.items}" class="{divider: type === \'separator\'}"> <a if="{type !== \'separator\'}" href="#" onclick="{parent.action}"> <i class="fa fa-fw text-left {fa-check: checked}"></i> {text} </a> </li> </ul> </div>', '', '', function(opts) {
		this.action = function(e) {
			if (e.item.action) {
				e.item.action.call(e.target, e.item)
			}
		}.bind(this)
});

riot.tag2('riot-pack-modal', '<div class="modal fade" tabindex="-1" role="dialog"> <div class="modal-dialog modal-xlg"> <div class="modal-content"> <div class="modal-body"> <form class="form-horizontal" onsubmit="{done}" id="pack-form"> <div class="form-group required"> <label class="col-md-2 control-label">Descripción</label> <div class="col-md-8"> <input type="text" class="form-control" data-prop="description" oninput="{setProp}" required disabled="{opts.readonly === \'true\'}"> </div> <label class="col-md-1 control-label no-required">Activo</label> <div class="col-md-1 m-b"> <label class="switch m-b-none"> <input type="checkbox" data-prop="active" onchange="{setProp}" disabled="{opts.readonly === \'true\'}"> <span></span> </label> </div> </div> <div class="form-group m-b-none required"> <label class="col-md-2 control-label">Empresa</label> <div class="col-md-2 m-b"> <select required class="form-control" data-prop="company_id" onchange="{setProp}" disabled="{opts.readonly === \'true\' || lists.length > 0}"> <option value="" selected="{!company_id}">- Seleccione -</option> <option each="{text, id in opts.companies}" riot-value="{id}" checked="{parent.company_id === id}"> {text} </option> </select> </div> <label class="col-md-2 control-label">Régimen</label> <div class="col-md-2 m-b"> <select required class="form-control" data-prop="regime" onchange="{setProp}" disabled="{opts.readonly === \'true\' || lists.length > 0}"> <option value="" selected="{!regime}">- Seleccione -</option> <option each="{text, id in opts.regimes}" riot-value="{id}" selected="{parent.regime === id}"> {text} </option> </select> </div> <label class="col-md-2 control-label no-required" if="{lists.length > 0}">Precio</label> <div class="col-md-2 m-b" if="{lists.length > 0}"> <div class="input-group"> <span class="input-group-addon">S/</span> <input class="form-control text-right" readonly tabindex="-1" ref="price" value="0.00"> </div> </div> </div> </form> <div if="{company_id && regime}"> <h4>Listas de productos <small>({lists.length})</small></h4> <div class="alert alert-{messageType}" role="alert" if="{message.length > 0}"> <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="{closeMessage}"> <span aria-hidden="true">&times;</span> </button> {message} </div> <div class="responsive-table"> <table class="table table-bordered"> <thead> <tr> <th width="100px">Cant.</th> <th>Productos</th> <th if="{opts.readonly === \'false\'}" width="50px">&nbsp;</th> <th width="50px">&nbsp;</th> <th width="130px">P. Unitario</th> <th width="130px">Precio</th> <th width="50px">&nbsp;</th> </tr> </thead> <tbody> <tr if="{lists.length === 0}"> <td class="text-center" colspan="7">No se encontraron registros</td> </tr> <tr if="{lists.length > 0}" each="{list, i in lists}" data-list> <td class="v-middle"> <input required data-prop="quantity" class="form-control text-center" min="1" form="pack-form" oninput="{setListProp}" readonly="{parent.opts.readonly === \'true\'}" type="number"> </td> <td class="v-middle"> <select required multiple data-prop="products" form="pack-form" class="form-control" style="width:100%" if="{parent.opts.readonly === \'false\'}"></select> <div data-prop="products" if="{parent.opts.readonly === \'true\'}"></div> </td> <td class="v-middle text-center" if="{parent.opts.readonly === \'false\'}"> <button type="button" class="btn btn-primary" title="Cargar desde archivo" data-upload onclick="{parent.triggerUpload}" tabindex="-1"> <input type="file" accept="text/csv" onchange="{parent.uploadProducts}" tabindex="-1"> <i class="fa fa-upload"></i> </button> </td> <td class="v-middle text-center"> <button type="button" class="btn btn-default" title="Descargar" onclick="{parent.downloadProducts}" tabindex="-1"> <i class="fa fa-download"></i> </button> </td> <td class="v-middle"> <div class="input-group"> <span class="input-group-addon">S/</span> <input readonly type="text" data-prop="price" class="form-control text-right" pattern="\\d+(\\.\\d+)?" form="pack-form" value="0.00" tabindex="-1"> </div> </td> <td class="v-middle"> <div class="input-group"> <span class="input-group-addon">S/</span> <input required type="text" data-prop="subtotal" class="form-control text-right" pattern="\\d+(\\.\\d+)?" form="pack-form" oninput="{setListProp}" readonly="{parent.opts.readonly === \'true\'}"> </div> </td> <td class="text-center v-middle" if="{parent.opts.readonly === \'false\'}"> <a href="#" onclick="{removeList}" title="Eliminar"> <i class="fa fa-remove text-danger"></i> </button> </td> </tr> </tbody> </table> <div class="text-right" if="{opts.readonly === \'false\' && lists.length < 3}"> <a href="#" onclick="{addEmptyList}"> <i class="fa fa-plus"></i> Agregar lista </a> </div> </div> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">{opts.readonly === \'true\' ? \'Cerrar\' : \'Cancelar\'}</button> <button type="submit" class="btn btn-primary" form="pack-form" disabled="{lists.length === 0}" if="{opts.readonly === \'false\'}">Aceptar</button> </div> </div> </div> </div>', 'riot-pack-modal button[data-upload],[data-is="riot-pack-modal"] button[data-upload]{ position: relative; overflow: hidden; } riot-pack-modal input[type="file"],[data-is="riot-pack-modal"] input[type="file"]{ position: absolute; top: 0; left: 0; opacity: 0; }', '', function(opts) {
    const RECORDS_PER_REQUEST = 10;

    var $ = window.jQuery;
    var siteUrl = window.siteUrl;
    var setTimeout = window.setTimeout;
    var siteUrl = window.siteUrl;
    var checkPrecision = window.checkPrecision;
    var self = this;

    var productOpts = {
      placeholder: '- Busque por código o descripción -',
      ajax: {
        url: siteUrl('product_details/search'),
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {
            term: params.term,
            company_id: self.company_id,
            regime: self.regime,
            page: params.page,
            display: RECORDS_PER_REQUEST
          };
        },
        processResults: function (data, params) {
          params.page = params.page || 1;

          return {
            results: data.items,
            pagination: {
              more: (params.page * RECORDS_PER_REQUEST) < data.total_count
            }
          };
        },
        cache: true
      },
      escapeMarkup: function (markup) {
        return markup;
      },
      minimumInputLength: 3,
      templateResult: function (product) {
        if (!product.id) {
          return product.text;
        } else {
          return `
            <div class="row">
              <div class="col-lg-12">
                ${ product.description }
              </div>
              <div class="col-md-6">
                Cód. ${ product.text }
              </div>
            </div>
          `;
        }
      },
      templateSelection: function (product) {
        return product.text;
      }
    };

    self.lists = [];

    this.addEmptyList = function(e) {
      var item = {
        id: -new Date().getTime(),
        codes: [],
        quantity: '',
        products: [],
        price: '0.00',
        subtotal: ''
      };

      self.lists.push(item);

      setTimeout(function () {
        var tr = self.root.querySelector('tbody > tr:last-child');

        tr.querySelector('[data-prop="quantity"]').focus();

        $(tr.querySelector('[data-prop="products"]'))
          .select2(productOpts)
          .on('select2:selecting', self.selectingProduct.bind(null, item))
          .on('select2:select', self.selectProduct.bind(null, item))
          .on('select2:unselect', self.unselectProduct.bind(null, item));
      });
    }.bind(this)

    this.closeMessage = function(e) {
      self.message = '';
      self.messageType = 'danger';
    }.bind(this)

    this.done = function(e) {
      var duplicated = false;

      if (self.lists.length > 1) {
        loop:
        for (var list of self.lists) {
          for (var product of list.products) {
            duplicated = self.isDuplicated(list, product);

            if (duplicated) {
              break loop;
            }
          }
        }
      }

      if (duplicated) {
        self.message = 'Algunos productos se repiten en más de una lista';
        self.messageType = 'danger';
      } else {

        var data = {
          id: self.id,
          description: self.description,
          active: self.active,
          company_id: self.company_id,
          regime: self.regime,
          price: self.refs.price.value,
          lists: JSON.parse(JSON.stringify(self.lists))
        };

        self.trigger('done', data);

        $(self.root).find('.modal').modal('hide');
      }

      e.preventDefault();
    }.bind(this)

    this.downloadProducts = function(e) {
      if (self.opts.FileHandler) {
        var products = $(e.target).closest('tr').find('[data-prop="products"]');
        var output = null;

        if (self.opts.readonly === 'true') {
          output = products.text().split(', ').join("\n");
        } else {
          output = products.select2('data').map(function (item) {
            return item.text.trim();
          }).join("\n");
        }

        output += "\n";

        self.opts.FileHandler.download(output, 'productos.csv');
      }
    }.bind(this)

    this.triggerUpload = function(e) {
      if (e.target.tagName !== 'INPUT') {
        $('input', e.target).trigger('click');

        e.preventDefault();
      }
    }.bind(this)

    this.uploadProducts = function(e) {
      if (self.opts.Ajax && e.target.files.length > 0) {
        var reader = new FileReader();
        reader.onload = function () {
          var codes = reader.result.indexOf(',') > -1 ? reader.result.split(',') : reader.result.split("\n");

          codes = codes.map(function (code) {
            return code.trim();
          }).filter(function (code) {
            return code.length > 0 && code.indexOf('"') < 0 && code.indexOf(',') < 0;
          });

          if (codes.length > 0) {

            self.opts.Ajax.post(siteUrl('product_details/get_by_codes'), {
              codes,
              regime: self.regime,
              company_id: self.company_id
            }).then(function (res) {
              if (res.data.length > 0) {
                var products = res.data.filter(function (product) {
                  var found = self.lists.reduce(function (accum, current) {
                    if (!accum) {
                      return current.products.indexOf(product.id) > -1;
                    } else {
                      return true;
                    }
                  }, false);

                  return !found;
                });

                if (products.length > 0) {
                  var list = e.item.list;

                  $(e.target).closest('tr').find('[data-prop="products"]')
                    .append(products.reduce(function (accum, current) {
                      list.products.push(current.id);
                      list.codes.push(current.code);

                      return accum + `<option value="${ current.id }" selected>${ current.code }</option>`;
                    }, ''))
                    .trigger('change')
                  ;

                  var msg = products.length === 1 ? 'cargó 1 producto' : `cargaron ${ products.length } productos`;

                  if (res.data.length === products.length) {
                    self.update({
                      message: `Se ${msg}`,
                      messageType: 'success'
                    });
                  } else {
                    self.update({
                      message: `Se descartaron productos repetidos, solo se ${msg}`,
                      messageType: 'success'
                    });
                  }
                } else {
                  self.update({
                    message: `Los productos que se intentan cargar ya se encuentran en alguna lista`,
                    messageType: 'danger'
                  });
                }
              } else {
                self.update({
                  message: `No se encontraron productos en el régimen y empresa especificados`,
                  messageType: 'danger'
                });
              }
            });
          }
        };

        reader.readAsText(e.target.files[0]);
      }
    }.bind(this)

    this.isDuplicated = function(item, product) {
      return self.lists.filter(function (list) {
        return list !== item;
      }).find(function (list) {
        return list.products.indexOf(product) > -1;
      });
    }.bind(this)

    this.removeList = function(e) {
      self.lists.splice(self.lists.indexOf(e.item.list), 1);
      self.updatePrice();
    }.bind(this)

    this.selectingProduct = function(item, e) {
      if (self.lists.length > 1) {
        if (self.isDuplicated(item, e.params.args.data.id)) {
          $(e.target).select2('close');

          self.update({
            message: `El producto con código ${ e.params.args.data.text } se encuentra en otra lista`,
            messageType: 'danger'
          });

          e.preventDefault();
        }
      }
    }.bind(this)

    this.selectProduct = function(item, e) {
      item.products.push(e.params.data.id);
      item.codes.push(e.params.data.text);

    }.bind(this)

    this.setDefaultValues = function() {
      self.update({
        message: '',
        messageType: 'danger',
        id: self.opts.id || -new Date().getTime(),
        description: self.opts.description || '',
        active: typeof self.opts.active === 'boolean' ? self.opts.active : true,
        company_id: self.opts.company_id || '',
        regime: self.opts.regime || '',
        lists: self.opts.lists || []
      });

      self.setInitialValues();
    }.bind(this)

    this.setInitialValues = function() {
      self.root.querySelector('[data-prop="description"]').value = self.description;
      self.root.querySelector('[data-prop="active"]').checked = self.active;
      self.root.querySelector('[data-prop="company_id"]').value = self.company_id;
      self.root.querySelector('[data-prop="regime"]').value = self.regime;

      var listRows = self.root.querySelectorAll('[data-list]');

      if (self.lists.length > 0 && self.lists.length === listRows.length) {
        self.lists.forEach(function (list, index) {
          listRows[index].querySelector('[data-prop="quantity"]').value = list.quantity;
          listRows[index].querySelector('[data-prop="price"]').value = list.price;
          listRows[index].querySelector('[data-prop="subtotal"]').value = parseFloat(list.subtotal).toFixed(2);

          if (self.opts.readonly === 'true') {
            $(listRows[index].querySelector('[data-prop="products"]'))
              .text(list.codes.join(', '));
          } else {
            $(listRows[index].querySelector('[data-prop="products"]'))
              .append(list.products.reduce(function (accum, current, index) {
                return accum + `<option value="${ current }" selected>${ list.codes[index] }</option>`;
              }, ''))
              .select2(productOpts)
              .on('select2:selecting', self.selectingProduct.bind(null, list))
              .on('select2:select', self.selectProduct.bind(null, list))
              .on('select2:unselect', self.unselectProduct.bind(null, list));
          }
        });
      }
    }.bind(this)

    this.setListProp = function(e) {
      var prop = e.target.dataset.prop;

      if (e.target.checkValidity()) {
        e.item.list[prop] = e.target.value;
      }

      if (prop === 'quantity' || prop === 'subtotal') {
        var tr = e.target.closest('tr');

        if (tr.querySelector('[data-prop="quantity"]').checkValidity() && tr.querySelector('[data-prop="subtotal"]').checkValidity()) {
          tr.querySelector('[data-prop="price"]').value = (parseFloat(e.item.list.subtotal) / parseInt(e.item.list.quantity, 10)).toFixed(2);
        } else {
          tr.querySelector('[data-prop="price"]').value = '0.00';
        }

        e.item.list.price = tr.querySelector('[data-prop="price"]').value;

        self.updatePrice();
      }
    }.bind(this)

    this.setProp = function(e) {
      var prop = e.target.dataset.prop;

      if (e.target.checkValidity()) {
        if (e.target.type === 'checkbox') {
          self[prop] = e.target.checked;
        } else {
          self[prop] = e.target.value;
        }
      }

      if (prop === 'company_id' || prop === 'regime') {
        self.update();
      }
    }.bind(this)

    this.unselectProduct = function(item, e) {
      item.products.splice(item.products.indexOf(e.params.data.id), 1);
      item.codes.splice(item.codes.indexOf(e.params.data.text), 1);

    }.bind(this)

    this.updatePrice = function() {
      self.refs.price.value = self.lists.reduce(function (accum, current) {
        return checkPrecision(accum + (parseFloat(current.subtotal) || 0));
      }, 0).toFixed(2);
    }.bind(this)

    self.on('mount', function () {
      self.setDefaultValues();

      $(self.root).find('.modal')
        .on('shown.bs.modal', function () {
          if (self.opts.readonly === 'false') {
            $(this).find('input:first').focus();
          }
        })
        .on('hidden.bs.modal', function () {
          self.lists.length = 0;
          self.setDefaultValues();
        });
    });

    self.on('show', function (data) {
      if (data !== undefined) {
        if ('price' in data) {
          $(self.root).find('.modal').one('shown.bs.modal', (function (price) {
            return function () {
              self.refs.price.value = price;
            };
          })(data.price));

          delete data.price;
        }

        self.update(data);

        self.setInitialValues();
      }

      $(self.root).find('.modal').modal({
        show: true,
        keyboard: self.opts.readonly === 'true'
      });
    });

    self.on('update', function () {

    });
});

riot.tag2('riot-rdata-paginator', '<ul class="pagination m-t-none m-b-none"> <li class="page-item" title="Primera página"> <a class="page-link" href="#" onclick="{parent.first}">«</a> </li> <li class="page-item" title="Página anterior"> <a class="page-link" href="#" onclick="{parent.prev}">←</a> </li> <virtual each="{page in parent.pages}"> <li if="{!isNaN(page)}" class="page-item {parent.parent.isCurrent(page) ? \'active\' : \'\'}"> <a class="page-link" href="#" onclick="{parent.parent.go}">{page}</a> </li> <li if="{isNaN(page)}" class="page-item disabled"> <a class="page-link" tabindex="-1">...</a> </li> </virtual> <li class="page-item" title="Página siguiente"> <a class="page-link" href="#" onclick="{parent.next}">→</a> </li> <li class="page-item" title="Última página"> <a class="page-link" href="#" onclick="{parent.last}">»</a> </li> </ul>', '', '', function(opts) {
});

riot.tag2('riot-sale-modal', '<yield></yield>', '', '', function(opts) {
    var bootbox = window.bootbox,
      baseUrl = window.baseUrl,
      siteUrl = window.siteUrl,
      moment = window.moment,
      $ = window.jQuery,
      checkPrecision = window.checkPrecision,
      self = this;

    self.on('mount', function () {
      self.root.addEventListener('click', function (e) {
        e.preventDefault();

        var dialog = bootbox.dialog({
          title: self.opts.dataTitle || 'Detalle de documento',
          message: '<div data-content></div>',
          size: 'large',
          onEscape: true,
          backdrop: true,
          show: false
        });

        self.preload.call(dialog);

        dialog.one('shown.bs.modal', function () {
          self.load.call(dialog, self.opts.dataId);
        }).modal('show');
      }, false);
    });

    self.preload = function () {
      var dialog = this;

      dialog.find('[data-content]').html(`
        <div class="text-center">
          <img src="${ baseUrl('public/images/ajax-loader-bg.gif') }">
        </div>
      `);
    };

    self.load = function (saleId) {
      var dialog = this;

      $.getJSON(siteUrl('sales/get_detail/' + saleId), function (data) {
        console.log('detalle', data);
        var vouchers = { 'TICKET': 'Ticket', 'BOLETA': 'Boleta', 'FACTURA': 'Factura', 'NOTA DE CREDITO': 'Nota de crédito', 'TICKET NOTA DE CREDITO': 'Nota de crédito' };
        var shortVouchers = { 'TICKET': 'TCK', 'BOLETA': 'BOL', 'FACTURA': 'FAC', 'NOTA DE CREDITO': 'NC', 'TICKET NOTA DE CREDITO': 'TCK. NC' };
        var isRefund = data.voucher.indexOf('NOTA DE CREDITO') > -1;
        var isRefunded = !isRefund && data.refund_details.length > 0;
        var numberFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

        data.total_cash_amount = parseFloat(data.total_cash_amount);

        console.log('voucher', data.voucher, vouchers[data.voucher]);
        var content = `
          <div class="row">
            <div class="col-lg-12 text-center">
              <h4 class="m-t-none m-b">${ vouchers[data.voucher] + ' Nº ' + data.serie.zeros(3) + '-' + data.serial_number.zeros(7) }</h4>
            </div>
          </div>
          <div class="row">
            <div class="col-md-2 col-xs-3 text-right">
              <strong>Empresa</strong>
            </div>
            <div class="col-md-4 col-xs-9 text-overflow">
              ${ data.company }
            </div>

            <div class="col-md-2 col-xs-3 text-right">
              <strong>Sucursal</strong>
            </div>
            <div class="col-md-4 col-xs-9 text-overflow">
              ${ data.branch }
            </div>
          </div>
          <div class="row">
            <div class="col-md-2 col-xs-3 text-right">
              <strong>Cliente</strong>
            </div>
            <div class="col-md-4 col-xs-9 text-overflow">
              ${ data.customer || '(PÚBLICO)' }
            </div>

            <div class="col-md-2 col-xs-3 text-right">
              <strong>Fecha</strong>
            </div>
            <div class="col-md-4 col-xs-9 text-overflow">${ moment(data.sale_date).format(data.voucher.indexOf('TICKET') > -1 ? 'DD/MM/YYYY hh:mmA' : 'DD/MM/YYYY') }</div>
          </div>
          <div class="row">
            <div class="col-md-2 col-xs-3 text-right">
              <strong>Cajero</strong>
            </div>
            <div class="col-md-4 col-xs-9 text-overflow">
              ${ data.cashier || '—' }
            </div>

            <div class="col-md-2 col-xs-3 text-right">
              <strong>Caja</strong>
            </div>
            <div class="col-md-4 col-xs-9 text-overflow">
              ${ data.sale_point || '—' }
            </div>
          </div>
          <div class="row">
            <div class="col-md-2 col-xs-3 text-right">
              <strong>Régimen</strong>
            </div>
            <div class="col-md-4 col-xs-9 text-overflow">
              ${ data.regime === 'ZOFRA' ? 'Zofra' : 'General' }
            </div>

            <div class="col-md-2 col-xs-3 text-right">
              <strong>${ !isRefund ? 'Vendedor' : 'Referencia' }</strong>
            </div>
            <div class="col-md-4 col-xs-9 text-overflow">
              ${ !isRefund ? (data.saleman || '—') : (!data.refunded_id || !data.refunded_voucher || !data.refunded_serie || !data.refunded_serial_number ? '—' : '<a href="#" class="underlined-link text-primary" data-sale-id="' + data.refunded_id + '">' + shortVouchers[data.refunded_voucher] + '. Nº ' + data.refunded_serie.zeros(3) + '-' + data.refunded_serial_number.zeros(7) + '</a>') }
            </div>
          </div>
        `;

        if (isRefund) {
          content += `
            <div class="row">
              <div class="col-md-2 col-xs-3 text-right">
                <strong>Motivo</strong>
              </div>
              <div class="col-md-4 col-xs-9 text-overflow">
                ${ data.refunded_other_reason || data.refunded_reason || '—' }
              </div>

              <div class="col-md-2 col-xs-3 text-right">
                <strong>En pago de</strong>
              </div>
              <div class="col-md-4 col-xs-9">
                —
              </div>
            </div>
          `;
        }

        if (data.sale_details.length > 0) {
          var detailContent = '', paymentContent = '', detailColspan = (isRefunded ? '6' : '5');

          data.sale_details.forEach(function (detail) {
            detailContent += `
              <tr class="${ isRefunded ? self.getRefundClasses(detail, data.refund_details) : '' }">
                <td class="text-center v-middle">${ detail.quantity }</td>
                ${ isRefunded ? `<td class="text-center v-middle text-danger">${ self.getRefundQty(detail, data.refund_details) }</td>` : '' }
                <td class="v-middle">${ detail.code }</td>
                <td class="v-middle">
                  ${ detail.regime === 'ZOFRA' ? '<p class="m-t-none m-b-none">D.S. ' + detail.output_statement + '</p>' : '' }
                  <p class="m-t-none m-b-none">${ detail.product }</p>
                </td>
                <td class="v-middle">${ detail.size }</td>
                <td class="text-right v-middle">${ Number(detail.price).toLocaleString('es-PE', numberFormat) }</td>
                <td class="text-right v-middle">${ Number(detail.subtotal).toLocaleString('es-PE', numberFormat) }</td>
              </tr>
            `;
          });

          if (!isRefund) {
            var debt = Number(data.total_amount);

            paymentContent = '<tbody>';

            if ('card_payments' in data && data.card_payments.length > 0) {
              data.card_payments.forEach(function (cardPayment) {
                paymentContent += `
                  <tr>
                    <td colspan="${ detailColspan }" class="text-right">Pago con tarjeta ${ cardPayment.abbrev } ***${ cardPayment.verification_code }</td>
                    <td class="text-right">${ Number(cardPayment.amount).toLocaleString('es-PE', numberFormat) }</td>
                  </tr>
                `;

                debt = checkPrecision(debt - Number(cardPayment.amount));
              });
            }

            if (debt > 0) {
              paymentContent += `
                <tr>
                  <td colspan="${ detailColspan }" class="text-right">Pago con efectivo</td>
                  <td class="text-right">${ data.total_cash_amount.toLocaleString('es-PE', numberFormat) }</td>
                </tr>
              `;

              if (data.total_cash_amount > debt) {
                paymentContent += `
                  <tr>
                    <td colspan="${ detailColspan }" class="text-right">Cambio</td>
                    <td class="text-right">${ Number(data.total_cash_amount - debt).toLocaleString('es-PE', numberFormat) }</td>
                  </tr>
                `;
              }
            }

            paymentContent += '</body>';
          }

          content += `
            <h5 class="m-t m-b-xs">Detalle de ${ isRefund ? 'devolución' : 'venta' }</h5>
            <div class="row">
              <div class="col-lg-12">
                <div class="fixed-table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th class="text-center" style="width:80px">Cant.</th>
                        ${ isRefunded ? '<th class="text-center" style="width:80px">Dev.</th>' : '' }
                        <th class="text-center" style="width:150px">Código</th>
                        <th class="text-center">Producto</th>
                        <th class="text-center" style="width:110px">Talla</th>
                        <th class="text-center" style="width:100px">P.U.</th>
                        <th class="text-center" style="width:100px">Importe</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${ detailContent }
                    </tbody>
                    <tbody>
                      ${ data.regime === 'General' ? `
                      <tr>
                        <td colspan="${ detailColspan }" class="text-right">Subtotal</td>
                        <td class="text-right">${ Number(data.total_amount - data.igv).toLocaleString('es-PE', numberFormat) }</td>
                      </tr>
                      <tr>
                        <td colspan="${ detailColspan }" class="text-right">I.G.V. (18%)</td>
                        <td class="text-right">${ Number(data.igv).toLocaleString('es-PE', numberFormat) }</td>
                      </tr>
                      ` : '' }
                      <tr>
                        <th colspan="${ detailColspan }" class="text-right">TOTAL</th>
                        <th class="text-right">${ Number(data.total_amount).toLocaleString('es-PE', numberFormat) }</th>
                      </tr>
                    </tbody>
                    ${ paymentContent }
                  </table>
                </div>
              </div>
            </div>
          `;
        }

        if (!isRefund && isRefunded) {
          content += `
            <div class="row">
              <div class="col-md-2 col-xs-3 text-right">
                <strong>Devolución/es</strong>
              </div>
              <div class="col-md-10 col-xs-9">
                ${ self.getRefunds(data.refund_details) }
              </div>
            </div>
          `;
        }

        dialog.find('[data-content]').html(content);

        dialog.find('.refund-link').hover(function (e) {
          dialog.find('tr.refund-' + e.target.dataset.saleId).addClass('danger');
        }).mouseleave(function (e) {
          dialog.find('tr.refund-' + e.target.dataset.saleId).removeClass('danger');
        });

        dialog.find('a[data-sale-id]').click(function (e) {
          e.preventDefault();

          self.preload.call(dialog);
          self.load.call(dialog, e.target.dataset.saleId);
        });
      });
    }

    self.getRefundClasses = function (detail, refundDetails) {
      var filtered = refundDetails.filter(function (refundDetail) {
        return refundDetail.product_barcode_id === detail.product_barcode_id && refundDetail.price === detail.price;
      }).map(function (refundDetail) {
        return refundDetail.id;
      });

      if (filtered.length > 0) {
        return 'refund-' + filtered.join(' refund-');
      } else {
        return '';
      }
    };

    self.getRefundQty = function (detail, refundDetails) {
      return refundDetails.filter(function (refundDetail) {
        return refundDetail.product_barcode_id === detail.product_barcode_id && refundDetail.price === detail.price;
      }).reduce(function (accum, refundDetail) {
        return accum + parseInt(refundDetail.quantity, 10);
      }, 0);
    };

    self.getRefunds = function (refundDetails) {
      return refundDetails.filter(function (refundDetail, pos, refundDetails) {
        return refundDetails.indexOf(refundDetail) === pos;
      }).reduce(function (accum, refundDetail) {
        return accum + `<a href="#" class="underlined-link text-danger refund-link" data-sale-id="${ refundDetail.id }">${ (refundDetail.voucher.indexOf('TICKET') > -1 ? 'TCK. N.C.' : 'N.C.') + ' ' + refundDetail.serie.zeros(3) + '-' + refundDetail.serial_number.zeros(7) }</a>`;
      }, '');
    };
});

riot.tag2('riot-ticket', '<div class="row"> <div class="col-xs-12 text-center m-b-sm text-ellipsis"> <div class="i-2x">{company.company_name}</div> </div> <div class="col-xs-12 text-center m-b text-ellipsis"> R.U.C. {company.company_ruc} </div> </div> <div class="row"> <div class="col-xs-4 text-ellipsis"> Cliente </div> <div class="col-xs-8 text-ellipsis"> {customer.full_name || \'(Público general)\'} </div> </div> <div class="row" if="{customer.id}"> <div class="col-xs-4 text-ellipsis"> {customer.type === \'PERSONA\' ? (customer.id_number.length === 8 ? \'D.N.I.\' : \'Doc.\') : \'R.U.C.\'} </div> <div class="col-xs-4 text-ellipsis"> {customer.id_number} </div> </div> <div class="separator"></div> <div each="{detail in details}" class="row"> <div class="col-xs-5 text-ellipsis"> {detail.code} </div> <div class="col-xs-7 text-right text-ellipsis"> <span if="{parent.regime === \'ZOFRA\'}">D.S. {detail.output_statement}<br></span> {detail.description} </div> <div class="col-xs-7 text-ellipsis"> {detail.qty} &times; {parent.price(detail).toFixed(2)} </div> <div class="col-xs-5 text-right text-ellipsis"> {parent.amount(detail).toFixed(2)} </div> <div class="col-xs-12"> <div class="separator"></div> </div> </div> <div class="row"> <div class="col-xs-6 text-ellipsis"> {tax ? \'SUBTOTAL\' : \'TOTAL A COBRAR\'} </div> <div class="col-xs-2 text-right"> S/ </div> <div class="col-xs-4 text-right text-ellipsis"> {subtotal().toFixed(2)} </div> </div> <div if="{regime === \'General\'}" class="row"> <div class="col-xs-6 text-ellipsis"> I.G.V. {tax * 100}% </div> <div class="col-xs-2 text-right"> S/ </div> <div class="col-xs-4 text-right text-ellipsis"> {igv().toFixed(2)} </div> </div> <div class="separator" if="{regime === \'General\'}"></div> <div class="row" if="{regime === \'General\'}"> <div class="col-xs-6 text-ellipsis"> TOTAL A COBRAR </div> <div class="col-xs-2 text-right"> S/ </div> <div class="col-xs-4 text-right text-ellipsis"> {total.toFixed(2)} </div> </div> <div class="separator"></div> <div class="row"> <div class="col-xs-6 text-ellipsis"> RECIBIDO </div> <div class="col-xs-2 text-right"> S/ </div> <div class="col-xs-4 text-right text-ellipsis"> {paid.toFixed(2)} </div> </div> <div class="separator" if="{paid > total}"></div> <div class="row"> <div class="col-xs-6 text-ellipsis"> CAMBIO </div> <div class="col-xs-2 text-right"> S/ </div> <div class="col-xs-4 text-right text-ellipsis"> {(paid - total).toFixed(2)} </div> </div> <div if="{regime === \'ZOFRA\'}" class="separator"></div> <div if="{regime === \'ZOFRA\'}" class="text-center"> <p>Venta exonerada del IGV-isc-ipm-ipma</p> <p>Prohibida la venta fuera de la zona de comercialización de Tacna</p> </div>', 'riot-ticket,[data-is="riot-ticket"]{ display: table-cell; font-family: sans-serif; line-height: 12pt; color: #000; font-weight: lighter; } riot-ticket:not(:first-child),[data-is="riot-ticket"]:not(:first-child){ border-left: 1px solid #EAEEF1; padding-left: 10px; } riot-ticket:not(:last-child),[data-is="riot-ticket"]:not(:last-child){ padding-right: 10px; } riot-ticket .i-2x,[data-is="riot-ticket"] .i-2x{ line-height: 1.5em; } riot-ticket div.separator,[data-is="riot-ticket"] div.separator{ border-bottom: 1px dashed #000; margin-bottom: 15px; line-height: 8pt; } riot-ticket div.separator:after,[data-is="riot-ticket"] div.separator:after{ content: \'\\0000a0\'; }', '', function(opts) {
		var self = this

		self.customer = opts.customer
		self.company = opts.company
		self.details = opts.details
		self.tax = opts.tax
		self.total = opts.total
		self.paid = opts.paid
		self.regime = opts.regime

		this.price = function(sale) {
			if ( self.customer.verified ) {
				return sale.offer_price
			} else {
				return sale.price
			}
		}.bind(this)

		this.amount = function(sale) {
			return self.price(sale) * sale.qty
		}.bind(this)

		this.subtotal = function() {
			return self.total * (1 - self.tax / (1 + self.tax))
		}.bind(this)

		this.igv = function() {
			return self.total * self.tax / (1 + self.tax)
		}.bind(this)
});
riot.tag2('filter', '<yield></yield>', '', '', function(opts) {
		var self = this
		var parent = self.parent

		self.term = self.opts.term
		self.query = ''

		self.on('mount', function () {
			self.root.querySelector('select').onchange = function (e) {
				self.query = e.target.value

				if ( parent.remote ) {
					parent.load({ page: 1 })
				} else {
					parent.filtered.length = 0

					if ( !self.query.length ) {
						parent.filtered = parent.original.slice(0)
					} else {
						parent.original.forEach(function (item) {
							if (item[self.term] === self.query) {
								parent.filtered.push(item)
							}
						})
					}
				}

				parent.start = 0

				parent.updateAndPaginator({ page: 1 })
			}
		});
});

riot.tag2('paginator', '<a href="#" class="{opts.button_class}" onclick="{firstPage}" data-first>«</a> <a href="#" class="{opts.button_class}" onclick="{prevPage}">←</a> <span if="{!count}"> <a href="#" class="{className(1)}" onclick="{noop}"> 1 </a> </span> <span if="{count > 0 && count < 8}"> <a each="{n in pages}" href="#" class="{parent.className(n)}" onclick="{parent.setPage}"> {n} </a> </span> <span if="{count > 7}"> <a href="#" class="{className(1)}" onclick="{setPage}">1</a> <span if="{page < 5}"> <a href="#" class="{className(2)}" onclick="{setPage}">2</a> <a href="#" class="{className(3)}" onclick="{setPage}">3</a> <a href="#" class="{className(4)}" onclick="{setPage}">4</a> <a href="#" class="{className(5)}" onclick="{setPage}">5</a> </span> <span if="{page > 4 && page < count - 3}"> <label>...</label> <a href="#" class="{className(page - 1)} after-label" onclick="{setPage}">{page - 1}</a> <a href="#" class="{className(page)}" onclick="{setPage}">{page}</a> <a href="#" class="{className(page + 1)}" onclick="{setPage}">{page + 1}</a> </span> <span if="{page > count - 4}"> <label>...</label> <a href="#" class="{className(count - 4)} after-label" onclick="{setPage}">{count - 4}</a> <a href="#" class="{className(count - 3)}" onclick="{setPage}">{count - 3}</a> <a href="#" class="{className(count - 2)}" onclick="{setPage}">{count - 2}</a> <a href="#" class="{className(count - 1)}" onclick="{setPage}">{count - 1}</a> </span> <span if="{page < count - 3}"> <label>...</label> </span> <a href="#" class="{className(count)} {\'after-label\': page < count - 3}" onclick="{setPage}">{count}</a> </span> <a href="#" class="{opts.button_class}" onclick="{nextPage}">→</a> <a href="#" class="{opts.button_class}" onclick="{lastPage}" data-last>»</a>', 'paginator,[data-is="paginator"]{ display: inline; float: right; } paginator a,[data-is="paginator"] a,paginator label,[data-is="paginator"] label{ display: inline-block; float: left; } paginator label,[data-is="paginator"] label{ padding-left: 8px; padding-right: 8px; } paginator a:not([data-first]):not([data-last]):not(.after-label),[data-is="paginator"] a:not([data-first]):not([data-last]):not(.after-label){ border-left-width: 0 !important; border-radius: 0 !important; } paginator a[data-first],[data-is="paginator"] a[data-first]{ border-top-right-radius: 0 !important; border-bottom-right-radius: 0 !important; } paginator a[data-last],[data-is="paginator"] a[data-last]{ border-left-width: 0 !important; border-top-left-radius: 0 !important; border-bottom-left-radius: 0 !important; } paginator a.after-label,[data-is="paginator"] a.after-label{ border-radius: 0; }', '', function(opts) {
		var self = this
		var parent = self.parent

		self.page = 1
		self.count = (Math.floor(parent.total / parent.limit) + (parent.total % parent.limit > 0 ? 1 : 0))
		self.pages = [];

		for (var i = 0; i < self.count; i++) {
			self.pages.push(i + 1);
		}

		self.on('update',function () {
			self.count = (Math.floor(parent.total / parent.limit) + (parent.total % parent.limit > 0 ? 1 : 0))

			self.pages.length = 0;

			for (var i = 0; i < self.count; i++) {
				self.pages.push(i + 1);
			}
		})

		this.noop = function() { }.bind(this)

		this.className = function(itemPage) {
			if ( itemPage === self.page ) {
				return self.opts.active_button_class || ''
			} else {
				return self.opts.button_class || ''
			}
		}.bind(this)

		this.firstPage = function() {
			self.setPage(1)
		}.bind(this)

		this.prevPage = function() {
			if ( self.page > 1 ) {
				self.setPage(self.page - 1)
			}
		}.bind(this)

		this.nextPage = function() {
			if ( self.page < self.count ) {
				self.setPage(self.page + 1)
			}
		}.bind(this)

		this.lastPage = function() {
			self.setPage(self.count)
		}.bind(this)

		this.checkPage = function() {
			var total = parent.filtered.length

			self.count = (Math.floor(total / parent.limit) + (total % parent.limit > 0 ? 1 : 0))

			if (self.page > self.count) {
				self.page = self.count
				parent.start = parent.limit * (self.page - 1)
			}
		}.bind(this)

		this.setPage = function(e) {
			var page = (isFinite(e) ? e : parseInt(e.target.textContent));

			if (page !== self.page) {
				self.page = page;

				parent.start = parent.limit * (self.page - 1)

				if ( parent.remote ) {
					parent.load()
				} else {
					parent.update()
				}
			}
		}.bind(this)

});
riot.tag2('riot-table', '<yield></yield>', 'riot-table[data-loading="true"] tbody,[data-is="riot-table"][data-loading="true"] tbody{ opacity: .5; }', '', function(opts) {
		var self = this

		self.start = 0
		self.limit = self.opts.limit || 10
		self.remote = (typeof self.opts.data === 'string' || typeof self.opts.data === 'function')

		this.load = function(paginator) {
			paginator = paginator || {}

			var params = 'start=' + (paginator.page === 1 ? 0 : self.start) + '&limit=' + self.limit
			if ( 'searchbox' in self.tags && self.tags.searchbox.query ) {
				params += '&query=' + encodeURIComponent(self.tags.searchbox.query)
			}

			if ( 'filter' in self.tags ) {
				if ( Array.isArray(self.tags.filter) ) {
					var index = 0

					self.tags.filter.forEach(function (filter) {
						if ( filter.query ) {
							params += '&filter[' + index + '][key]=' + encodeURIComponent(filter.term) + '&filter[' + index + '][value]=' + encodeURIComponent(filter.query)
							index++
						}
					})
				} else if ( self.tags.filter.query ) {
					params += '&filter[key]=' + encodeURIComponent(self.tags.filter.term) + '&filter[value]=' + encodeURIComponent(self.tags.filter.query)
				}
			}

			if (typeof self.url === 'string') {
				self.request && self.request.abort()

				self.request = new XMLHttpRequest()
				self.request.open('get', self.url + '?' + params)
				self.request.responseType = 'json'
				self.request.onload = function () {
					var data = self.request.response

					self.filtered.length = 0
					self.data.length = 0

					self.total = data.shift()
					self.filtered = data
					self.data = self.filtered

					self.loading = false
					self.root.dataset.loading = 'false'
					self.request = null

					self.update()

					if ( 'paginator' in self.tags ) {
						self.tags.paginator.update(paginator)
					}
				}

				self.request.send()
			} else {
				self.url.call(self, params).then(function (response) {
					self.filtered.length = 0
					self.data.length = 0

					self.total = response.shift()
					self.filtered = response
					self.data = self.filtered

					self.loading = false
					self.root.dataset.loading = 'false'
					self.request = null

					self.update()

					if ( 'paginator' in self.tags ) {
						self.tags.paginator.update(paginator)
					}
				}, function (error) {

				})
			}

			self.loading = true
			self.root.dataset.loading = 'true'
		}.bind(this)

		this.num = function(index) {
			if ('paginator' in self.tags) {
				return (self.tags.paginator.page - 1) * self.limit + index + 1
			} else {
				return 0
			}
		}.bind(this)

		this.updatePaginator = function(paginator) {
			if ( 'paginator' in self.tags ) {
				self.tags.paginator.update(paginator || {})
			}
		}.bind(this)

		this.updateAndPaginator = function(paginator) {
			self.update()
			self.updatePaginator(paginator || {});
		}.bind(this)

		if ( self.remote ) {
			self.url = self.opts.data

			self.original = []
			self.filtered = []
			self.data = []

			self.total = 0

			self.load()
		} else {
			self.original = self.opts.data
			self.filtered = self.original.slice(0)
			self.data = self.filtered.slice(self.start, self.start + self.limit)

			self.total = self.filtered.length
		}

		if (self.opts.hideLoader) {
			self.root.dataset.hideLoader = 'true'
		}

		self.on('update', function (context) {
			context = context || {}

			if ( !self.remote ) {
				if ('data' in context) {
					self.filtered = self.original.slice(0)

					self.tags.paginator.checkPage()

					self.data = self.filtered.slice(self.start, self.start + self.limit)
					self.total = self.filtered.length

					self.updatePaginator()
				} else {
					self.data = self.filtered.slice(self.start, self.start + self.limit)
					self.total = self.filtered.length
				}
			}

			if (typeof self.opts.onupdate === 'function') {
				window.setTimeout(function () {
					self.opts.onupdate.call(self)
				});
			}
		})
});

riot.tag2('searchbox', '<input type="search" class="{opts.input_class}" placeholder="{opts.placeholder}" oninput="{filter}">', '', '', function(opts) {
		var self = this
		var parent = self.parent
		var delay = 500

		self.min = self.opts.min || (parent.remote ? 3 : 0)
		self.query = ''
		self.timeout = 0

		this.filter = function(e) {
			if ( e.target.value.trim() !== self.query && ( !e.target.value.trim().length || e.target.value.trim().length > self.min ) ) {
				self.query = e.target.value.trim()
				self.timeout && clearTimeout(self.timeout)

				self.timeout = setTimeout(function () {
					if ( parent.remote ) {
						parent.load({ page: 1 })
					} else {
						parent.filtered.length = 0

						if ( !self.query.length ) {
							parent.filtered = parent.original.slice(0)
						} else {
							parent.original.forEach(function (item) {
								var keys = Object.keys(item);

								for ( var i = 0; i < keys.length; i++ ) {
									if ( item[keys[i]] && new RegExp(self.query, 'i') .test(item[keys[i]].toString()) ) {
										parent.filtered.push(item)
										break
									}
								}
							})
						}
					}

					self.timeout = 0

					parent.start = 0

					parent.updateAndPaginator({ page: 1 })
				}, delay)

			}
		}.bind(this)
});
