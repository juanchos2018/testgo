window.angular.module('ERP').controller('PurchaseOrdersDetailCtrl', [
	'$scope', '$rootScope', '$window', '$filter', '$location', '$timeout', 'Page', 'Settings', 'FileHandler', 'Ajax', 'Session', '_baseUrl', '_siteUrl', '_bootbox', '_riot', '_$', '_moment',
	function ($scope, $rootScope, $window, $filter, $location, $timeout, Page, Settings, FileHandler, Ajax, Session, baseUrl, siteUrl, bootbox, riot, $, moment) {
		Page.title('Detalle de pedido');

		$scope.description = '';
		$scope.company = '';
		$scope.paymentDate = '';
		$scope.startDate = '';
		$scope.endDate = '';
		$scope.active = false;

		$scope.supplierId = null;
		$scope.showSupplier = true;

		$scope.downloading = false;

		$scope.setDetail = function (detail) {
			$scope.id = detail.id;
			$scope.code = detail.code;
			$scope.description = detail.description;
			$scope.company = detail.company_id;
			$scope.supplierId = detail.supplier_id;
			$scope.active = (detail.active === 't');

			detail.paid_date && ($scope.paymentDate = moment(detail.paid_date).format('DD/MM/YYYY'));
			detail.start_date && ($scope.startDate = moment(detail.start_date).format('DD/MM/YYYY'));
			detail.finish_date && ($scope.endDate = moment(detail.finish_date).format('DD/MM/YYYY'));

			$scope.data = detail.details.map(function (row) {
				return {
					'CODIGO': row.code,
					'CANT.': row.quantity,
					'STOCK': row.store_stock,
					'COSTO_FACTURA': parseFloat(row.invoice_cost),
					'FACTURA_COSTO': (row.invoice_currency === 'D' ? '$' : 'S/'),
					'COSTO': parseFloat(row.cost),
					'MONEDA_COSTO': (row.cost_currency === 'D' ? '$' : 'S/'),
					'DESCRIPCION': row.description,
					'LINEA': row.category,
					'GENERO': row.gender,
					'EDAD': row.age,
					'DEPORTE': row.use,
					'MARCA': row.brand,
					'TIPO': row.subcategory,
					'REGIMEN': row.regime,
					'has_stock': (row.store_stock && row.store_stock.length),
					'product_id': row.product_id,
					'product_detail_id': row.product_detail_id,
					'arrived_quantity': row.arrived_quantity
				};
			});

			$scope.$apply();

			$scope.dataTags = riot.mount(document.querySelector('[ng-view] riot-table'), 'riot-table', {
				data: $scope.data
			});
		};

		$scope.data = [];

		$scope.downloadData = function () {
			$scope.downloading = true;

			FileHandler.get(baseUrl('public/files/templates/purchase_order_stock.xlsx'), 'arraybuffer').then(function (file) {
				var template = new XlsxTemplate(file, { autoClose: true });

				template.putData($scope.data, 'A4:J4', function (data) {
					return data.map(function (item, index) {
						var row = [];

						row.push(index + 1); // A
						row.push(item.CODIGO); // B
						row.push(item['CANT.'] || 0); // C
						row.push(item.has_stock ? item.STOCK : null); // D
						row.push(item.product_detail_id ? item.COSTO_FACTURA || 0 : null); // E
						row.push(item.product_detail_id ? item.COSTO || 0 : null); // F
						row.push(item.DESCRIPCION || null); // G
						row.push(item.LINEA || null); // H
						row.push(item.GENERO || null); // I
						row.push(item.EDAD || null); // J
						row.push(item.DEPORTE || null); // K
						row.push(item.MARCA || null); // L
						row.push(item.TIPO || null); // M
						row.push(item.REGIMEN || null); // N

						return row;
					});
				});

				template.on('build', function (blob) {
					var supplierChooser = $("erp-supplier-chooser select");
					var filename = 'pedido_';

					if (supplierChooser.val() && supplierChooser.select2('data').length) {
						filename += supplierChooser.select2('data')[0].text.toLowerCase().replace(/\W/gi, '_');
					} else {
						filename += $scope.code.toLowerCase();
					}

					filename += '_' + moment().format('YYYY-MM-DD_HHmmss') + '.xlsx';

					FileHandler.download(blob, filename);

					$scope.$apply(function () {
						$scope.downloading = false;
					});
				});

				template.build();
			});
		};

		$scope.delete = function () {
			bootbox.confirm({
				title: '¿Está seguro?',
				message: 'Está a punto de eliminar "' + $scope.description + '", esta acción no podrá deshacerse y podría afectar a otros registros vinculados.',
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
						$.post(siteUrl('purchase_orders/delete'), { id: $scope.id }, function (res) {
							if ('ok' in res) {
								$scope.$apply(function () {
									Session.setMessage('El registro se eliminó correctamente');
									$location.path('purchase-orders');
								});
							} else {
								$scope.$apply(function () {
									Session.setMessage('Ocurrió un error', 'danger', true);
								});
							}
						});
					}
				}
			});
		};
	}
]);
