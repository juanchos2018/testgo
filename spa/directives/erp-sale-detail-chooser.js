/*
** Esta directiva crea el listado que contiene los detalles de venta
**
*/

window.angular.module('ERP').directive('erpSaleDetailChooser', [
  '$window', '$filter', '$timeout', 'Ajax', 'Settings', '_angular', '_$', '_riot',
  function ($window, $filter, $timeout, Ajax, Settings, angular, $, riot) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        ngModel: '=',
        searchInPacks: '=',
        company: '=',
        regime: '=',
        customerVerified: '=',
        disabled: '=',
        ignoreStock: '@'
      },
      controller: ['$scope', '$element', function ($scope, $element) {
        $scope.query = '';

        $scope.find = function () {
          if (/^\w+$/.test($scope.query)) { // Código de barras
            var searchUrl = '';

            if ($scope.company && $scope.regime) {
              searchUrl = $window.siteUrl('products/get_for_sale/' + $scope.query + '/' + $scope.company + '/' + $scope.regime);
            } else {
              searchUrl = $window.siteUrl('products/get_for_sale/' + $scope.query);
            }

            Ajax.get(searchUrl).then(function (res) {
              if (res.data.length) {
                if (res.data.length > 1) {
                  var items = res.data.map(function (record, index) {
                    return `
											<tr>
												<td>
													<div class="radio i-checks">
														<label>
															<input type="radio" value="${ index}" name="product-for-sale" ${!index ? 'checked' : ''}>
															<i></i>
														</label>
													</div>
												</td>
												<td>${ record.code}</td>
												<td>${ record.description}</td>
												<td>${ record.size}</td>
												<td>${ record.regime}</td>
												<td>${ record.company_name}</td>
											</tr>
										`;
                  });

                  var modal = $window.bootbox.dialog({
                    title: 'Se encontraron varios productos',
                    message: `
											<p class="m-b">
												Seleccione uno de los productos con código de barras <strong>${ $scope.query}</strong>.
											</p>
											<div class="table-responsive">
												<table class="table table-bordered table-hover">
													<thead>
														<tr>
															<th>&nbsp;</th>
															<th class="text-center">Código</th>
															<th class="text-center">Descripción</th>
															<th class="text-center">Talla</th>
															<th class="text-center">Régimen</th>
															<th class="text-center">Empresa</th>
														</tr>
													</thead>
													<tbody>
														${ items.join('')}
													</tbody>
												</table>
											</div>
										`,
                    show: false,
                    buttons: {
                      cancel: {
                        label: 'Cancelar',
                        className: 'btn-default',
                        callback: function () {
                          $scope.$apply(function () {
                            $scope.clearInput();
                          });
                        }
                      },
                      success: {
                        label: 'Aceptar',
                        className: 'btn-success',
                        callback: function () {
                          $scope.$apply(function () {
                            $scope.clearInput();

                            var selected = $('[name="product-for-sale"]:checked').val();

                            $scope.addSaleDetail(res.data[selected]);
                          });
                        }
                      }
                    }
                  });
                  modal
                    .on('shown.bs.modal', function () {
                      modal.find('button').focus();
                    })
                    .modal('show');
                } else {
                  $scope.addSaleDetail(res.data[0]);
                }

              } else {
                var modal = $window.bootbox.alert({
                  title: 'Código de barras no encontrado',
                  message: 'No se encontró ningún producto con el código de barras especificado.',
                  show: false,
                  buttons: {
                    ok: {
                      label: 'Aceptar',
                      className: 'btn-danger'
                    },
                  },
                  callback: function () {
                    $scope.$apply(function () {
                      $scope.clearInput();
                    });
                  }
                });
                modal
                  .on('shown.bs.modal', function () {
                    modal.find('button').focus();
                  })
                  .modal('show');
              }
            }, function () {
              var modal = $window.bootbox.alert({
                title: 'Código de barras no encontrado',
                message: 'No se encontró ningún producto con el código de barras especificado.',
                show: false,
                buttons: {
                  ok: {
                    label: 'Aceptar',
                    className: 'btn-danger'
                  },
                },
                callback: function () {
                  $scope.$apply(function () {
                    $scope.clearInput();
                  });
                }
              });
              modal
                .on('shown.bs.modal', function () {
                  modal.find('button').focus();
                })
                .modal('show');

            });
          } else {
            var modal = $window.bootbox.alert({
              title: 'Código de barras no válido',
              message: 'El formato del código de barras ingresado no contiene un formato válido compuesto de 15 caracteres numéricos.',
              show: false,
              buttons: {
                ok: {
                  label: 'Aceptar',
                  className: 'btn-danger'
                },
              },
              callback: function () {
                $scope.$apply(function () {
                  $scope.clearInput();
                });
              }
            });
            modal
              .on('shown.bs.modal', function () {
                modal.find('button').focus();
              })
              .modal('show');
          }
        };

        $scope.addSaleDetail = function (item) {
          if ($scope.ignoreStock || parseInt(item.stock, 10) > 0) { // Existen productos en stock
            var existingSaleDetail = $scope.ngModel.find(function (saleDetail) {
              return saleDetail.id === item.id && !saleDetail.pack_list_id;
            });

            if (existingSaleDetail === undefined) {
              item.stock = parseInt(item.stock);
              item.price = parseFloat(item.price);
              item.offer_price = parseFloat(item.offer_price);
              item.qty = 1;

              $scope.ngModel.push(riot.observable(item));

              (typeof $scope.searchInPacks === 'function' && $scope.searchInPacks(item));
            } else {
              delete item;

              item = existingSaleDetail;

              if ($scope.ignoreStock || item.qty + 1 <= item.stock) {
                item.qty++; // Solo se debe incrementar la cantidad

                (typeof $scope.searchInPacks === 'function' && $scope.searchInPacks(item));
              } else {
                $scope.missingStock(item);
              }
            }

            //if (typeof $scope.searchInPacks === 'function') {
            //  $scope.searchInPacks(item);
            //}

            $scope.clearInput();

          } else {
            $scope.missingStock(item);
          }

        };

        $scope.clearInput = function () {
          $scope.query = '';
          $timeout(function () {
            $element.find('input[type="text"]').focus();
          });
        };

        $scope.missingStock = function (item) {
          var modal = $window.bootbox.alert({
            title: 'Stock insuficiente',
            message: 'No existen suficientes productos de <strong>' + item.description + '</strong> en la talla <strong>' + item.size + '</strong>.',
            show: false,
            buttons: {
              ok: {
                label: 'Aceptar',
                className: 'btn-danger'
              },
            },
            callback: function () {
              $scope.$apply(function () {
                $scope.clearInput();
              });
            }
          });
          modal
            .on('shown.bs.modal', function () {
              modal.find('button').focus();
            })
            .modal('show');
        };

        $scope.keyPressed = function (e) {
          if (e.keyCode === 38) { // Arriba
            var lastInput = $element.closest('tbody').find('input[type="number"]:last');

            if (lastInput.length) {
              lastInput.focus();
            }

            e.preventDefault();
          } else if (e.ctrlKey && e.keyCode === 66) { // Si presiona CTRL + B
            $scope.search();
            e.preventDefault();
          }
        };

        $scope.search = function () {
          var modal = $window.bootbox.dialog({
            message: `
              <riot-table>
                <div class="row">
                  <div class="col-lg-12">
                    <searchbox input_class="form-control" placeholder="Buscar producto..."></searchbox>
                  </div>
                </div>
                <div class="row m-t">
                  <div class="col-lg-12">
                    <div class="table-responsive">
                      <table class="table table-bordered table-hover">
                        <thead>
                          <tr>
                            <th style="width:150px">Código</th>
                            <th>Descripción</th>
                            <th style="width:100px">Talla</th>
                            <th style="width:100px" show="{ !opts.regime }">Régimen</th>
                            <th style="width:100px" show="{ !opts.company }">Empresa</th>
                            <th style="width:80px">Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr each="{ data }" onclick="{ parent.opts.setProduct }" style="cursor:pointer">
                            <td>{ code }</td>
                            <td>{ description }</td>
                            <td>{ size }</td>
                            <td>{ regime }</td>
                            <td>{ company_name }</td>
                            <td class="text-center">{ stock }</td>
                          </tr>
                          <tr if="{ !data.length }">
                            <td if="{ !loading }" class="text-center" colspan="6">
                              No se encontraron registros
                            <td>
                            <td if="{ loading }" class="text-center" colspan="6">
                              Obteniendo datos...
                            <td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-lg-6">{ total } registros</div>
                  <div class="col-lg-6">
                    <paginator button_class="btn btn-sm btn-default" active_button_class="btn btn-sm btn-primary"></paginator>
                  </div>
                </div>
              </riot-table>
		        `,
            onEscape: true,
            backdrop: true,
            closeButton: false,
            size: 'large',
            show: false
          });

          $window.riot.mount(modal.find('riot-table').get(0), 'riot-table', {
            data: function (params) {
              return $window.backgroundXHR(
                $window.siteUrl('products/get_list_for_sale' + ($scope.company && $scope.regime ? '/' + $scope.company + '/' + $scope.regime : '') + '?' + params),
                null,
                { id: 'erp-product-chooser', responseType: 'json' } /* Este id se pasa para que se pueda cancelar los XHR que aún no se completaron en la siguiente petición */
              );
            },
            hideLoader: true,
            companies: angular.copy(Settings.getCompaniesOfBranch()),
            company: $scope.company,
            regime: $scope.regime,
            setProduct: function (e) {
              var item = e.item;

              modal.modal('hide');

              console.log('item', item);

              $scope.$apply(function () {
                $scope.addSaleDetail(item);
              });
            }
          });

          modal
            .on('shown.bs.modal', function () {
              modal.find('searchbox input').focus();
            })
            .modal('show');
        };
      }],
      link: function (scope, element, attrs) {

      },
      template: `
				<form ng-submit="find()" autocomplete="off">
					<div class="input-group">
						<input type="text" ng-disabled="disabled" class="form-control" ng-keydown="keyPressed($event)" required ng-model="query" name="query" placeholder="Escanee código de barras" />
						<span class="input-group-btn">
							<button class="btn btn-default" ng-disabled="disabled" ng-click="search()" ng-keydown="keyPressed($event)" type="button">
								<i class="icon-search-1"></i>
								Buscar
							</button>
						</span>
					</div>
				</form>
      `
    };
  }
]);
