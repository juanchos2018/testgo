/* global XlsxTemplate */
window.angular.module('ERP').controller('PurchasesTemplateCtrl', [
	'$scope', '$filter', '$window', 'Page', 'FileHandler', 'Ajax', 'Auth', '_baseUrl', '_siteUrl', '_bootbox', '_$', '_moment',
	function ($scope, $filter, $window, Page, FileHandler, Ajax, Auth, baseUrl, siteUrl, bootbox, $, moment) {
		Page.title('Plantilla de compras');

		$scope.filterKeys = [
			{ id: 'categories', text: 'Línea' },
			{ id: 'uses', text: 'Deporte' },
			{ id: 'ages', text: 'Edad' },
			{ id: 'genders', text: 'Género' },
			{ id: 'brands', text: 'Marca' },
			{ id: 'subcategories', text: 'Tipo' }
		];

		$scope.filterItems = []; // Listado de líneas, deportes, edades, etc. según corresponda en filterKeys
		$scope.filters = [];

		$scope.filter = {
			key: '',
			values: []
		};

		$scope.source = 'purchase_order';

		$scope.purchaseOrder = {
			id: '',
			onlyStock: true,
			supplier: '',
			company: ''
		};

		$scope.purchaseOrderSelect2 = {
			placeholder: '- Seleccione -',
			allowClear: true,
			data: [],
            templateResult: function (product) {
            	if (!product.id) {
                    return product.text;
                } else {
                    return $(`
                        <div class="row">
                            <div class="col-md-8">
                                ${ product.text }
                            </div>
                            <div class="col-md-4 hidden-sm hidden-xs text-right">
                            	<i>De:</i> ${ product.supplier }
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-8">
                            	Cód. ${ product.code }
                            </div>
                            <div class="col-md-4 hidden-sm hidden-xs text-right">
                            	<i>Para:</i> ${ product.company }
                            </div>
                        </div>
                    `);
                }
            },
            templateSelection: function (product) {
            	if (!product.id) {
            		return product.text;
            	} else {
	                return product.code + ' - ' + product.text;
            	}
            }
		};

		$scope.company = '';
		$scope.regime = '';
		// $scope.group = '';
		$scope.onlyActive = true;
		$scope.onlyStock = false;
		$scope.companyShown = false;
		$scope.regimeShown = false;

		$scope.downloading = false;

		$scope.getFilterKeys = function () {
			if (!$scope.filters.length) {
				return $scope.filterKeys;
			} else {
				return $scope.filterKeys.filter(function (item) {
					return $scope.filters.find(function (filter) {
						return filter.key.id == item.id;
					}) === undefined;
				});
			}
		};

		$scope.changeFilterKey = function (e) {
			var key = $scope.filter.key;

			$scope.filter.values.length = 0;
			$scope.filter.values = [];
			$scope.filterItems.length = 0;

			if (key) {
				Ajax.get(siteUrl(key + '/simple_list')).then(function (res) {
					$scope.filterItems = res.data;
				});;
			}
		};

		$scope.addFilter = function () {
			if ($scope.filter.key.length && $scope.filter.values.length) {
				$scope.filters.push({
					key: $scope.filterKeys.find(function (item) {
						return item.id == $scope.filter.key;
					}),
					values: $scope.filter.values.map(function (id) {
						return $scope.filterItems.find(function (item) {
							return item.id == id;
						});
					})
				});

				$scope.filter.key = '';
			}
		};

		$scope.removeFilter = function (index) {
			$scope.filters.splice(index, 1);
		};

		$scope.getFileName = function () {
			return 'compra_' + ($scope.source === 'purchase_order' && $scope.purchaseOrder.id ? $scope.purchaseOrder.company.toLowerCase() + '_' + $scope.purchaseOrder.supplier.toLocaleLowerCase() + '_' : '') + moment().format('YYYY-MM-DD_HHmmss') + '.xlsx';
		};

		$scope.downloadBlank = function (e) {
			e.target.setAttribute('download', $scope.getFileName());
		};

		$scope.generate = function () {
			var templateData;

			if ($scope.source === 'purchase_order' && $scope.purchaseOrder.id) {
				templateData = {
					id: $scope.purchaseOrder.id,
					stock: $scope.purchaseOrder.onlyStock ? '1' : '0'
				};
			} else if ($scope.source === 'products') {
				templateData = {
					stock: $scope.onlyStock ? '1' : '0',
					active: $scope.onlyActive ? '1' : '0'
				};

				if ($scope.companyShown) {
					templateData.company = $scope.company;
				}

				if ($scope.regimeShown) {
					templateData.regime = $scope.regime;
				}

				if ($scope.filterShown && $scope.filters.length) {
					templateData.filters = {};

					$scope.filters.forEach(function (filter) {
						templateData.filters[filter.key.id] = filter.values.map(function (item) {
							return item.id;
						});
					});
				}
			}

			$scope.downloading = true;

			Ajax.post(siteUrl('purchases/data_for_template/' + $scope.source), templateData).then(function (res) {
				var data = res.data;

				if (data.ok) {
					if (data.items.length) {
						FileHandler.get(baseUrl('public/files/templates/purchase_single.xlsx'), 'arraybuffer').then(function (file) {
							var template = new XlsxTemplate(file, { autoClose: true });

							template.putData( data.items, 'A4:N4', function (data) {
								return data.map(function (row, index) {
									return [
										index + 1, // A
										row.code, // B
										row.size, // C
										null, // D
										row.barcode, // E
										row.line, // F
										row.gender, // G
										row.age, // H
										row.use, // I
										row.brand, // J
										row.type, // K
										row.regime, // L
										row.output_statement, // M
										row.description // N
									];
								});
							});

							template.on('build', function (blob) {
								FileHandler.download(blob, $scope.getFileName());

								$scope.$apply(function () {
									$scope.downloading = false;
								});
							});

							template.build();
						}, function (reason) {
							bootbox.alert({
								title: 'Ocurrió un error',
								message: 'No se pudo generar la plantilla en formato Excel.',
								buttons: {
									'ok': {
										label: 'Aceptar',
										className: 'btn-danger'
									}
								}
							});

							$scope.$apply(function () {
								$scope.downloading = false;
							});
						});
					} else {
						bootbox.alert({
							title: 'No se encontraron registros',
							message: $scope.purchaseOrder.onlyStock ? 'Ningún producto del pedido se encuentra pendiente de llegada.' : 'Ocurrió un error. Vuelva a intentarlo más tarde.',
							buttons: {
								'ok': {
									label: 'Aceptar'
								}
							}
						});

						$scope.downloading = false;
					}
				} else {
					bootbox.alert({
						title: 'Ocurrió un error',
						message: 'No se encontraron los datos solicitados.',
						buttons: {
							'ok': {
								label: 'Aceptar',
								className: 'btn-danger'
							}
						}
					});

					$scope.downloading = false;
				}
			});
		};

		$scope.$on('$viewContentLoaded', function () {
			$('select[ng-model="purchaseOrder.id"]').change(function (e) {
				var data = $(this).select2('data');

				if (data.length && data[0].id) {
					$scope.$apply(function () {
						$scope.purchaseOrder.supplier = data[0].supplier;
						$scope.purchaseOrder.company = data[0].company;
					});
				}
		});
		});
	}
]);
