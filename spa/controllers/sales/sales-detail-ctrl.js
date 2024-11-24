window.angular.module('ERP').controller('SalesDetailCtrl', [
	'$scope', '$rootScope', '$timeout', '$location', '$filter', '$window', '$routeParams', '$route', 'Page', 'Session', 'Ajax', 'Auth', 'Sales',
	function ($scope, $rootScope, $timeout, $location, $filter, $window, $routeParams, $route, Page, Session, Ajax, Auth, Sales) {
		var angular = $window.angular, $ = angular.element;

		Page.title('Detalle de venta');

		$scope.formStates = {
			'DETALLE': 0,
			'DEVOLUCION': 1
		};

		$scope.formState = $scope.formStates.DETALLE;

		$scope.getQuantity = function (item) {
				// console.log('item', item);
				var qty = false;

				for (var i = 0; i < $scope.sale.refunded_sale_details.length; i++) {
					if ($scope.sale.refunded_sale_details[i].product_barcode_id == item.product_barcode_id) { // OJO: quizá sería mejor comparar los id si ambos objetos lo tuvieran
						qty = $scope.sale.refunded_sale_details[i].quantity;
						break;
					}
				}
				
				if (qty === false) {
					return item.quantity;
				} else {
					return qty;
				}
			};

		$scope.initCurrentSalePoint = function () {
			// Asignar customer y saleman de acuerdo a sales
			$scope.sale.igv = parseFloat($scope.sale.igv);
			$scope.sale.total_amount = parseFloat($scope.sale.total_amount);
			$scope.sale.total_cash_amount = parseFloat($scope.sale.total_cash_amount);
			$scope.sale.credit_card_amount = parseFloat($scope.sale.credit_card_amount);
			$scope.sale.refund_count = parseFloat($scope.sale.refund_count);

			$scope.customer = {
				"id": $scope.sale.customer_id,
				"full_name": $scope.sale.customer,
				"id_number": $scope.sale.customer_doc,
				"type": $scope.sale.customer_type,
				"address": $scope.sale.customer_address,
				"verified": ($scope.sale.verified === 't')
			};

			$scope.saleman = {
				"id": $scope.sale.salesman_id,
				"full_name": $scope.sale.saleman,
				"code": ($scope.sale.salesman_id || '').zeros(4)
			};

			$scope.sale.sale_details.forEach(function (detail) {
				detail.refunded_quantity = detail.quantity - $scope.getQuantity(detail);
			});

			if ($scope.sale.voucher.indexOf('NOTA DE CREDITO') < 0 && $scope.sale.refund_count) {
				Session.setMessage('Algunos productos han sido devueltos. Para más detalles haga clic en el botón "Ver devoluciones".', 'warning', true);
			}
		};

		$scope.getSaleDetail = function (product_barcode_id) {
			for (var i = 0; i < $scope.sale.sale_details.length; i++) {
				if ($scope.sale.sale_details[i].product_barcode_id == product_barcode_id) {
					return $scope.sale.sale_details[i];
					break;
				}
			}

			return false
		};

		$scope.subTotal = function (detail) {
			return $window.checkPrecision(detail.quantity * detail.price);
		};

		$scope.print = function () {
			var voucherType;

			if ($scope.sale.voucher === 'TICKET') {
				voucherType = Sales.TICKET;
			} else if ($scope.sale.voucher === 'NOTA DE CREDITO') {
				voucherType = Sales.NOTA_DE_CREDITO;
			} else if ($scope.sale.voucher === 'BOLETA'){
				voucherType = Sales.BOLETA;
			} else if ($scope.sale.voucher === 'FACTURA'){
				voucherType = Sales.FACTURA;
			}

			Sales.printTicket(
				voucherType,
				false,
    			$scope.sale,
    			$scope.customer,
            	$scope.saleman,
            	$scope.sale.sale_details,
            	$scope.cardTypes,
            	null
			);
		};

		$scope.countAvailableForRefund = function () {
			var counter = 0;

			$scope.sale && $scope.sale.refunded_sale_details.forEach(function (detail) {
				counter += parseInt(detail.quantity);
			});

			return counter;
		};

		$scope.refund = function () {
			var modal = $window.bootbox.confirm({
				title: 'Nota de crédito' + ($scope.serie !== false ? ' N°' + $scope.serie.serie.zeros(4) + '-' + $scope.serie.serial_number.zeros(7) : ''),
				message: ($scope.serie === false ? `
					<div class="row m-b-lg">
						<div class="col-lg-2 col-lg-offset-6 text-right hidden-xs hidden-sm" style="padding-top: 5px">
			                N° de serie
			            </div>

						<div class="col-lg-4">
			                <div class="row">
			                	<div class="col-xs-5">
			                		<input name="serie" required type="text" class="form-control text-right">
			                	</div>
			                	<div class="col-xs-7">
			                		<input name="serial_number" pattern="^[0-9]*$" required type="text" class="form-control text-right">
			                	</div>
			                </div>
			            </div>
					</div>
					`
						: '') +
					`
					<div class="row">
						<div class="col-lg-12">
							<p>Seleccione los productos a devolver y especifique las cantidades.</p>
						</div>
					</div>

					<div class="table-responsive m-t">
						<table class="table b-t b-light table-hover">
							<thead ng-if="sale.sale_details.length">
	                            <tr>
	                                <th width="70" class="text-center">&nbsp;</th>
	                                <th class="text-center">Cód.</th>
	                                <th class="text-center">Descripción</th>
	                                <th class="text-center">Talla</th>
	                                <th width="100" class="text-center">Cant.</th>
	                                <th class="text-center">P.U.</th>
	                                <th class="text-center">Subtotal</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                        </tbody>
	                        <tfoot>
	                            <tr>
	                                <td class="text-right" colspan="6">
	                                    <strong>TOTAL</strong>
	                                </td>
	                                <td class="text-right" name="total">
	                                    0.00
	                                </td>
	                            </tr>
	                        </tfoot>
						</table>
					</div>
				`,
				size: 'large',
				backdrop: true,
				buttons: {
					confirm: {
						label: 'Devolver',
						className: 'btn-primary'
					},
					cancel: {
						label: 'Cancelar',
						className: 'btn-default'
					}
				},
				show: false,
				callback: function (yes) {
					if (yes) {
						var serie =	(modal.find('[name="serie"]').val().trim());
						var serial_number = parseInt(modal.find('[name="serial_number"]').val().trim());
						var data = {
							saleDetails: []
						};

						if (serie && serial_number && modal.find('[name="check"]:checked').length) {
							if ($scope.serie !== false && $scope.serie.serie == serie && $scope.serie.serial_number == serial_number) {
								// El sistema generará la serie automáticamente
								data.serie = false;
							} else {
								// Se debe guardar la serie ingresada
								data.serie = serie;
								data.serial_number = serial_number;
							}

							modal.find('[name="check"]:checked').each(function () {
								var tr = $(this).closest('tr');
								var row = $scope.getSaleDetail(tr.data('id'));

								if (row !== false) {
									row = angular.copy(row);
									row.product_id = row.id;
									row.id = row.product_barcode_id;
									row.qty = tr.find('[name="quantity"]').val();
									row.offer_price = row.price;
									row.description = row.product;
									row.company_id = $scope.sale.company_id;
									row.company_name = $scope.sale.company;

									/*row.size_id = 0;
									row.barcode = '';
									row.stock = 0;
									*/

									delete row.subtotal;
									
									data.saleDetails.push(row);
								}
							});

							var voucherData = Sales.getRecords( // Debe ser en singular porque es un sólo registro
				            	Sales.NOTA_DE_CREDITO,
				            	$scope.customer,
				            	{ id: '', full_name: '', code: '' },
				            	data.saleDetails,
				            	[],
				            	$scope.sale.id,
				            	data.serie !== false ? data.serie : null,
				            	data.serie !== false ? data.serial_number : null
				            );
							console.log("voucherData:", voucherData);
							modal.find('[data-bb-handler="confirm"]').attr('disabled', true);

				            Ajax.post($window.siteUrl('sales/save'), { sales: voucherData }).then(function (saleResponse) {
				            	var saleInfo = saleResponse.data;
				            	console.log('data', saleInfo.data);

				            	if (saleInfo.length === voucherData.length) { // Se guardaron todas las ventas
				            		voucherData.forEach(function (sale, saleIndex) {
				            			sale.serie = saleInfo[saleIndex].serie;
				            			sale.serial_number = saleInfo[saleIndex].serial;
				            			sale.reference = $scope.sale.voucher + ' N° ' + $scope.sale.serie.zeros(4) + '-' + $scope.sale.serial_number.zeros(7);
				            			//sale.printer_name = saleInfo[saleIndex].printer;
				            			//sale.printer_serial = saleInfo[saleIndex].printer_serial;
				            			sale.cashier = Auth.value('userName') + ' ' + Auth.value('userLastName');
				            			sale.date = $filter('date')(new Date(), 'dd/MM/yyyy');
				            			sale.time = $filter('date')(new Date(), 'HH:mm');
				            		});
				            		
				            		//var saleCompany = Settings.getCompanyOfBranch(sale.company_id, Auth.value('userBranch'));
				            		modal.one('hidden.bs.modal', function () {
				            			$scope.$apply(function () {
						            		Sales.printTicket(
						            			Sales.NOTA_DE_CREDITO,
						             			//'#' + saleCompany.company_name + '-' + sale.regime,
						             			false,
						            			voucherData,
						            			$scope.customer,
							                	$scope.saleman,
							                	data.saleDetails,
							                	[]
						            		);

						            		$route.reload();
						            		//$scope.reset();
						            		//$scope.formState = $scope.formStates.ENTRADA;
				            			});

				            		}).modal('hide');
				            	} else {
				            		console.log('saleInfo', saleInfo, '<length>', 'data', voucherData);

				            		Session.setMessage('Ocurrió un error, no se puede imprimir el voucher.', 'danger', true);
				            		
				            		modal.modal('hide');
				            	}
								// Llamada de Generaciòn de documento
								// Fin de llamada
								var sunatData = voucherData;
								var cuyito;
								var sale_details= [];
								sunatData.forEach(function (sale, saleIndex) {
									sale.operation_type = '0101';
									sale.voucher ='07';
									sale.date = $filter('date')(new Date(), 'yyyy-MM-dd');
									sale.time = $filter('date')(new Date(), 'HH:mm:ss');
									sale.sucursal_id = '000' + Auth.value('userBranch');
									sale.reference2 = $scope.sale.serie + '-' + $scope.sale.serial_number.zeros(8);
									sale.userDocType = (($scope.customer.doc_type) ? $scope.customer.doc_type : ($scope.docType == 'EMPRESA') ? "6" : "0"  );
									sale.idNumber = $scope.customer.id_number;
									sale.bussinessName = (($scope.customer.full_name) ? $scope.customer.full_name : "CLIENTES VARIOS");
									sale.igve = sale.igv.toFixed(2);
									sale.docType = $scope.customer.type;
									sale.sumTotValVenta = (sale.regime == 'ZOFRA') ? sale.total_amount.toFixed(2) : $window.checkPrecision(sale.total_amount / 1.18).toFixed(2);
									sale.letras = $window.numeroALetras(sale.total_amount, {
										plural: 'SOLES',
										singular: 'SOL',
										centPlural: 'centimos',
										centSingular: 'céntimo'
									});
									sale.sale_details.forEach(function (saleDetail){
										cuyito = data.saleDetails.find(function (detail) {
										return detail.id === saleDetail.product_barcode_id && !detail.pack_list_id;
										});
										saleDetail.code = cuyito.code;
										saleDetail.des = cuyito.description,
										saleDetail.regime = cuyito.regime,
										saleDetail.igv = ((cuyito.regime == 'ZOFRA') ? 0 : $window.checkPrecision((saleDetail.price/1.18)*0.18).toFixed(2) )
									});
								});

								Ajax.post($window.siteUrl('sales/sunat'), {invoices: sunatData}).then(function (sunatResponse) {
								}, function (err) {
								  Session.setMessage(err, 'danger', true);
								});
								//FIN FE
				            }, function (err) {
				            	Session.setMessage(err, 'danger', true);

				            	modal.modal('hide');
				            });

				            /*Sales.printTicket(
								voucherType,
								false,
				    			$scope.sale,
				    			$scope.customer,
				            	$scope.saleman,
				            	$scope.sale.sale_details,
				            	$scope.cardTypes
							);*/


							console.log('Se debe guardar', voucherData);
						} else {
							console.log('Está vacío');
						}

						return false;
					}
				}
			});

			$scope.edit = function () {

			};

			modal.on('shown.bs.modal', function () {
				modal.find('[name="serie"]').focus();
			});

			modal.on('show.bs.modal', function () {
				var items = [];
				var total = 0;

				function updateSubtotal(tr) {
					var index = tr.data('index');

					if (tr.find('[name="quantity"]').get(0).checkValidity()) {
						items[index].quantity = parseInt(tr.find('[name="quantity"]').val()) || 0;
					} else {
						items[index].quantity = 0;
					}

					var subtotal = $window.checkPrecision(items[index].quantity * items[index].price);

					total = $window.checkPrecision(total + subtotal - items[index].subtotal);

					items[index].subtotal = subtotal;

					tr.find('[name="subtotal"]').text(items[index].subtotal.toFixed(2));
					modal.find('table [name="total"]').text(total.toFixed(2));

					if (!total) {
						modal.find('[data-bb-handler="confirm"]').attr('disabled', true);
					} else {
						if ($scope.serie !== false || (modal.find('[name="serie"]').get(0).checkValidity() && modal.find('[name="serial_number"]').get(0).checkValidity())) {
							modal.find('[data-bb-handler="confirm"]').attr('disabled', false);
						} else {
							modal.find('[data-bb-handler="confirm"]').attr('disabled', true);
						}
					}
				}

				if ($scope.serie !== false) {
					modal.find('[name="serie"]').val($scope.serie.serie.zeros(4));
					modal.find('[name="serial_number"]').val($scope.serie.serial_number.zeros(7));
				}

				$scope.sale.sale_details.forEach(function (detail, index) {
					items.push({
						quantity: 0,
						price: parseFloat(detail.price),
						subtotal: 0
					});

					$(`
						<tr data-index="${index}" data-id="${detail.product_barcode_id}">
							<td class="v-middle text-center">
								<div class="checkbox i-checks m-t-none m-b-none">
									<label>
										<input type="checkbox" name="check" ${ !$scope.getQuantity(detail) ? 'disabled' : '' }><i></i>
									</label>
								</div>
							</td>
							<td class="text-center v-middle">${detail.code}</td>
							<td class="v-middle">${detail.product}</td>
							<td class="text-center v-middle">${detail.size}</td>
							<td class="text-center v-middle">
								<input type="number" name="quantity" min="1" max="${ $scope.getQuantity(detail) }" disabled class="form-control">
							</td>
							<td class="text-right v-middle" name="price">${parseFloat(detail.price).toFixed(2)}</td>
							<td class="text-right v-middle" name="subtotal">0.00</td>
						</tr>
					`).appendTo(modal.find('tbody'));
				});

				modal.find('[name="check"]').change(function (e) {
					var input = $(this).closest('tr').find('[name="quantity"]');

					input.attr('disabled', !$(this).is(':checked')).val(e.target.checked ? input.attr('max') : '');

					updateSubtotal($(this).closest('tr'));
				});

				modal.find('[name="quantity"]').on('input', function (e) {
					updateSubtotal($(this).closest('tr'));
				});

				modal.find('[name="serie"], [name="serial_number"]').on('input', function (e) {
					if (total && ($scope.serie !== false || (modal.find('[name="serie"]').get(0).checkValidity() && modal.find('[name="serial_number"]').get(0).checkValidity()))) {
						modal.find('[data-bb-handler="confirm"]').attr('disabled', false);
					} else {
						modal.find('[data-bb-handler="confirm"]').attr('disabled', true);
					}
				});

				modal.find('[data-bb-handler="confirm"]').attr('disabled', true);
			}).modal('show');
		};
	}
]);
