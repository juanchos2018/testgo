/* global URL, Blob */
window.angular.module('ERP').controller('PurchaseOrdersEditCtrl', [
	'$scope', '$rootScope', '$window', '$filter', '$location', '$timeout', 'Page', 'Settings', 'FileHandler', 'Ajax', 'Session', '_baseUrl', '_siteUrl', '_bootbox', '_riot', '_$', '_moment',
	function ($scope, $rootScope, $window, $filter, $location, $timeout, Page, Settings, FileHandler, Ajax, Session, baseUrl, siteUrl, bootbox, riot, $, moment) {
		Page.title('Editar pedido');

		$scope.stage = 'input';

		$scope.description = '';
		$scope.company = '';
		$scope.paymentDate = '';
		$scope.startDate = '';
		$scope.endDate = '';
		$scope.active = false;

		$scope.supplierId = null;
		$scope.showSupplier = true;

		$scope.downloading = false;
		$scope.saving = false;

		$scope.file = {
			name: '',
			blob: null
		};

		$scope.setSingleTable = function (table, records) {
			$scope[table] = records.split(',').map(function (record) {
				return record.split(':').pop();
			});

			$scope[table + 'List'] = records;
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

		$scope.setDetail = function (detail) {
			
			console.log('detail', detail);
			
			$scope.stage = 'data';

			$scope.id = detail.id;
			$scope.code = detail.code;
			$scope.description = detail.description;
			$scope.company = detail.company_id;
			$scope.supplierId = detail.supplier_id;
			$scope.active = (detail.active === 't');
			$scope.originalRecords = {};

			$scope.paymentDate = detail.paid_date || '';
			$scope.startDate = detail.start_date || '';
			$scope.endDate = detail.finish_date || '';

			$scope.data = detail.details.map(function (row) {
				$scope.originalRecords[row.code] = {
					purchaseOrderDetail: row.id,
					productDetail: row.product_detail_id,
					quantity: row.quantity
				};

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
					// 'id': row.id, /* ID de purchase_order_detail */
					'product_id': row.product_id,
					'product_detail_id': row.product_detail_id
				};
			});

			$scope.$apply();

			$scope.mountTag();
		};

		$scope.mountTag = function () {
			var dataTags = riot.mount(document.querySelector('[ng-view] riot-table'), 'riot-table', {
				data: $scope.data,
				categories: $scope.categories,
				genders: $scope.genders,
				ages: $scope.ages,
				uses: $scope.uses,
				brands: $scope.brands,
				subcategories: $scope.subcategories,
				showStock: function (e) {
					var row = e.item.row;
					var companyOpts = '';

					Settings.getCompaniesOfBranch().forEach(function (company) {
						companyOpts += `<option value="${ company.company_id }" ${ company.company_id === $scope.company ? 'selected' : '' }>${ company.company_name }</option>`;
					});

					var modal = bootbox.dialog({
						title: row.DESCRIPCION,
						message: `
							<div class="form-horizontal">
								<div class="form-group">
									<label class="col-lg-2 col-lg-offset-6 control-label">Empresa</label>
									<div class="col-lg-4">
										<select class="form-control">
											${ companyOpts }
										</select>
									</div>
								</div>
							</div>
							<div class="loading text-center">
								<img class="m-t" src="${ baseUrl('public/images/ajax-loader-bg.gif') }">
							</div>
							<table class="table" style="display:none">
								<thead>
									<tr>
										<th class="text-center" width="80px">N°</th>
										<th class="text-center">Código</th>
										<th class="text-center" width="150px">Talla</th>
										<th class="text-center" width="120px">Existencia</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="text-center">1</td>
										<td>CODIGO</td>
										<td>XL</td>
										<td class="text-center">20</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<td class="text-right" colspan="3">Total</td>
										<td class="text-center total"></td>
									</tr>
								</tfoot>
							</table>
						`,
						onEscape: true,
						backdrop: true,
						buttons: {
							close: {
								label: 'Cerrar',
								className: 'btn-default'
							}
						},
						show: false
					});

					modal.on('shown.bs.modal', function () {
						modal.find('select').change(function () {
							modal.find('.table').hide().find('tbody').empty();
							modal.find('.loading').show();

							Ajax.get(siteUrl('stock/get_sizes_for_product/' + row.product_id + '/' + this.value)).then(function (res) {
								if (res.data.length) {
									var stockTotal = 0;

									res.data.forEach(function (size, index) {
										modal.find('.table tbody').append(`
											<tr>
												<td class="text-center">${ index + 1 }</td>
												<td>${ size.code }</td>
												<td>${ size.size }</td>
												<td class="text-center">${ size.stock }</td>
											</tr>
										`);

										stockTotal += parseInt(size.stock, 10);
									});

									modal.find('.table tfoot').show().find('.total').text(stockTotal);
								} else {
									modal.find('.table tbody').append(`
										<tr>
											<td colspan="4" class="text-center">No se encontraron registros</td>
										</tr>
									`);
									modal.find('.table tfoot').hide();
								}
							}, function (reason) {
								modal.find('.table tbody').append(`
									<tr>
										<td colspan="4" class="text-center">Ocurrió un error</td>
									</tr>
								`);
								modal.find('.table tfoot').hide();

								console.error('%cAjax error:', 'font-weight:bold', reason);

							}).finally(function () {
								modal.find('.loading').hide();
								modal.find('.table').show();
							});
						}).trigger('change');
					}).modal('show');
				},
				editCategory: function (e) {
					$scope.editField('Línea', 'LINEA', e.item.row, $scope.categories, this);
				},
				editGender: function (e) {
					$scope.editField('Género', 'GENERO', e.item.row, $scope.genders, this);
				},
				editAge: function (e) {
					$scope.editField('Edad', 'EDAD', e.item.row, $scope.ages, this);
				},
				editUse: function (e) {
					$scope.editField('Deporte', 'DEPORTE', e.item.row, $scope.uses, this);
				},
				editBrand: function (e) {
					$scope.editField('Marca', 'MARCA', e.item.row, $scope.brands, this);
				},
				editSubcategory: function (e) {
					$scope.editField('Tipo', 'TIPO', e.item.row, $scope.subcategories, this);
				},
				setQty: function (e) {
					e.item.row['CANT.'] = e.target.value;
				},
				setDescription: function (e) {
					e.item.row.DESCRIPCION = e.target.value;
				},
				deleteItem: function (e) {
					$scope.$apply(function () {
						$scope.data.splice($scope.data.indexOf(e.item.row), 1);

						if ($scope.data.length) {
							dataTags[0].update({
								data: $scope.data
							});
						} else {
							$scope.sheetSelected = '';
							$scope.stage = 'input';
						}
					});
				}
			});
		};

		$scope.sheets = [];
		$scope.sheetSelected = '';
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
									headers.indexOf('CANT.') > -1 &&
									headers.indexOf('LINEA') > -1 &&
									headers.indexOf('GENERO') > -1 &&
									headers.indexOf('EDAD') > -1 &&
									headers.indexOf('DEPORTE') > -1 &&
									headers.indexOf('MARCA') > -1 &&
									headers.indexOf('TIPO') > -1 &&
									headers.indexOf('REGIMEN') > -1 &&
									headers.indexOf('DESCRIPCION') > -1
								) { // Tiene el encabezado completo
									var dataSource = rows.splice(3).map(function (row) {
										if (row.split(',').length === headers.length) { // Fila de datos
											var result = {};

											row.split(',').forEach(function (v, i) {
												result[headers[i]] = v;
											});

											if ( result.CODIGO && result['CANT.'] ) { // Si tiene CODIGO y CANT.
												return result;
											} else {
												return null;
											}
										} else {
											return null;
										}
									}).filter(function (v) { return v !== null; });

									if (dataSource.length) {
										$scope.loadData(dataSource);
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

										(headers.indexOf('CODIGO') < 0) && missingHeaders.push('Código');
										(headers.indexOf('CANT.') < 0) && missingHeaders.push('Cantidad');
										(headers.indexOf('LINEA') < 0) && missingHeaders.push('Línea');
										(headers.indexOf('GENERO') < 0) && missingHeaders.push('Género');
										(headers.indexOf('EDAD') < 0) && missingHeaders.push('Edad');
										(headers.indexOf('DEPORTE') < 0) && missingHeaders.push('Deporte');
										(headers.indexOf('MARCA') < 0) && missingHeaders.push('Marca');
										(headers.indexOf('TIPO') < 0) && missingHeaders.push('Tipo');
										(headers.indexOf('REGIMEN') < 0) && missingHeaders.push('Régimen');
										(headers.indexOf('DESCRIPCION') < 0) && missingHeaders.push('Descripción');

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
				`
				+ (applyToAll !== true ? `
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

		$scope.loadData = function (dataSource) {
			if ($scope.company) {
				dataSource = dataSource || $scope.data;

				var codes = dataSource.map(function (row) {
					return row.CODIGO;
				});

				Ajax.post(siteUrl('products/verify_for_purchase_order/' + $scope.company), {
					codes: codes.join(',')
				}).then(function (res) {
					var oldData = $scope.data;

					$scope.data = dataSource.map(function (row) {
						console.log('row', row);
						var found = res.data.find(function (item) {
							return item.code === row.CODIGO;
						});
						console.log('found', found);
						if (found !== undefined) {
							row.COSTO = parseFloat(found.cost);
							row.COSTO_FACTURA = parseFloat(found.invoice_cost);
							row.STOCK = parseInt(found.store_stock, 10);

							row.product_detail_id = found.product_detail_id;
							row.product_id = found.product_id;
							row.has_stock = (found.store_stock && found.store_stock.length);
						} else {
							row.COSTO = 0;
							row.COSTO_FACTURA = 0;
							row.STOCK = 0;

							row.product_detail_id = '';
							row.product_id = '';
							row.has_stock = false;
						}

						if (row.product_detail_id) { // Si se encontró product_detail_id
							row.MONEDA_COSTO = (found.cost_currency === 'S' ? 'S/' : '$');
							row.FACTURA_COSTO = (found.invoice_currency === 'S' ? 'S/' : '$');
						} else {
							row.MONEDA_COSTO = '';
							row.FACTURA_COSTO = '';
						}

						row.REGIMEN = (row.REGIMEN.toUpperCase() === 'ZOFRA' ? 'ZOFRA' : 'General');

						return row;
					});

					oldData.length = 0;

					$timeout(function () {
						$scope.stage = 'data';
						$scope.$apply();

						$scope.mountTag();
					}, 1000);
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
			} else {
				var newProducts = [];
				var newCategories = [];
				var newGenders = [];
				var newAges = [];
				var newUses = [];
				var newBrands = [];
				var newSubcategories = [];

				$scope.data.forEach(function (item) {
					if (!item.product_id) {
						newProducts.push({
							code: item.CODIGO,
							description: item.DESCRIPCION
						});

						if (item.LINEA && $scope.categories.indexOf(item.LINEA) < 0 && newCategories.indexOf(item.LINEA) < 0) {
							newCategories.push(item.LINEA);
						}

						if (item.GENERO && $scope.genders.indexOf(item.GENERO) < 0 && newGenders.indexOf(item.GENERO) < 0) {
							newGenders.push(item.GENERO);
						}

						if (item.EDAD && $scope.ages.indexOf(item.EDAD) < 0 && newAges.indexOf(item.EDAD) < 0) {
							newAges.push(item.EDAD);
						}

						if (item.DEPORTE && $scope.uses.indexOf(item.DEPORTE) < 0 && newUses.indexOf(item.DEPORTE) < 0) {
							newUses.push(item.DEPORTE);
						}

						if (item.MARCA && $scope.brands.indexOf(item.MARCA) < 0 && newBrands.indexOf(item.MARCA) < 0) {
							newBrands.push(item.MARCA);
						}

						if (item.TIPO && $scope.subcategories.indexOf(item.TIPO) < 0 && newSubcategories.indexOf(item.TIPO) < 0) {
							newSubcategories.push(item.TIPO);
						}
					}
				});

				if (newProducts.length || newCategories.length || newGenders.length || newAges.length || newUses.length || newBrands.length || newSubcategories.length) {
					var panelHeading = '', panelBody = '', params = {};

					if (newProducts.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="products">Productos (${ newProducts.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="products">
								${ $scope.getProductsTable(newProducts) }
							</div>
						`;
					}

					if (newCategories.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="category">Líneas (${ newCategories.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="category">
								${ $scope.getTable(newCategories, 'Línea', 'LINEA', 'categories') }
							</div>
						`;

						params.categories = newCategories;
					}

					if (newGenders.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="gender">Géneros (${ newGenders.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="gender">
								${ $scope.getTable(newGenders, 'Género', 'GENERO', 'genders') }
							</div>
						`;

						params.genders = newGenders;
					}

					if (newAges.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="age">Edades (${ newAges.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="age">
								${ $scope.getTable(newAges, 'Edad', 'EDAD', 'ages') }
							</div>
						`;

						params.ages = newAges;
					}

					if (newUses.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="use">Deportes (${ newUses.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="use">
								${ $scope.getTable(newUses, 'Deporte', 'DEPORTE', 'uses') }
							</div>
						`;

						params.uses = newUses;
					}

					if (newBrands.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="brand">Marcas (${ newBrands.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="brand">
								${ $scope.getTable(newBrands, 'Marca', 'MARCA', 'brands') }
							</div>
						`;

						params.brands = newBrands;
					}

					if (newSubcategories.length) {
						panelHeading += `<li class="${ !panelHeading.length ? 'active' : '' }" style="float:none;display:inline-block"><a href="#" data-target="subcategory">Tipos (${ newSubcategories.length })</a></li>`;

						panelBody += `
							<div class="tab-pane ${ !panelBody.length ? 'active' : '' }" data-tab="subcategory">
								${ $scope.getTable(newSubcategories, 'Tipo', 'TIPO', 'subcategories') }
							</div>
						`;

						params.subcategories = newSubcategories;
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
											if (res.data.categories.length) {
												$scope.categoriesList += ',' + res.data.categories;
											}

											if (res.data.genders.length) {
												$scope.gendersList += ',' + res.data.genders;
											}

											if (res.data.ages.length) {
												$scope.agesList += ',' + res.data.ages;
											}

											if (res.data.uses.length) {
												$scope.usesList += ',' + res.data.uses;
											}

											if (res.data.brands.length) {
												$scope.brandsList += ',' + res.data.brands;
											}

											if (res.data.subcategories.length) {
												$scope.subcategoriesList += ',' + res.data.subcategories;
											}

											modal.one('hidden.bs.modal', function () {
												$scope.update();
											});
										}, function (reason) {
											Session.setMessage('Ocurrió un error al guardar los nuevos registros.', 'danger', true);
											console.error('%cAjax error:', 'font-weight:bold', reason);
										}).finally(function () {
											modal.modal('hide');
										});

										return false;
									} else {
										$scope.update();
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
					$scope.update();
				}
			}
		};
		
		$scope.update = function () {
			if (!$scope.id) return;
			
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
					return item.description === description;
				};
			};
			
			var categories = $scope.categoriesList.split(',').map(transform);
			var genders = $scope.gendersList.split(',').map(transform);
			var ages = $scope.agesList.split(',').map(transform);
			var uses = $scope.usesList.split(',').map(transform);
			var brands = $scope.brandsList.split(',').map(transform);
			var subcategories = $scope.subcategoriesList.split(',').map(transform);
			
			Ajax.post(siteUrl('purchase_orders/update/' + $scope.id), {
				description: $scope.description,
				start_date: $scope.startDate,
				finish_date: $scope.endDate,
				paid_date: $scope.paymentDate,
				active: $scope.active ? 't' : 'f',
				supplier_id: $scope.supplierId,
				company_id: $scope.company,
				details: $scope.data.map(function (detail) {
					var row = {
						quantity: detail['CANT.']
					};
					
					if (detail.CODIGO in $scope.originalRecords) { // Si el CODIGO ya se encontraba registrado, no puede ser un producto nuevo y tiene que tener STOCK
						var originalRecord = $scope.originalRecords[detail.CODIGO];
						
						row.id = originalRecord.purchaseOrderDetail;
						
						if (row.quantity == originalRecord.quantity && detail.product_detail_id == originalRecord.productDetail) {
							row.update = false;
							
							delete row.quantity;
						} else {
							row.update = true;
							row.product_detail_id = detail.product_detail_id;
						}
					} else if (detail.product_detail_id) { // Tiene product_detail_id
						row.product_detail_id = detail.product_detail_id;
					} else if (detail.product_id) { // Es un producto registrado
						row.product_id = detail.product_id;
					} else { // Es un producto nuevo
						row.product_description = detail.DESCRIPCION;
						row.product_code = detail.CODIGO;
						row.product_regime = detail.REGIMEN;
						row.product_category_id = (categories.find(finder(detail.LINEA)) || {}).id || '';
						row.product_gender_id = (genders.find(finder(detail.GENERO)) || {}).id || '';
						row.product_age_id = (ages.find(finder(detail.EDAD)) || {}).id || '';
						row.product_use_id = (uses.find(finder(detail.DEPORTE)) || {}).id || '';
						row.product_brand_id = (brands.find(finder(detail.MARCA)) || {}).id || '';
						row.product_subcategory_id = (subcategories.find(finder(detail.TIPO)) || {}).id || '';
					}

					return row;
				})
			}).then(function (res) {
				if (res.data.ok) {
					Session.setMessage('Se actualizó el registro correctamente');
					$location.path('purchase-orders');
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
