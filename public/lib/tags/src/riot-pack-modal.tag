<riot-pack-modal>
  <style>
    button[data-upload] {
      position: relative;
      overflow: hidden;
    }

    input[type="file"] {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
    }
  </style>
  <div class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xlg">
      <div class="modal-content">
        <div class="modal-body">
          <form class="form-horizontal" onsubmit="{ done }" id="pack-form">
            <div class="form-group required">
              <label class="col-md-2 control-label">Descripción aaa</label>
              <div class="col-md-8">
                <input type="text" class="form-control" value="loclco" data-prop="description" oninput="{ setProp }" required disabled="{ opts.readonly === 'true' }">
              </div>

              <label class="col-md-1 control-label no-required">Activo</label>

              <div class="col-md-1 m-b">
                <label class="switch m-b-none">
                  <input type="checkbox" data-prop="active" onchange="{ setProp }" disabled="{ opts.readonly === 'true' }">
                  <span></span>
                </label>
              </div>
            </div>

            <div class="form-group m-b-none required">

              <label class="col-md-2 control-label">Empresa</label>
              <div class="col-md-2 m-b">
                <select required
                  class="form-control" 
                  data-prop="company_id"
                  onchange="{ setProp }"
                  disabled="{ opts.readonly === 'true' || lists.length > 0 }"
                >
                  <option value="" selected="{ !company_id }">- Seleccione -</option>
                  <option
                    each="{ text, id in opts.companies }"
                    value="{ id }"
                    checked="{ parent.company_id === id }"
                  >
                    { text }
                  </option>
                </select>
              </div>

              <label class="col-md-2 control-label">Régimen</label>
              <div class="col-md-2 m-b">
                <select required
                  class="form-control"
                  data-prop="regime"
                  onchange="{ setProp }"
                  disabled="{ opts.readonly === 'true' || lists.length > 0 }"
                >
                  <option value="" selected="{ !regime }">- Seleccione -</option>
                  <option
                    each="{ text, id in opts.regimes }"
                    value="{ id }"
                    selected="{ parent.regime === id }"
                  >
                    { text }
                  </option>
                </select>
              </div>

              <label class="col-md-2 control-label no-required" if="{ lists.length > 0 }">Precio</label>
              <div class="col-md-2 m-b" if="{ lists.length > 0 }">
                <div class="input-group">
                  <span class="input-group-addon">S/</span>
                  <input class="form-control text-right" readonly tabindex="-1" ref="price" value="0.00">
                </div>
              </div>
            </div>
          </form>

          <div if="{ company_id && regime }">
            <h4>Listas de productos <small>({ lists.length })</small></h4>

            <div class="alert alert-{ messageType }" role="alert" if="{ message.length > 0 }">
              <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="{ closeMessage }">
                <span aria-hidden="true">&times;</span>
              </button>
              { message }
            </div>

            <div class="responsive-table">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th width="100px">Cant.</th>
                    <th>Productos</th>
                    <th if="{ opts.readonly === 'false' }" width="50px">&nbsp;</th>
                    <th width="50px">&nbsp;</th>
                    <th width="130px">P. Unitario</th>
                    <th width="130px">Precio</th>
                    <th width="50px">&nbsp;</th>
                  </tr>
                </thead>
                <tbody>
                  <tr if="{ lists.length === 0 }">
                    <td class="text-center" colspan="7">No se encontraron registros</td>
                  </tr>
                  <tr if="{ lists.length > 0 }" each="{ list, i in lists }" data-list>
                    <td class="v-middle">
                      <input required
                        type="number"
                        data-prop="quantity"
                        class="form-control text-center"
                        min="1"
                        form="pack-form"
                        oninput="{ setListProp }"
                        readonly="{ parent.opts.readonly === 'true' }"
                      >
                    </td>
                    <td class="v-middle">
                      <select required multiple
                        data-prop="products"
                        form="pack-form"
                        class="form-control"
                        style="width:100%"
                        if="{ parent.opts.readonly === 'false' }"
                      ></select>
                      <div data-prop="products" if="{ parent.opts.readonly === 'true' }"></div>
                    </td>
                    <td class="v-middle text-center" if="{ parent.opts.readonly === 'false' }">
                      <button type="button" class="btn btn-primary" title="Cargar desde archivo" data-upload onclick="{ parent.triggerUpload }" tabindex="-1">
                        <input type="file" accept="text/csv" onchange="{ parent.uploadProducts }" tabindex="-1">
                        <i class="fa fa-upload"></i>
                      </button>
                    </td>
                    <td class="v-middle text-center">
                      <button type="button" class="btn btn-default" title="Descargar" onclick="{ parent.downloadProducts }" tabindex="-1">
                        <i class="fa fa-download"></i>
                      </button>
                    </td>
                    <td class="v-middle">
                      <div class="input-group">
                        <span class="input-group-addon">S/</span>
                        <input readonly
                          type="text"
                          data-prop="price"
                          class="form-control text-right"
                          pattern="\d+(\.\d+)?"
                          form="pack-form"
                          value="0.00"
                          tabindex="-1"
                        >
                      </div>
                    </td>
                    <td class="v-middle">
                      <div class="input-group">
                        <span class="input-group-addon">S/</span>
                        <input required
                          type="text"
                          data-prop="subtotal"
                          class="form-control text-right"
                          pattern="\d+(\.\d+)?"
                          form="pack-form"
                          oninput="{ setListProp }"
                          readonly="{ parent.opts.readonly === 'true' }"
                        >
                      </div>
                    </td>
                    <td class="text-center v-middle" if="{ parent.opts.readonly === 'false' }">
                      <a href="#" onclick="{ removeList }" title="Eliminar">
                        <i class="fa fa-remove text-danger"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="text-right" if="{ opts.readonly === 'false' && lists.length < 3 }">
                <a href="#" onclick="{ addEmptyList }">
                  <i class="fa fa-plus"></i> Agregar lista
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">{ opts.readonly === 'true' ? 'Cerrar' : 'Cancelar' }</button>
          <button type="submit" class="btn btn-primary" form="pack-form" disabled="{ lists.length === 0 }" if="{ opts.readonly === 'false' }">Aceptar</button>
        </div>
      </div>
    </div>
  </div>

  <script>
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

    addEmptyList(e) {
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
    }

    closeMessage(e) {
      self.message = '';
      self.messageType = 'danger';
    }

    done(e) {
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
        // console.log('input price', self.price, 'value', self.price.value);
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
    }

    downloadProducts(e) {
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
        //console.log('output', output);
        self.opts.FileHandler.download(output, 'productos.csv');
      }
    }

    triggerUpload(e) {
      if (e.target.tagName !== 'INPUT') {
        $('input', e.target).trigger('click');

        e.preventDefault();
      }
    }

    uploadProducts(e) {
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
            //console.log('codigos', codes);
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
                  //console.log('agregar', products);
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
    }

    isDuplicated(item, product) {
      return self.lists.filter(function (list) {
        return list !== item;
      }).find(function (list) {
        return list.products.indexOf(product) > -1;
      });
    }

    removeList(e) {
      self.lists.splice(self.lists.indexOf(e.item.list), 1);
      self.updatePrice();
    }

    selectingProduct(item, e) {
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
    }

    selectProduct(item, e) {
      item.products.push(e.params.data.id);
      item.codes.push(e.params.data.text);
      // console.log('selectProduct', 'codes', item.codes);
    }

    setDefaultValues() {
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
    }

    setInitialValues() {
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
    }

    setListProp(e) {
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
    }

    setProp(e) {
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
    }

    unselectProduct(item, e) {
      item.products.splice(item.products.indexOf(e.params.data.id), 1);
      item.codes.splice(item.codes.indexOf(e.params.data.text), 1);
      // console.log('unselectProduct', 'codes', item.codes);
    }

    updatePrice() {
      self.refs.price.value = self.lists.reduce(function (accum, current) {
        return checkPrecision(accum + (parseFloat(current.subtotal) || 0));
      }, 0).toFixed(2);
    }

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
      // console.log('Actualizando....');
    });
  </script>
</riot-pack-modal>
