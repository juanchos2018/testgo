window.angular.module('ERP').controller('PurchasesDetailCtrl', [
	'$scope', '$rootScope', '$window', '$filter', '$location', '$timeout', 'Page', 'Settings', 'FileHandler', 'Ajax', 'Session', '_baseUrl', '_siteUrl', '_bootbox', '_riot', '_$', '_moment',
	function ($scope, $rootScope, $window, $filter, $location, $timeout, Page, Settings, FileHandler, Ajax, Session, baseUrl, siteUrl, bootbox, riot, $, moment) {
		Page.title('Detalle de compra');

		$scope.description = '';
		$scope.company = '';
		$scope.registerDate = '';
		$scope.startDate = '';
		$scope.endDate = '';
		$scope.active = false;

		$scope.supplierId = null;
		$scope.showSupplier = true;

		$scope.downloading = false;

		$scope.setDetail = function (detail) {
			console.log(detail);
			$scope.id = detail.id;
			$scope.code = detail.code;
			$scope.description = detail.description;
			$scope.company = detail.company_id;
			$scope.supplierId = detail.supplier_id;
			$scope.active = (detail.active === 't');

			detail.registered_at && ($scope.registerDate = moment(detail.registered_at).format('DD/MM/YYYY'));
			detail.start_date && ($scope.startDate = moment(detail.start_date).format('DD/MM/YYYY'));
			detail.finish_date && ($scope.endDate = moment(detail.finish_date).format('DD/MM/YYYY'));
			
			$scope.data = detail.details.map(function (row) {
				return {
					'CODIGO': row.code,
					'TALLA' : row.size,
					'CANT.': row.quantity,
					'STOCK': row.store_stock,
					'COSTO_FACTURA': parseFloat(row.invoice_cost),
					'MONEDA_FACTURA': (row.invoice_currency === 'D' ? '$' : 'S/'),
					'COSTO': parseFloat(row.cost),
					'MONEDA_COSTO': (row.cost_currency === 'D' ? '$' : 'S/'),
					'CODIGO_DE_BARRA': row.old_barcode,
					'DESCRIPCION': row.description,
					'LINEA': row.category,
					'GENERO': row.gender,
					'EDAD': row.age,
					'DEPORTE': row.use,
					'MARCA': row.brand,
					'TIPO': row.subcategory,
					'REGIMEN': row.regime,
					'D.S.': row.output_statement,
					'has_stock': (row.store_stock && row.store_stock.length),
					'product_id': row.product_id,
					'product_detail_id': row.product_detail_id,
					'FACTURA': row.invoice_number,
					'FECHA_FACTURA': moment(row.invoice_date).format('DD/MM/YYYY'),
					'PVP': parseFloat(row.price),
					'POFERTA': parseFloat(row.offer_price)
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

			FileHandler.get(baseUrl('public/files/templates/purchase_stock.xlsx'), 'arraybuffer').then(function (file) {
				var template = new XlsxTemplate(file, { autoClose: true });
		
				template.putData($scope.data, 'A4:N4', function (data) {
					return data.map(function (item, index) {
						var row = [];

						row.push(index + 1); // A
						row.push(item.CODIGO); // B
						row.push(item.TALLA);//C
						row.push(parseInt(item['CANT.'],10) || 0); // D
						row.push(item.CODIGO_DE_BARRA || null) //E 
						row.push(item.has_stock ? parseInt(item.STOCK,10) : null); // F
						row.push(item.LINEA || null); // G
						row.push(item.DESCRIPCION || null); // H
						row.push(item.GENERO || null); // I
						row.push(item.EDAD || null); // J
						row.push(item.DEPORTE || null); // K
						row.push(item.MARCA || null); // L
						row.push(item.TIPO || null); // M
						row.push(item.REGIMEN || null); // N
						row.push(item['D.S.'] || null); // O
						row.push(item.FACTURA); // P
						row.push(item.FECHA_FACTURA) // Q
						row.push(item.MONEDA_FACTURA) // R
						row.push(item.product_detail_id ? item.COSTO_FACTURA || 0 : null); // S
						row.push(item.product_detail_id ? item.COSTO || 0 : null); // T
						row.push(item.PVP); //U
						row.push(item.POFERTA); //V
						
						return row;
					});
				});

				template.on('build', function (blob) {
					var supplierChooser = $("erp-supplier-chooser select");
					var filename = 'compra_';

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
						$.post(siteUrl('purchases/delete'), { id: $scope.id }, function (res) {
							if ('ok' in res) {
								$scope.$apply(function () {
									Session.setMessage('El registro se eliminó correctamente');
									$location.path('purchases');
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
