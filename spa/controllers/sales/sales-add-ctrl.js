window.angular.module('ERP').controller('SalesAddCtrl', [
  '$scope', '$rootScope', '$window', '$document', '$route', '$timeout', '$location', '$filter', 'Page', 'Sales', 'Settings', 'Session', 'Ajax', 'HotKeys', 'Auth',
  function ($scope, $rootScope, $window, $document, $route, $timeout, $location, $filter, Page, Sales, Settings, Session, Ajax, HotKeys, Auth) {
    const angular = $window.angular, $ = angular.element;

    Page.title('Registrar documento');

    $scope.Sales = Sales;

    // La siguiente variable contiene todos los parámetros para registrar el documento
    $scope.config = {
      type: '',
      company: '',
      regime: '',
      reference: {
        type: 'TICKET',
        serie: ''
      }
    };

    $scope.typeOpts = [
      { value: Sales.BOLETA, text: 'Boleta' },
      { value: Sales.FACTURA, text: 'Factura' },
      { value: Sales.NOTA_DE_CREDITO, text: 'Nota de crédito' }
    ];

    $scope.formStates = {
      'OPCIONES': 0,
      'ENTRADA': 1,
      'INICIANDO_PAGO': 2,
      'PAGO': 3,
      'GUARDANDO': 4 /* Para el guardado de NOTA DE CREDITO manual */
    };

    $scope.formState = $scope.formStates.OPCIONES;
    $scope.isLoading = false;

    $scope.saleman = { // Para <erp-saleman-chooser>
      list: [],
      selected: {}
    };

    $scope.customer = {}; // Para <erp-customer-chooser>

    $scope.salePoints = [];
    $scope.saleDetails = [];
    $scope.payments = {};

    $scope.isSaving = false;
    $scope.hasPartner = false;

    $scope.record = {
      serie: '',
      serial_number: '',
      sale_date: $window.moment().format('YYYY-MM-DD'),
      sale_point_id: '',
      refund_reason_id: '1',
      other_refund_reason: ''
    };

    $scope.refunded = {};
    $scope.refundedDetails = [];

    $scope.initCurrentSalePoint = function () {
      $scope.record.sale_point_id = $window.localStorage.currentSalePoint || '';

      // Verificar si el punto de venta actual es válido
      var salePointFound = false;

      for (var i = 0; i < $scope.salePoints.length; i++) {
        if ($scope.salePoints[i].id === $scope.record.sale_point_id) {
          salePointFound = true;
          break;
        }
      }

      if (!salePointFound) {
        $scope.record.sale_point_id = $window.localStorage.currentSalePoint = '';
      }
    };

    $scope.showForm = function () {
      $scope.isLoading = true;
      Session.clearMessage();

      Ajax.get($window.siteUrl(
        'series/get_for_sale/' +
        Sales.getVoucherString($scope.config.type) + '/' +
        $scope.config.company + '/' +
        ($scope.config.type === Sales.BOLETA || $scope.config.type === Sales.FACTURA ?
          $scope.config.regime + '/'
          :
          ''
        ) +
        ($scope.config.type === Sales.NOTA_DE_CREDITO ?
          $scope.config.reference.type + '/' +
          $scope.config.reference.serie.split('-').map(function (val) {
            return parseInt(val, 10);
          }).join('/')
          :
          ''
        )
      )).then(function (res) {
        var result = res.data;
        console.log('result', result);

        if ('error' in result) {
          Session.setMessage(result.message || 'Ocurrió un error', 'danger', true);
        } else if ('ok' in result) {
          if ($scope.config.type !== Sales.NOTA_DE_CREDITO || !result.reference.refunded_sale_details.length) {
            $scope.formState = $scope.formStates.ENTRADA;
          } else {
            // Se debe usar reduce para hacer la sumatoria y ver si hay productos por devolver
            var qtySaleDetails = result.reference.sale_details.reduce(function (prev, curr) {
              return {
                quantity: $window.checkPrecision(prev.quantity + curr.quantity)
              };
            }).quantity;

            var qtyRefundDetails = result.reference.refunded_sale_details.reduce(function (prev, curr) {
              return {
                refunded_quantity: $window.checkPrecision(prev.refunded_quantity + curr.refunded_quantity)
              };
            }).refunded_quantity;

            if (qtySaleDetails > qtyRefundDetails) { // Aún quedan productos por devolver
              $scope.formState = $scope.formStates.ENTRADA;
            }
          }

          if ($scope.formState !== $scope.formStates.ENTRADA) { // Es una devolución y no hay productos pro devolver
            Session.setMessage('La venta de referencia ya fue devuelta en su totalidad', 'danger', true);
          } else {
            var hasSerie = parseInt(result.serie, 10) > 0;

            if (hasSerie) {
              $scope.record.serie = result.serie.zeros(3);
              $scope.record.serial_number = result.serial_number.zeros(7);
            } else {
              $scope.record.serie = '';
              $scope.record.serial_number = '';
            }

            if ($scope.config.type === Sales.NOTA_DE_CREDITO) {
              // Si es una nota de crédito debe guardarse la venta devuelta en $scope.refunded
              $scope.refunded = result.reference;
              $scope.refundedDetails.length = 0;

              if ('sale_details' in result.reference && result.reference.sale_details.length) {
                result.reference.sale_details.forEach(function (saleDetail) {
                  saleDetail.checked = false;

                  $scope.refundedDetails.push({
                    sale_id: $scope.refunded.id,
                    quantity: '',
                    price: parseFloat(saleDetail.price),
                    product_barcode_id: saleDetail.product_barcode_id,
                    cost: saleDetail.cost,
                    pack_list_id: ''
                  });
                });
              }
            }


            $timeout(function () {
              if (hasSerie) {
                $('[ng-view] [data-toggle="tooltip"]').attr('title', 'Este número es estimado. Revise el documento físico.').tooltip();
              }
              // $('[ng-view] [ng-model="record.' + (hasSerie ? 'serial_number' : 'serie') + '"]').focus().select();
              $timeout(function () {
                $('[ng-view] [ng-model="record.serie"]').focus().select();
              });
            });
          }
        }

        $scope.isLoading = false;
      }, function (err) {
        Session.setMessage(err.statusText || err, 'danger', true);
        $scope.isLoading = false;

        console.error('Error', err);
      });
    };

    $scope.getMaxQtyForRefund = function (saleDetail) {
      if ($scope.refunded.refunded_sale_details.length) {
        var maxQty = false;

        for (var i = 0; i < $scope.refunded.refunded_sale_details.length; i++) {
          if ($scope.refunded.refunded_sale_details[i].id === saleDetail.id) {
            maxQty = $scope.refunded.refunded_sale_details[i].quantity;
            break;
          }
        }

        return parseInt(maxQty === false ? saleDetail.quantity : maxQty, 10);
      } else {
        return parseInt(saleDetail.quantity, 10);
      }
    };

    $scope.hideForm = function () {
      $window.bootbox.confirm({
        title: '¿Desea continuar?',
        message: 'Todos los datos ingresados serán descartados.',
        buttons: {
          cancel: {
            label: 'Cancelar',
            className: 'btn-default'
          },
          confirm: {
            label: 'Continuar',
            className: 'btn-danger'
          }
        },
        callback: function (yes) {
          if (yes) {
            $scope.$apply(function () {
              $scope.formState = $scope.formStates.OPCIONES;
            });
          }
        }
      });
    };

    $scope.removeDetail = function (index) {
      $scope.saleDetails.splice(index, 1);
    };

    $scope.unitPrice = function (detail) {
      if ($scope.customer.verified) {
        return parseFloat(detail.offer_price);
      } else {
        return parseFloat(detail.price);
      }
    };

    $scope.subTotal = function (detail) {
      if ('qty' in detail && 'unit_price' in detail) {
        return $window.checkPrecision(parseInt(detail.qty) * parseFloat(detail.unit_price));
      } else { // Es una devolución
        return $window.checkPrecision(parseInt(detail.quantity) * parseFloat(detail.price));
      }
    };

    $scope.total = function () {
      var total = 0;

      $scope.saleDetails.forEach(function (detail) {
        total = $window.checkPrecision(total + $scope.subTotal(detail));
      });

      return total;
    };

    $scope.subTotalRefunded = function (index) {
      if ($scope.refunded.sale_details[index] && $scope.refundedDetails[index]) {
        return $window.checkPrecision(parseInt($scope.refundedDetails[index].quantity || 0, 10) * parseFloat($scope.refunded.sale_details[index].price));
      } else {
        return 0;
      }
    };

    $scope.totalRefunded = function () {
      var total = 0;

      $scope.refundedDetails.forEach(function (value, index) {
        total = $window.checkPrecision(total + $scope.subTotalRefunded(index));
      });

      return total;
    };

    $scope.changeRefundCheck = function (detail, refundDetail) {
      if (detail.checked) {
        refundDetail.quantity = $scope.getMaxQtyForRefund(detail);
      } else {
        refundDetail.quantity = '';
      }
    };

    $scope.clickRefundDetail = function (event, detail, refundDetail) {
      if (event.target.tagName === 'TD') {
        detail.checked = !detail.checked;
        $scope.changeRefundCheck(detail, refundDetail);
      }
    };

    $scope.clearAll = function () {
      if ($scope.saleDetails.length) {
        $window.bootbox.confirm({
          title: '¿Está seguro?',
          message: 'Está a punto de borrar el detalle de venta ingresado.',
          buttons: {
            cancel: {
              label: 'Cancelar',
              className: 'btn-default'
            },
            confirm: {
              label: 'Continuar',
              className: 'btn-danger'
            }
          },
          callback: function (yes) {
            if (yes) {
              $scope.$apply(function () {
                $scope.reset();
              });
            }
          }
        });
      } else {
        $scope.reset();
      }
    };

    $scope.reset = function () {
      $scope.saleman.selected = {
        id: '',
        full_name: '',
        code: ''
      };
      $scope.customer = {
        id: '',
        full_name: '',
        id_number: '',
        type: '',
        address: '',
        verified: ''
      };

      $scope.saleDetails.length = 0;

      Object.keys($scope.payments).forEach(function (company) {
        $scope.payments[company].length = 0;

        delete $scope.payments[company];
      });

      $timeout(function () {
        console.log('focus', $('[erp-focus]:first'));
        $('[erp-focus]:first').focus();
      });
    };

    $scope.detailKeyPressed = function (e, detail) {
      if (e.keyCode === 107 || e.keyCode === 171) { // Se incrementa
        if (e.target.value < e.target.max) {
          //e.target.value++;
          detail.qty++;
        }

        e.preventDefault();
      } else if (e.keyCode === 109 || e.keyCode === 173) { // Se decrementa
        if (e.target.value > 1) {
          //e.target.value--;
          detail.qty--;
        }

        e.preventDefault();
      } else if (e.keyCode === 38) { // Arriba
        var prevInput = $(e.target)
          .parent() // TD
          .parent() // TR
          .prev()
          .find('input[type="number"]');

        if (prevInput.length) {
          prevInput.focus();
        }

        e.preventDefault();
      } else if (e.keyCode === 40) { // Abajo
        var nextInput = $(e.target)
          .parent() // TD
          .parent() // TR
          .next()
          .find('input[type="number"], input[type="text"]');

        if (nextInput.length) {
          nextInput.focus();
        }

        e.preventDefault();
      }
    };

    $scope.pay = function () {
      if ($scope.formState === $scope.formStates.ENTRADA) {
        $scope.formState = $scope.formStates.INICIANDO_PAGO;

        $timeout(function () {
          $scope.formState = $scope.formStates.PAGO;
        });
      }
    };

    $scope.cancelPayment = function () {
      if (Object.keys($scope.payments).length) {
        $window.bootbox.confirm({
          title: '¿Está seguro?',
          message: 'Está a punto de borrar ' + ($scope.payments.length === 1 ? 'el pago ingresado' : 'los pagos ingresados') + '.',
          buttons: {
            cancel: {
              label: 'Cancelar',
              className: 'btn-default'
            },
            confirm: {
              label: 'Continuar',
              className: 'btn-danger'
            }
          },
          callback: function (yes) {
            if (yes) {
              $scope.$apply(function () {
                $scope.payments = {};
                $scope.formState = $scope.formStates.ENTRADA;
              });
            }
          }
        });
      } else {
        $scope.formState = $scope.formStates.ENTRADA;
      }
    };

    $scope.save = function (modal) {
      if (!$scope.isSaving) {
        $scope.isSaving = true;
        modal.find('.btn-success').attr('disabled', true);

        var data = Sales.getRecord(
          $scope.config.type,
          $scope.config.company,
          $scope.config.regime,
          $scope.customer,
          $scope.saleman.selected,
          $scope.saleDetails,
          $scope.payments,
          {
            sale_point_id: $scope.record.sale_point_id,
            serie: parseInt($scope.record.serie, 10),
            serial_number: parseInt($scope.record.serial_number, 10),
            sale_date: $scope.record.sale_date
          }
        );

        console.log('data', data);

        Ajax.post($window.siteUrl('sales/save'), { sale: data }).then(function (saleResponse) {
          var result = saleResponse.data;

          console.log('result', result);

          if ('error' in result) {
            Session.setMessage(result.mesage || 'Ocurrió un error', 'danger', true);

            $scope.isSaving = false;
            modal.modal('hide');
          } else {
            modal.one('hidden.bs.modal', function () {
              $scope.$apply(function () {
                $scope.reset();
                $scope.isSaving = false;
                $scope.formState = $scope.formStates.OPCIONES;

                Session.setMessage('El documento se registró correctamente', 'success', true);
              });
            }).modal('hide');
          }
        }, function (err) {
          Session.setMessage(err, 'danger', true);

          $scope.isSaving = false;
          modal.modal('hide');
        });
      }
    };

    $scope.clearOrCancel = function () {
      if ($scope.formState === $scope.formStates.ENTRADA) {
        $scope.clearAll();
      } else {
        $scope.cancelPayment();
      }
    };

    $scope.payOrFinish = function () {
      if ($scope.formState === $scope.formStates.ENTRADA) {
        $scope.pay();
      } else {
        $('erp-payment').find('[name="pay-button"]').trigger('click');
      }
    };

    $scope.saveRefund = function () {
      if ($scope.formState !== $scope.formStates.GUARDANDO) {
        $scope.formState = $scope.formStates.GUARDANDO;

        var customer = {
          id: $scope.refunded.customer_id,
          full_name: $scope.refunded.customer,
          id_number: $scope.refunded.customer_doc,
          type: $scope.refunded.customer_type,
          address: $scope.refunded.customer_address,
          verified: $scope.refunded.verified === 't'
        };

        var saleDetails = $scope.refundedDetails.filter(function (detail) {
          return (typeof detail.quantity === 'number' && detail.quantity > 0);
        });

        var payments = {};

        payments[$scope.refunded.company] = [{
          companyId: $scope.refunded.company_id,
          method: 'EFECTIVO',
          money: 'PEN',
          origAmount: 0,
          amount: 0
        }];

        var config = {
          sale_point_id: $scope.record.sale_point_id,
          serie: parseInt($scope.record.serie, 10),
          serial_number: parseInt($scope.record.serial_number, 10),
          sale_date: $scope.record.sale_date,
          reference_id: $scope.refunded.id, // Sólo para NC, representa la venta a devolver
          refund_reason_id: $scope.record.refund_reason_id,
          other_refund_reason: $scope.record.other_refund_reason
        };

        var data = Sales.getRecord(
          $scope.config.type, // Sales.NOTA_DE_CREDITO
          $scope.config.company,
          $scope.refunded.regime,
          customer,
          null, // Vendedor (no requerido para NOTA DE CREDITO)
          saleDetails,
          null, // Pagos (no requeridos para NOTA DE CREDITO)
          config
        );

        console.log('Datos generados para NC', data);

        Ajax.post($window.siteUrl('sales/save'), { sale: data }).then(function (res) {
          var result = res.data;

          console.log('result', result);

          if (typeof result !== 'object' || 'error' in result) {
            Session.setMessage(result.mesage || 'Ocurrió un error', 'danger', true);
            $scope.formState = $scope.formStates.ENTRADA;
          } else {
            $scope.reset();

            $scope.formState = $scope.formStates.OPCIONES;
            Session.setMessage('La nota de crédito se registró correctamente', 'success', true);
          }
        }, function (err) {
          Session.setMessage(err, 'danger', true);
          $scope.formState = $scope.formStates.ENTRADA;
        });
      }
    };

    $scope.$watch('customer.verified', function (newVal, oldVal) {
      $scope.saleDetails.forEach(function (saleDetail) {
        saleDetail.unit_price = (newVal ? saleDetail.offer_price : saleDetail.price).toFixed(2);
      });
    });

    HotKeys.add('Ctrl + SPACE', function (e) {
      if ($('[ng-view] [name="submit"]').is(':enabled')) {
        $scope.payOrFinish();
      }

      e.preventDefault();
    });
  }
]);
