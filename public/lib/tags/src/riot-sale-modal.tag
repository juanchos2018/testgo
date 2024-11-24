<riot-sale-modal>
  <yield/>

  <script>
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
  </script>
</riot-sale-modal>
