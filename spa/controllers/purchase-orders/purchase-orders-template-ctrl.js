window.angular.module('ERP').controller('PurchaseOrdersTemplateCtrl', [
	'$scope', '$filter', '$window', 'Page', 'FileHandler', 'Ajax', 'Auth', '_baseUrl', '_siteUrl', '_bootbox', '_$', '_moment',
	function ($scope, $filter, $window, Page, FileHandler, Ajax, Auth, baseUrl, siteUrl, bootbox, $, moment) {
		Page.title('Plantilla de pedidos');

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

		$scope.company = '';
		$scope.regime = '';
		// $scope.group = '';
		$scope.onlyActive = true;
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
			return 'pedido_' + moment().format('YYYY-MM-DD_HHmmss') + '.xlsx';
		};

		$scope.downloadBlank = function (e) {
			e.target.setAttribute('download', $scope.getFileName());
		};

		$scope.generate = function () {
			var templateData = {
				active: $scope.onlyActive ? '1' : '0'
			};

			// if ($scope.groupShown) {
			// 	templateData.group = $scope.group;
			// }

			if ($scope.companyShown) {
				templateData.company = $scope.company;
			}

			if ($scope.filterShown && $scope.filters.length) {
				templateData.filters = {};

				$scope.filters.forEach(function (filter) {
					templateData.filters[filter.key.id] = filter.values.map(function (item) {
						return item.id;
					});
				});
			}

			if ($scope.regimeShown) {
				templateData.regime = $scope.regime;
			}

			$scope.downloading = true;

			Ajax.post(siteUrl('purchase_orders/data_for_template'), templateData).then(function (res) {
				var data = res.data;

				if (data.ok) {
					if (data.items.length) {
						FileHandler.get(siteUrl('purchase_orders/file_for_template/' /*+ (templateData.group ? '?group=' + templateData.group : '')*/), 'arraybuffer').then(function (file) {
							var template = new XlsxTemplate(file, { autoClose: true });

							template.putData( data.items, 'A4:J4', (function (group) {
								if (!group) {
									return function (data) {
										var xlsxData = [];

										data.forEach(function (row, index) {
											xlsxData.push([
												index + 1, // A
												row.code, // B
												null, // C
												row.line, // D
												row.gender, // E
												row.age, // F
												row.use, // G
												row.brand, // H
												row.type, // I
												row.regime, // J
												row.description // K
											]);
										});

										return xlsxData;
									};
								} else if (group === 'categories') {
									return function (data) {
										var xlsxData = {};
										var xlsxIndex = {};

										data.forEach(function (row, index) {
											if (!(row.line in xlsxData)) {
												xlsxData[row.line] = [];
												xlsxIndex[row.line] = 0;
											}

											xlsxData[row.line].push([
												++xlsxIndex[row.line], // A
												row.code, // B
												null, // C
												row.line, // D
												row.gender, // E
												row.age, // F
												row.use, // G
												row.brand, // H
												row.type, // I
												row.regime, // J
												row.description // K
											]);
										});

										return xlsxData;
									};
								} else if (group === 'brands') {
									return function (data) {
										var xlsxData = {};
										var xlsxIndex = {};

										data.forEach(function (row, index) {
											if (!(row.brand in xlsxData)) {
												xlsxData[row.brand] = [];
												xlsxIndex[row.brand] = 0;
											}

											xlsxData[row.brand].push([
												++xlsxIndex[row.brand], // A
												row.code, // B
												null, // C
												row.line, // D
												row.gender, // E
												row.age, // F
												row.use, // G
												row.brand, // H
												row.type, // I
												row.regime, // J
												row.description // K
											]);
										});

										return xlsxData;
									};
								}
							})(false) ); //templateData.group

							template.on('build', function (blob) {
								FileHandler.download(blob, $scope.getFileName());

								$scope.$apply(function () {
									$scope.downloading = false;
								});
							});

							// template.on('progress', function (percent) {
							// 	console.log('%cPROGRESO', 'background:yellow;color:blue;font-size:3em', percent);
							// });

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
							title: 'No se encontraron coincidencias',
							message: 'Ningún registro cumple las condiciones ingresadas.',
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
						message: 'No se pudo obtener datos.',
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
	}
]);
