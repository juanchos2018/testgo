/* global URL, Blob */
window.angular.module('ERP').controller('TestingMigrationTransferCtrl', [
	'$scope', '$rootScope', '$window', '$filter', '$location', '$timeout', 'Page', 'Settings', 'FileHandler', 'Auth', 'Ajax', 'Session', '_baseUrl', '_siteUrl', '_bootbox', '_riot', '_$', '_moment',
	function ($scope, $rootScope, $window, $filter, $location, $timeout, Page, Settings, FileHandler, Auth, Ajax, Session, baseUrl, siteUrl, bootbox, riot, $, moment) {
		Page.title('Migración de traslados');

		$scope.stage = 'input';

		$scope.description = '';
		$scope.companyOrigin = Auth.value('userCompany');
		$scope.companyTarget = '';
		$scope.branchOrigin = Auth.value('userBranch');
		$scope.transferDate = moment().format('YYYY-MM-DD');
		
		$scope.active = true;
		$scope.superAdmin = false;
		$scope.shuttleReasonId = null;
		$scope.showShuttleReason = true;

		$scope.downloading = false;
		$scope.saving = false;
		$scope.confirmed = true;

		$scope.productExistences = {}; // Objeto que tiene como índices los códigos de productos

		$scope.file = {
			name: '',
			blob: null
		};

		$scope.setCode = function (n) {
			var ano = moment().format('YY')
			$scope.code = 'TR' + ano + '-' + (n || '1').zeros(5);
		};

		$scope.getTransferQty = function () {
			if (!$scope.data.length) {
				return 0;
			} else {
				return $scope.data.reduce(function (pre, cur) {
					return pre + parseInt(cur['CANT.'], 10);
				}, 0);
			}
		};

		$scope.getProductPurchaseQty = function (code) {
			if (!$scope.data.length) {
				return 0;
			} else {
				return $scope.data.reduce(function (pre, cur) {
					if (cur.CODIGO === code) {
						return pre + parseInt(cur['CANT.'], 10);
					} else {
						return pre;
					}
				}, 0);
			}
		};

		$scope.setSingleTable = function (table, records) {
			$scope[table] = records.split(',').map(function (record) {
				return record.split(':').pop().toUpperCase();
			});

			$scope[table + 'List'] = records;
		};

		$scope.changeFile = function (file) {
			var workerText = `
				importScripts('${ baseUrl('public/js/jszip/jszip.js') }');
				importScripts('${ baseUrl('public/js/xmlparser/simplexmlparser.js') }');

				self.onmessage = function (e) {
					if (e.data.constructor.name === 'ArrayBuffer') {
						try {
							var zip = new JSZip(e.data);
							var workbookFile = zip.file('xl/workbook.xml');

							if (workbookFile) {
								var workbook = parseXML(workbookFile.asText());

								if ('workbook.sheets.sheet[]' in workbook) {
									self.postMessage(workbook['workbook.sheets.sheet[]'].map(function (sheet) {
										return {
											id: sheet.sheetId,
											text: sheet.name
										};
									}));
								} else {
									self.postMessage([]);
								}
							} else {
								self.postMessage([]);
							}
						} catch (e) {
							self.postMessage([]);
						}
					}
				};
			`;

			var workerUrl = URL.createObjectURL(new Blob([workerText], {type: 'text/javascript'}));
			var worker = new Worker(workerUrl);

			FileHandler.toArrayBuffer(file).then(function (arraybuffer) {
				worker.postMessage(arraybuffer, [arraybuffer]);
			});

			worker.onmessage = function (e) {
				$scope.$apply(function () {
					$scope.sheets.length = 0;
					$scope.sheetSelected = '';

					if (e.data.length === 1) {
						$timeout(function () {
							$scope.changeSheet(e.data[0].text);
						});
					} else if (e.data.length > 1) {
						$scope.sheets = e.data;
						$scope.stage = 'input';
					} else {
						Session.setMessage('El fichero seleccionado no es un archivo de Excel válido.', 'danger', true);
					}
				});

				worker.terminate();
				URL.revokeObjectURL(workerUrl);
			};
		};

		$scope.sheets = [];
		$scope.sheetSelected = '';
		//$scope.dataSource = [];
		$scope.data = [];

		$scope.changeSheet = function (val) {
			$scope.sheetSelected = val;
		};

		$scope.$watch('sheetSelected', function (val) {
			if (val) {
				$scope.stage = 'loading';

				var worker = new Worker(baseUrl('bower_components/js-xlsx/xlsxworker2.js'));

				worker.onmessage = function (e) {
					switch (e.data.t) {
						case 'ready':
							break;
						case 'e':
							console.error('Error!!!', e.data.d);
							worker.terminate();
							break;
						default:
							var workbook = JSON.parse($window.xlsxHelpers.ab2str(e.data).replace(/\n/g,"\\n").replace(/\r/g,"\\r"));
							var sheet = workbook.Sheets[$scope.sheetSelected];
							var rows = $window.XLSX.utils.sheet_to_csv(sheet).split("\n");

							if (rows.length > 3) { // Tiene por lo menos 4 filas (a partir de la 4ta inician los datos)
								var headers = rows[2].split(',');

								if (
									headers.indexOf('CODIGO') > -1 &&
									headers.indexOf('TALLA') > -1 &&
									headers.indexOf('CANT.') > -1 &&
									headers.indexOf('COD. DE BARRAS') > -1 
								) { // Tiene el encabezado completo
									var regime = false, currency = false, hasPrices = false;//WRT

									var dataSource = rows.splice(3).map(function (row) {
										if (row.split(',').length === headers.length) { // Fila de datos
											var result = {};

											row.split(',').forEach(function (v, i) {
												result[headers[i]] = v;
											});

											if ( result.CODIGO && result.TALLA && result['CANT.'] ) { // Si tiene CODIGO y CANT.
												return result;
											} else {
												return null;
											}
										} else {
											return null;
										}
									}).filter(function (v) { return v !== null; });

									if (dataSource.length) {
										$scope.loadData(dataSource, regime, currency);
									
									} else {
										$scope.$apply(function () {
											$scope.stage = 'input';
											$scope.sheetSelected = '';
											Session.setMessage('La hoja de cálculo no tiene datos para importar.', 'danger', true);
										});
									}
								} else {
									$scope.stage = 'input';
									$scope.sheetSelected = '';

									if (headers.length < 3) {
										Session.setMessage('El archivo no tiene el formato correcto. Los encabezados se deben ubicar en la fila 3.', 'danger', true);
									} else {
										var missingHeaders = [];

										if (headers.indexOf('CODIGO') < 0) missingHeaders.push('Código');
										if (headers.indexOf('TALLA') < 0) missingHeaders.push('Talla');
										if (headers.indexOf('CANT.') < 0) missingHeaders.push('Cantidad');
										if (headers.indexOf('COD. DE BARRAS') < 0) missingHeaders.push('Código de barras');

										Session.setMessage('El archivo no tiene los encabezados completos. No se encontró: "' + missingHeaders.join('", "') + '".', 'danger', true);
									}

									$scope.$apply();
								}
							} else {
								$scope.$apply(function () {
									$scope.stage = 'input';
									$scope.sheetSelected = '';
									Session.setMessage('La hoja de cálculo no tiene el formato de la plantilla.', 'danger', true);
								});
							}

							worker.terminate();
					}
				};

				FileHandler.toBinaryString($scope.file.blob).then(function (binary) {
					var val = $window.xlsxHelpers.s2ab(binary);

					worker.postMessage(val[1], [val[1]]);
				});
			}
		});

		$scope.editField = function (title, name, row, items, context, applyToAll) {
			var value = row[name] || row;

			if (typeof items === 'string') {
				items = items.split(',').map(function (row) {
					return row.split(':').pop();
				});
			}

			items = $filter('orderBy')(items, 'toString()');

			var modal = bootbox.dialog({
				title: title,
				message: `
					<div class="row">
						<div class="col-lg-12">
							<div class="radio i-checks m-t-none">
								<label>
									<input type="radio" name="opt" value="1" checked>
									<i></i>
									Cambiar valor
								</label>
							</div>
						</div>
						<div class="col-lg-12" style="padding-left:40px">
							<input type="text" class="form-control" value="${ value }">
						</div>
						<div class="col-lg-12">
							<div class="radio i-checks">
								<label>
									<input type="radio" name="opt" value="2">
									<i></i>
									Reemplazar por registro
								</label>
							</div>
						</div>
						<div class="col-lg-12" style="padding-left:40px">
							<select class="form-control" disabled>
								<option>${ items.join('</option><option>') }</option>
							</select>
						</div>
					</div>
				` + (applyToAll !== true ? `
					<div class="row">
						<div class="col-lg-12 m-t">
							<div class="checkbox i-checks">
								<label>
									<input type="checkbox" name="all">
									<i></i>
									Aplicar a todas las coincidencias
								</label>
							</div>
						</div>
					</div>
				` : ''),
				buttons: {
					cancel: {
						label: 'Cancelar',
						className: 'btn-default'
					},
					ok: {
						label: 'Aceptar',
						className: 'btn-primary',
						callback: function () {
							var newVal = '';

							if (modal.find('[name="opt"]:checked').val() === '1') {
								newVal = modal.find('input[type="text"]').val();
							} else {
								newVal = modal.find('select').val();
							}

							if (modal.find('[name="all"]').is(':checked') || applyToAll === true) {
								$scope.data = $scope.data.map(function (data) {
									if (data[name] === value) {
										data[name] = newVal;
									}

									return data;
								});

								(context.parent || context).update({
									data: $scope.data
								});
							} else {
								row[name] = newVal;
								context.update();
							}
						}
					}
				},
				backdrop: true,
				onEscape: true,
				size: 'small',
				show: false
			});

			modal.on('shown.bs.modal', function () {
				modal.find('input[type="text"]').select().focus().on('input', function () {
					if (!this.value.length) {
						modal.find('[data-bb-handler="ok"]').prop('disabled', true);
					} else {
						modal.find('[data-bb-handler="ok"]').prop('disabled', false);
					}
				});
				modal.find('[name="opt"]').change(function () {
					if (this.checked) {
						if (this.value === '1') {
							modal.find('input[type="text"]').prop('disabled', false);
							modal.find('select').prop('disabled', true);
						} else {
							modal.find('input[type="text"]').prop('disabled', true);
							modal.find('select').prop('disabled', false);
						}
					}
				});
			}).modal('show');
		};

		$scope.changeCompany = function () { // Cuando se cambia la selección de la empresa
			if ($scope.stage === 'data') {
				$scope.stage = 'loading';
				$scope.loadData();
			}
		};

		$scope.loadData = function (dataSource, regime, currency) {
			if ($scope.companyOrigin && $scope.companyTarget) {
				dataSource = dataSource || $scope.data;

				var codes = [];

				if (regime) { // Si se cambia el régimen
					$scope.regime = regime;
				}

				if (currency && $scope.currency !== currency) {
					$scope.currency = currency;
				}

				dataSource.forEach(function (row) {
					if (codes.indexOf(row.CODIGO) < 0) {
						codes.push(row.CODIGO);
					}
				});
				Ajax.post(siteUrl('products/verify_for_transfer/' + $scope.companyOrigin + '/' + $scope.branchOrigin), {
					codes: codes.join(',')
				}).then(function (res) {

					$scope.data = dataSource.map(function (row) {
						var found = res.data.find(function (item) {
							return item.code === row.CODIGO && item.size === row.TALLA;
						});

						if (found !== undefined) {
						
							row.STOCK_O = parseInt(found.store_stock || 0, 10);
							row.stock_origin_id = found.stock_id;
							row.product_barcode_id = found.product_barcode_id;
							row.product_detail_id = found.product_detail_id;
							row.product_id = found.product_id;
							row.size_id = found.size_id;
						} else {
							found = res.data.find(function (item) {
								return item.code === row.CODIGO;
							});

							if (found !== undefined) {
								row.STOCK_O = 0;

								row.stock_origin_id = '';
								row.product_barcode_id = '';
								row.product_detail_id = found.product_detail_id;
								row.product_id = found.product_id;
								row.size_id = '';
							} else {
								
								row.STOCK_O = 0;

								row.stock_origin_id = '';
								row.product_barcode_id = '';
								row.product_detail_id = '';
								row.product_id = '';
								row.size_id = '';
							}
						}

						return row;
					});

				}, function (reason) {
					$scope.stage = 'input';
					$scope.sheetSelected = '';

					Session.setMessage('Ocurrió un error al verificar el stock de productos', 'danger', true);
					console.error('%cAjax error:', 'font-weight:bold', reason);
				});

				Ajax.post(siteUrl('products/verify_for_transfer/' + $scope.companyTarget + '/' + $scope.branchTarget), {
					codes: codes.join(',')
				}).then(function (res) {
					var oldData = $scope.data;

					$scope.productExistences = null; // Elimina el objeto anterior
					$scope.productExistences = {};

					res.data.forEach(function (item) {
						var store_stock = parseInt(item.store_stock || 0, 10);

						if (store_stock > 0) {
							if (item.code in $scope.productExistences) {
								$scope.productExistences[item.code].store_stock += store_stock;
							} else {
								$scope.productExistences[item.code] = {
									store_stock: store_stock,
								};
							}
						}
					});

					$scope.data = dataSource.map(function (row) {
						var found = res.data.find(function (item) {
							return item.code === row.CODIGO && item.size === row.TALLA;
						});

						if (found !== undefined) {
							row.STOCK_T = parseInt(found.store_stock || 0, 10);

							row.stock_target_id = found.stock_id;
							row.product_barcode_id = found.product_barcode_id;
							row.product_detail_id = found.product_detail_id;
							row.product_id = found.product_id;
							row.size_id = found.size_id;
						} else {
							found = res.data.find(function (item) {
								return item.code === row.CODIGO;
							});

							if (found !== undefined) {
								row.STOCK_T = 0;

								row.stock_target_id = '';
								row.product_barcode_id = '';
								row.product_detail_id = found.product_detail_id;
								row.product_id = found.product_id;
								row.size_id = '';
							} else {
								row.STOCK_T = 0;

								row.stock_target_id = '';
								row.product_barcode_id = '';
								row.product_detail_id = '';
								row.product_id = '';
								row.size_id = '';
							}
						}
						
						return row;
					});

					oldData.length = 0;

					$timeout(function () {
						$scope.stage = 'data';
						$scope.$apply();

						$scope.dataTags = riot.mount(document.querySelector('[ng-view] [data-stage="data"] riot-table'), 'riot-table', {
							data: $scope.data,
							sizes: $scope.sizes,
							editSize: function (e) {
								$scope.editField('Talla', 'TALLA', e.item.row, $scope.sizesList, this);
							},
							setQty: function (e) {
								e.item.row['CANT.'] = e.target.value;

								$scope.$apply();
							},
							setDescription: function (e) {
								e.item.row.DESCRIPCION = e.target.value;
							},
							deleteItem: function (e) {
								$scope.$apply(function () {
									$scope.data.splice($scope.data.indexOf(e.item.row), 1);

									if ($scope.data.length) {
										$scope.dataTags[0].update({
											data: $scope.data
										});
									} else {
										$scope.sheetSelected = '';
										$scope.stage = 'input';
									}
								});
							}
						});
					}, 1000);
				}, function (reason) {
					$scope.stage = 'input';
					$scope.sheetSelected = '';

					Session.setMessage('Ocurrió un error al verificar el stock de productos', 'danger', true);
					console.error('%cAjax error:', 'font-weight:bold', reason);
				});
			} else {
				$scope.$apply(function () {
					Session.setMessage('Debe seleccionar las sucursales.', 'danger', true);
				});
			}
		};

		$scope.getTable = function (items, title, name, group) {
			var records = '';

			items.forEach(function (record, index) {
				records += `
					<tr>
						<td class="text-center">${ index + 1 }</td>
						<td>${ record }</td>
						<td class="text-center">
							<a href="#" data-field-title="${ title }" data-field="${ name }" data-field-items="${ group }">Editar</a>
						</td>
					</tr>
				`;
			});

			return `
				<table class="table">
					<thead>
						<tr>
							<th style="width:80px" class="text-center">N°</th>
							<th class="text-center">Descripción</th>
							<th style="width:120px" class="text-center">Acción</th>
						</tr>
					</thead>
					<tbody>
						${ records }
					</tbody>
				</table>
			`;
		};

		$scope.getInvoicesTable = function (items) {
			var records = '';

			items.forEach(function (item, index) {
				records += `
					<tr>
						<td class="text-center">${ index + 1 }</td>
						<td>N° ${ item.number }</td>
						<td class="text-center">${ item.date }</td>
						<td class="text-right">${ item.amount }</td>
					</tr>
				`;
			});

			return `
				<table class="table">
					<thead>
						<tr>
							<th style="width:80px" class="text-center">N°</th>
							<th class="text-center">Serie</th>
							<th style="width:100px" class="text-center">Fecha</th>
							<th style="width:120px" class="text-center">Cant.</th>
						</tr>
					</thead>
					<tbody>
						${ records }
					</tbody>
				</table>
			`;
		};

		$scope.getProductsTable = function (items) {
			var records = '';

			items.forEach(function (record, index) {
				records += `
					<tr>
						<td class="text-center">${ index + 1 }</td>
						<td>${ record.code }</td>
						<td>${ record.description }</td>
					</tr>
				`;
			});

			return `
				<table class="table">
					<thead>
						<tr>
							<th style="width:80px" class="text-center">N°</th>
							<th style="width:150px" class="text-center">Código</th>
							<th class="text-center">Descripción</th>
						</tr>
					</thead>
					<tbody>
						${ records }
					</tbody>
				</table>
			`;
		};

		$scope.downloadData = function () {
			$scope.downloading = true;

			FileHandler.get(baseUrl('public/files/templates/purchase_full.xlsx'), 'arraybuffer').then(function (file) {
				var template = new XlsxTemplate(file, { autoClose: true });
				var xlsxData = $scope.data.map(function (item) {
					//item.unitExpenditure = $scope.getUnitExpenditure(item).toFixed(2);
					item.cost = $scope.getCost(item);
					item.price = $scope.getPrice(item);
					item.offerPrice = $scope.getOfferPrice(item);

					return item;
				});

				template.putData(xlsxData, 'A4:X4', function (data) {
					return data.map(function (item, index) {
						var row = [];

						row.push(index + 1); // A
						row.push(item.CODIGO); // B
						row.push(item.TALLA); // C
						row.push(item['CANT.'] || 0); // D
						row.push(item['COD. DE BARRAS'] || null); // E
						row.push(item.LINEA || null); // F
						row.push(item.GENERO || null); // G
						row.push(item.EDAD || null); // H
						row.push(item.DEPORTE || null); // I
						row.push(item.MARCA || null); // J
						row.push(item.TIPO || null); // K
						row.push(item.REGIMEN || null); // L
						row.push(item['D. SALIDA'] || null); // M
						row.push(item.DESCRIPCION || null); // N
						row.push(item['N° GUIA'] || null); // O
						row.push(item['FECHA DE GUIA'] || null); // P
						row.push(item['MONEDA EN GUIA'] || null); // Q
						row.push(item['C.U. EN GUIA'] || 0); // R
						row.push(null); // S
						row.push(item.unitExpenditure); // T
						row.push(item.COSTO.toFixed(2)); // U
						row.push(item.cost); // V
						row.push(item.price); // W
						row.push(item.offerPrice); // X

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

		$scope.finish = function () {
			if ($scope.data.filter(function (value) {
				return (parseInt(value['CANT.'], 10) || 0) < 1;
			}).length) {
				bootbox.dialog({
					title: 'Se encontraron registros no válidos',
					message: 'Algunos registros tienen stock cero.',
					buttons: {
						ok: {
							label: 'Aceptar',
							className: 'btn-danger'
						}
					}
				});
			} else if($scope.data.filter(function (value) {
				return !value.product_id && !value.DESCRIPCION.length;
			}).length) {
				bootbox.dialog({
					title: 'Se encontraron registros no válidos',
					message: 'Algunos productos nuevos no tienen descripción.',
					buttons: {
						ok: {
							label: 'Aceptar',
							className: 'btn-danger'
						}
					}
				});
			} else if ($scope.data.filter(function (value) {
				return !(/^\d+\-\d+$/.test(value['N° GUIA']));
			}).length) {
				bootbox.dialog({
					title: 'Se encontraron datos incorrectos',
					message: 'Algunos registros no tienen N° de GUIA en formato válido.',
					buttons: {
						ok: {
							label: 'Aceptar',
							className: 'btn-danger'
						}
					}
				});
			} else if ($scope.data.filter(function (value) {
				return !(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value['FECHA DE GUIA']));
			}).length) {
				bootbox.dialog({
					title: 'Se encontraron datos incorrectos',
					message: 'Algunas fechas de GUIA no tienen un formato válido (dd/mm/yyyy).',
					buttons: {
						ok: {
							label: 'Aceptar',
							className: 'btn-danger'
						}
					}
				});
			} else {
				var newProducts = [];
				var newSizes = [];
				var newCategories = [];
				var newGenders = [];
				var newAges = [];
				var newUses = [];
				var newBrands = [];
				var newSubcategories = [];
				var newInvoices = [];

				$scope.data.forEach(function (item) {
					if (!item.product_id) {
						if (!newProducts.find(function (product) {
							return product.code === item.CODIGO;
						})) {
							newProducts.push({
								code: item.CODIGO,
								description: item.DESCRIPCION
							});
						}
					}

					var invoiceFound = newInvoices.find(function (invoice) {
						return invoice.number === item['N° GUIA'];
					});

					if (invoiceFound !== undefined) {
						invoiceFound.amount += parseInt(item['CANT.'], 10);
					} else {
						newInvoices.push({
							number: item['N° GUIA'],
							date: moment(item['FECHA DE GUIA'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
							amount: parseInt(item['CANT.'], 10)
						});
					}

					if (item.TALLA && $scope.sizes.indexOf(item.TALLA.toUpperCase()) < 0 && newSizes.indexOf(item.TALLA) < 0) {
						newSizes.push(item.TALLA);
					}

				});

				if (newInvoices.length || newProducts.length || newSizes.length ||  newCategories.length || newGenders.length || newAges.length || newUses.length || newBrands.length || newSubcategories.length) {
					var panelHeading = '', panelBody = '', params = {};

					if (newInvoices.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="invoices">Guias Remisión (${ newInvoices.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="invoices">
								${ $scope.getInvoicesTable(newInvoices) }
							</div>
						`;
					}

					if (newProducts.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="products">Productos (${ newProducts.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="products">
								${ $scope.getProductsTable(newProducts) }
							</div>
						`;
					}

					if (newSizes.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="sizes">Tallas (${ newSizes.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="sizes">
								${ $scope.getTable(newSizes, 'Talla', 'TALLA', 'sizes') }
							</div>
						`;

						params.sizes = newSizes;
					}

					var modal = bootbox.dialog({
						title: 'Advertencia',
						message: `
							<div class="row">
								<div class="col-lg-12 m-b">
									Se encontraron registros desconocidos que serán almacenados como nuevos.
								</div>
								<div class="col-lg-12">
									<section class="panel panel-default">
										<header class="panel-heading">
											<ul class="nav nav-tabs" style="white-space:nowrap;overflow-x:auto;overflow-y:hidden">
												${ panelHeading }
											</ul>
										</header>
										<div class="panel-body">
											<div class="tab-content">
												${ panelBody }
											</div>
										</div>
									</section>
								</div>
							</div>
						`,
						buttons: {
							cancel: {
								label: 'Cancelar',
								className: 'btn-default'
							},
							ok: {
								label: 'Continuar',
								className: 'btn-danger',
								callback: function () {
									if (Object.keys(params).length) {
										modal.find('[data-bb-handler="ok"]').prop('disabled', true);

										Ajax.post(siteUrl('products/save_single_tables'), params).then(function (res) {
											if (res.data.sizes.length) {
												$scope.sizesList += ',' + res.data.sizes;
											}

											modal.one('hidden.bs.modal', function () {
												$scope.save(newInvoices);
											});
										}, function (reason) {
											Session.setMessage('Ocurrió un error al guardar los nuevos registros.', 'danger', true);
											console.error('%cAjax error:', 'font-weight:bold', reason);
										}).finally(function () {
											modal.modal('hide');
										});

										return false;
									} else {
										$scope.save(newInvoices);
									}
								}
							}
						},
						backdrop: true,
						onEscape: true,
						show: false
					});

					modal.on('show.bs.modal', function () {
						modal.find('[data-target]').mousedown(function (e) {
							e.preventDefault();

							modal.find('.nav > .active, .tab-pane.active').removeClass('active');
							$(this).parent().addClass('active');
							modal.find('[data-tab="' + $(this).data('target') + '"]').addClass('active');
						});

						modal.find('[data-field]').click(function () {
							var anchor = $(this);

							modal.one('hidden.bs.modal', function () {
								if ($scope.dataTags.length) {
									$scope.editField(anchor.data('fieldTitle'), anchor.data('field'), anchor.parent().prev().text(), $scope[anchor.data('fieldItems')], $scope.dataTags[0], true);
								}
							}).modal('hide');
						});
					}).modal('show');
				} else {
					$scope.save();
				}
			}
		};

		$scope.save = function (newInvoices) {
			$scope.saving = true;

			var transform = function (item) {
				var parts = item.split(':');

				return {
					id: parts[0] || 0,
					description: parts[1] || ''
				};
			};

			var finder = function (description) {
				return function (item) {
					return item.description.toUpperCase() === description.toUpperCase();
				};
			};

			var sizes = $scope.sizesList.split(',').map(transform);
				
			Ajax.post(siteUrl('testing/save_transfer'), {
				transfer_date: $scope.transferDate,
				total_qty: $scope.getTransferQty(),
				company_origin_id: $scope.companyOrigin,
				company_target_id: $scope.companyTarget,
				branch_origin_id: $scope.branchOrigin,
				branch_target_id: $scope.branchTarget,
				shuttle_reason_id: $scope.shuttleReasonId,
				confirmed: $scope.confirmed ? 't' : 'f',
				details: $scope.data.map(function (detail) {
					return {
						quantity: detail['CANT.'],
						invoice: detail['N° GUIA'],
						product_code: detail.CODIGO,
						product_size_id: (sizes.find(finder(detail.TALLA)) || {}).id || '',
						product_barcode: detail['COD. DE BARRAS'] ? detail['COD. DE BARRAS'] + ' ' : '',
						product_detail_id: detail.product_detail_id || '',
						product_barcode_id: detail.product_barcode_id || '',
						stock_id: detail.stock_origin_id || '',
						stock_target_id : detail.stock_target_id || '' 
					};
				}),
				guides: newInvoices

			}).then(function (res) {
				if (res.data.ok) {
					Session.setMessage('Se guardó el registro correctamente');
					$location.path('transfers');
				} else {
					Session.setMessage(res.data.error || 'Ocurrió un error', 'danger', true);
				}
			}, function (reason) {
				Session.setMessage(reason || 'Ocurrió un error', 'danger', true);
			}).finally(function () {
				$scope.saving = false;
			});
			
		};
	}
]);
