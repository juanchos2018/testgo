/* global URL, Blob */

window.angular.module('ERP').controller('TestingMigrationPurchaseCtrl', [
	'$scope', '$rootScope', '$window', '$filter', '$location', '$timeout', 'Page', 'Settings', 'FileHandler', 'Ajax', 'Session', '_baseUrl', '_siteUrl', '_bootbox', '_riot', '_$', '_moment',
	function ($scope, $rootScope, $window, $filter, $location, $timeout, Page, Settings, FileHandler, Ajax, Session, baseUrl, siteUrl, bootbox, riot, $, moment) {
		Page.title('Migración de compra');

		$scope.stage = 'input';

		$scope.description = '';
		$scope.company = '';
		$scope.inputDate = moment().format('YYYY-MM-DD');
		$scope.currency = 'PEN';
		$scope.exchangeRate = 3.6;

		$scope.paymentDate = '';
		$scope.startDate = '';
		$scope.endDate = '';
		$scope.active = true;

		$scope.supplierId = null;
		$scope.showSupplier = true;

		$scope.saving = false;
		$scope.purchaseOrder = '';
		$scope.regime = '';

		$scope.productExistences = {}; // Objeto que tiene como índices los códigos de productos

		$scope.file = {
			name: '',
			blob: null
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
                            <div class="col-md-7 text-overflow">
                                ${ product.text }
                            </div>
                            <div class="col-md-5 hidden-sm hidden-xs text-overflow text-right">
                            	<i>De:</i> ${ product.supplier }
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-7 text-overflow">
                            	Cód. ${ product.code }
                            </div>
                            <div class="col-md-5 hidden-sm hidden-xs text-overflow text-right">
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

		$scope.setCode = function (n) {
			$scope.code = 'COM' + (n || '1').zeros(3);
		};

		$scope.getPurchaseTotal = function () {
			if (!$scope.data.length) {
				return 0;
			} else {
				return $scope.data.reduce(function (pre, cur) {
					return pre + parseInt(cur['CANT.'], 10) * parseFloat(cur['C.U. EN FACTURA']);
				}, 0);
			}
		};

		$scope.getExpenses = function () {
			if (!$scope.data.length) {
				return 0;
			} else {
				return $scope.data.reduce(function (pre, cur) {
					return pre + parseFloat(cur['GASTO UNITARIO']);
				}, 0);
			}
		};

		$scope.setSupplier = function (insertId) {
			$scope.showSupplier = false;

			$timeout(function () {
				$scope.showSupplier = true;
				$scope.supplierId = insertId;
			});
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
									headers.indexOf('COD. DE BARRAS') > -1 &&
									headers.indexOf('LINEA') > -1 &&
									headers.indexOf('GENERO') > -1 &&
									headers.indexOf('EDAD') > -1 &&
									headers.indexOf('DEPORTE') > -1 &&
									headers.indexOf('MARCA') > -1 &&
									headers.indexOf('TIPO') > -1 &&
									headers.indexOf('REGIMEN') > -1 &&
									headers.indexOf('DESCRIPCION') > -1 &&
									headers.indexOf('N° FACTURA') > -1 &&
									headers.indexOf('FECHA DE FACTURA') > -1 &&
									headers.indexOf('MONEDA EN FACTURA') > -1 &&
									headers.indexOf('C.U. EN FACTURA') > -1 &&
									headers.indexOf('GASTO UNITARIO') > -1 &&
									headers.indexOf('COSTO') > -1 &&
									headers.indexOf('PVP') > -1 &&
									headers.indexOf('P. OFERTA') > -1
								) { // Tiene el encabezado completo
									var regime = false, currency = false;

									var dataSource = rows.splice(3).map(function (row) {
										if (row.split(',').length === headers.length) { // Fila de datos
											var result = {};

											row.split(',').forEach(function (v, i) {
												result[headers[i]] = v;
											});

											if ( result.CODIGO &&
												result.TALLA &&
												result['CANT.'] &&
												result['N° FACTURA'] &&
												result['FECHA DE FACTURA'] &&
												result['MONEDA EN FACTURA'] &&
												result['C.U. EN FACTURA'] &&
												result['GASTO UNITARIO'] &&
												result.COSTO &&
												result.PVP &&
												result['P. OFERTA']
											) { // Si tiene CODIGO y CANT.
												if (regime === false) { // Si regime no está inicializado
													regime = result.REGIMEN;
												} else if (regime.length && result.REGIMEN !== regime) { // Si tiene un régimen válido
													regime = ''; // EL ŕegimen no es válido
												}

												if (currency === false) {
													currency = result['MONEDA EN FACTURA'];
												} else if (currency.length && result['MONEDA EN FACTURA'] !== currency) {
													currency = '';
												}

												return result;
											} else {
												return null;
											}
										} else {
											return null;
										}
									}).filter(function (v) { return v !== null; });

									if (dataSource.length) {
										if (regime && currency) {
											if (currency === 'PEN' || currency === 'USD') {
												$scope.loadData(dataSource, regime, currency);
											} else {
												$scope.$apply(function () {
													$scope.stage = 'input';
													$scope.sheetSelected = '';
													Session.setMessage('La compra figura con una moneda inválida, ingrese "PEN" o "USD".', 'danger', true);
												});
											}
										} else if (!regime) {
											$scope.$apply(function () {
												$scope.stage = 'input';
												$scope.sheetSelected = '';
												Session.setMessage('Todos los productos deben pertenecer al mismo régimen.', 'danger', true);
											});
										} else if (!currency) {
											$scope.$apply(function () {
												$scope.stage = 'input';
												$scope.sheetSelected = '';
												Session.setMessage(`Toda la compra debe figurar con una sola moneda, "PEN" O "USD".`, 'danger', true);
											});
										}
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
										if (headers.indexOf('LINEA') < 0) missingHeaders.push('Línea');
										if (headers.indexOf('GENERO') < 0) missingHeaders.push('Género');
										if (headers.indexOf('EDAD') < 0) missingHeaders.push('Edad');
										if (headers.indexOf('DEPORTE') < 0) missingHeaders.push('Deporte');
										if (headers.indexOf('MARCA') < 0) missingHeaders.push('Marca');
										if (headers.indexOf('TIPO') < 0) missingHeaders.push('Tipo');
										if (headers.indexOf('REGIMEN') < 0) missingHeaders.push('Régimen');
										if (headers.indexOf('DESCRIPCION') < 0) missingHeaders.push('Descripción');
										if (headers.indexOf('N° FACTURA') < 0) missingHeaders.push('Número de factura');
										if (headers.indexOf('FECHA DE FACTURA') < 0) missingHeaders.push('Fecha de factura');
										if (headers.indexOf('MONEDA EN FACTURA') < 0) missingHeaders.push('Moneda en factura');
										if (headers.indexOf('C.U. EN FACTURA') < 0) missingHeaders.push('Costo en factura');
										if (headers.indexOf('GASTO UNITARIO') < 0) missingHeaders.push('Gasto unitario');
										if (headers.indexOf('COSTO') < 0) missingHeaders.push('Costo');
										if (headers.indexOf('PVP') < 0) missingHeaders.push('Precio al público');
										if (headers.indexOf('P. OFERTA') < 0) missingHeaders.push('Precio de oferta');

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
			if ($scope.company) {
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

				Ajax.post(siteUrl('products/verify_for_purchase/' + $scope.company), {
					codes: codes.join(',')
				}).then(function (res) {
					var filtered = dataSource.filter(function (row) {
						return !res.data.find(function (item) {
							return item.code === row.CODIGO && item.size === row.TALLA;
						});
					});

					if (filtered.length) {
						$scope.stage = 'input';
						$scope.sheetSelected = '';

						var records = filtered.map(function (row) {
							return `"${ row.CODIGO }" para talla "${ row.TALLA }"`;
						}).join(', ');

						Session.setMessage('No existen algunos registros de productos: ' + records, 'danger', true);
					} else {
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
										cost_currency: item.cost_currency === 'D' ? 'USD' : 'PEN',
										cost: parseFloat(item.cost)
									};
								}
							}
						});

						$scope.data = dataSource.map(function (row) {
							var found = res.data.find(function (item) {
								return item.code === row.CODIGO && item.size === row.TALLA;
							});

							if (found !== undefined) {
								row.stock_id = found.stock_id;
								row.product_barcode_id = found.product_barcode_id;
								row.product_detail_id = found.product_detail_id;
								row.product_id = found.product_id;
								row.size_id = found.size_id;
							} else {
								found = res.data.find(function (item) {
									return item.code === row.CODIGO;
								});

								if (found !== undefined) {
									 // Se encuentra en product_details
									row.stock_id = '';
									row.product_barcode_id = '';
									row.product_detail_id = found.product_detail_id;
									row.product_id = found.product_id;
									row.size_id = '';
								} else {
									row.stock_id = '';
									row.product_barcode_id = '';
									row.product_detail_id = '';
									row.product_id = '';
									row.size_id = '';
								}
							}

							row.REGIMEN = (row.REGIMEN.toUpperCase() === 'ZOFRA' ? 'ZOFRA' : 'General');

							return row;
						});

						oldData.length = 0;

						$timeout(function () {
							$scope.stage = 'data';
							$scope.$apply();

							$scope.dataTags = riot.mount(document.querySelector('[ng-view] [data-stage="data"] riot-table'), 'riot-table', {
								data: $scope.data,
								getCurrencyAlias: function () {
									return $scope.currency === 'USD' ? '$' : 'S/';
								}
							});
						}, 1000);
					}
				}, function (reason) {
					$scope.stage = 'input';
					$scope.sheetSelected = '';

					Session.setMessage('Ocurrió un error al verificar el stock de productos', 'danger', true);
					console.error('%cAjax error:', 'font-weight:bold', reason);
				});
			} else {
				$scope.$apply(function () {
					Session.setMessage('Debe seleccionar una empresa.', 'danger', true);
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
						<td class="text-center">${ moment(item.date).format('DD/MM/YYYY') }</td>
						<td class="text-right">${ item.amount.toFixed(2) }</td>
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
							<th style="width:120px" class="text-center">Monto (${ $scope.currency === 'USD' ? '$' : 'S/' })</th>
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
				return (parseFloat(value['C.U. EN FACTURA']) || 0) <= 0;
			}).length) {
				bootbox.dialog({
					title: 'Se encontraron datos incorrectos',
					message: 'Algunos registros tienen costo según factura no válido.',
					buttons: {
						ok: {
							label: 'Aceptar',
							className: 'btn-danger'
						}
					}
				});
			} else if ($scope.data.filter(function (value) {
				return !(/^\d+\-\d+$/.test(value['N° FACTURA']));
			}).length) {
				bootbox.dialog({
					title: 'Se encontraron datos incorrectos',
					message: 'Algunos registros no tienen N° de factura en formato válido.',
					buttons: {
						ok: {
							label: 'Aceptar',
							className: 'btn-danger'
						}
					}
				});
			} else if ($scope.data.filter(function (value) {
				return !(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value['FECHA DE FACTURA']));
			}).length) {
				bootbox.dialog({
					title: 'Se encontraron datos incorrectos',
					message: 'Algunas fechas de factura no tienen un formato válido (dd/mm/yyyy).',
					buttons: {
						ok: {
							label: 'Aceptar',
							className: 'btn-danger'
						}
					}
				});
			} else {
				var newInvoices = [];

				$scope.data.forEach(function (item) {
					var invoiceFound = newInvoices.find(function (invoice) {
						return invoice.number === item['N° FACTURA'];
					});

					if (invoiceFound !== undefined) {
						invoiceFound.amount += parseFloat(item['C.U. EN FACTURA']) * parseInt(item['CANT.'], 10);
					} else {
						newInvoices.push({
							number: item['N° FACTURA'],
							date: moment(item['FECHA DE FACTURA'], 'DD/MM/YYYY').format('YYYY-MM-DD'),
							amount: parseFloat(item['C.U. EN FACTURA']) * parseInt(item['CANT.'], 10)
						});
					}
				});

				if (newInvoices.length) {
					var panelHeading = '', panelBody = '';

					if (newInvoices.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="invoices">Facturas (${ newInvoices.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="invoices">
								${ $scope.getInvoicesTable(newInvoices) }
							</div>
						`;
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
									$scope.save(newInvoices);
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

			Ajax.post(siteUrl('testing/save_purchase'), {
				input_date: $scope.inputDate,
				amount: $scope.getPurchaseTotal().toFixed(2),
				supplier_id: $scope.supplierId,
				company_id: $scope.company,
				purchase_order_id: $scope.purchaseOrder,
				utility: 50,
				currency: $scope.currency === 'USD' ? 'D' : 'S',
				expenses: $scope.getExpenses(),
				igv: Settings.getTaxFor($scope.regime),
				details: $scope.data.map(function (detail) {
					return {
						quantity: detail['CANT.'],
						invoice: detail['N° FACTURA'],
						product_id: detail.product_id || '',
						product_detail_id: detail.product_detail_id || '',
						product_barcode_id: detail.product_barcode_id || '',
						invoice_cost: detail['C.U. EN FACTURA'],
						cost: detail.COSTO,
						price: detail.PVP,
						offer_price: detail['P. OFERTA']
					};
				}),
				invoices: newInvoices
			}).then(function (res) {
				if (res.data.ok) {
					Session.setMessage('Se guardó el registro correctamente');
					$location.path('purchases');
				} else {
					Session.setMessage(res.data.error || 'Ocurrió un error', 'danger', true);
				}
			}, function (reason) {
				Session.setMessage(reason || 'Ocurrió un error', 'danger', true);
			}).finally(function () {
				$scope.saving = false;
			});
		};

		$scope.$on('$viewContentLoaded', function () {
			$('select[ng-model="purchaseOrder"]').on('change', function (e) {
				var data = $(this).select2('data');

				$scope.$apply(function () {
					if (data.length && data[0].id) {
						$scope.company = data[0].company_id;
						$scope.supplierId = data[0].supplier_id;
					} else {
						$scope.company = '2'; // Por defecto es Gafco
						$scope.supplierId = null;
					}
				});
			});
		});
	}
]);
