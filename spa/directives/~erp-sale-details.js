/*
** Esta directiva crea el listado que contiene los detalles de venta
**
*/

window.angular.module('ERP').directive('erpSaleDetails', [
	'$window', '$filter', '$timeout', 'Ajax', 'Settings',
	function ($window, $filter, $timeout, Ajax, Settings) {
		var angular = $window.angular, $ = angular.element;

		return {
			restrict: 'E',
			replace: true,
			scope: {
				ngModel: '=',
				campaigns: '=',
				productsInOffer: '=',
				offers: '=',
				company: '=',
				regime: '=',
				customerVerified: '=',
				disabled: '=',
				ignoreStock: '@'
			},
			controller: ['$scope', '$element', function ($scope, $element) {
				$scope.query = '';

				$scope.find = function () {
					if (/^\w+$/ .test($scope.query)) { // Código de barras
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
															<input type="radio" value="${ index }" name="product-for-sale" ${ !index ? 'checked' : '' }>
															<i></i>
														</label>
													</div>
												</td>
												<td>${ record.code }</td>
												<td>${ record.description }</td>
												<td>${ record.size }</td>
												<td>${ record.regime }</td>
												<td>${ record.company_name }</td>
											</tr>
										`;
									});

									var modal = $window.bootbox.dialog({
										title: 'Se encontraron varios productos',
										message: `
											<p class="m-b">
												Seleccione uno de los productos con código de barras <strong>${ $scope.query }</strong>.
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
														${ items.join('') }
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
					if ($scope.ignoreStock || parseInt(item.stock)) { // Existen productos en stock
						if (!$scope.existsSaleDetail(item)) { // Si aún no se agregó el producto
							item.stock = parseInt(item.stock);
							item.price = parseFloat(item.price);
							item.offer_price = parseFloat(item.offer_price);
							item.qty = 1;

							if ($scope.customerVerified) {
								item.unit_price = item.offer_price.toFixed(2);
							} else {
								item.unit_price = item.price.toFixed(2);
							}

							$scope.ngModel.push(item);
						}

						var offerSaleDetails = null;
						var offerFound = null;

						// Si el detalle del producto agregado es uno de los que están en oferta
						if ($scope.customerVerified && item.product_detail_id in $scope.productsInOffer) {
							$scope.productsInOffer[item.product_detail_id].forEach(function (detail) {
								// Se aumenta la cantidad de todos los productos con ese detalle
								detail.currentQty++;
							});

							// Se recorre todos los combos disponibles

							for (var i = 0; i < $scope.campaigns.length; i++) {
								// isFilledOffer devolverá FALSE si no se encontró el combo y
								// devolverá un objeto con llave product_detail y contenido saleDetails
								// en caso de encontrarse el combo
								offerSaleDetails = $scope.isFilledOffer($scope.campaigns[i].details);

								if (offerSaleDetails) {
									offerFound = $scope.campaigns[i];
									break;
								}
							}
						}

						if (offerFound) {
							offerFound.details.forEach(function (offerDetail) {
								$scope.productsInOffer[offerDetail.product_detail_id].forEach(function (detail) {
									detail.currentQty -= offerDetail.quantity;
								});
							});

							//console.log('Oferta encontrada', offerFound);
							//console.log('Detalles de venta vinculados', offerSaleDetails);

							var offer = $scope.existsOffer(offerFound.id);

							if (offer) {
								//console.log('%cCombo encontrado!', 'background:red;color:white;font-size:2em', offer);
								// Si ya existía una oferta de este tipo agregada
								offer.quantity++;

								// Si se están agregando detalles y se detectó un combo,
								// se supone que hay registros sin offer_id que conforman el combo detectado
								// estos registros sin oferta, hay que eliminarlos, porque pasarían a formar
								// parte de los primeros saleDetails con offer_id

								offerFound.details.forEach(function (offerDetail) {
									//console.log('%cofferDetail', 'background:blue;color:white;font-size:2em', offerDetail);
									var offerQty = offerDetail.quantity;

									//offerSaleDetails[offerDetail.product_detail_id] debe existir
									// se creó en isFilledOffer()
									offerSaleDetails[offerDetail.product_detail_id].forEach(function (saleDetail) {
										//console.log('%csaleDetail', 'background:purple;color:white;font-size:2em', saleDetail);
										//console.log('%cBUSCAR product_barcode_id y oferta', 'background:purple;color:white;font-size:2em', saleDetail.id, offerFound.id);
										// Si la cantidad de venta es menor a la cantidad en oferta
										var prevDetail = $scope.getDetailForOffer(saleDetail.id, offerFound.id);

										//console.log('%cprevDetail', 'background:yellow;color:red;font-size:2em', prevDetail);

										if (saleDetail.qty <= offerQty) {
											if (prevDetail) {
												prevDetail.qty += saleDetail.qty;

												saleDetail.qty = 0;
											} else {
												saleDetail.offer_detail_id = offerDetail.id;
												saleDetail.offer_description = offerFound.campaign + ' - ' + offerFound.description;
												saleDetail.offer_quantity = offerFound.quantity;
												saleDetail.offer_id = offerFound.id;
												saleDetail.original_offer_price = saleDetail.offer_price;
												saleDetail.offer_price = parseFloat(offerDetail.price);
												saleDetail.unit_price = parseFloat(offerDetail.price);
											}

											offerQty -= saleDetail.qty;
										} else {
											// Se quita la cantidad de oferta y se deja
											// el detalle de venta sin ofertas (es el remanente)
											saleDetail.qty -= offerQty;

											if (prevDetail) {
												// Se aumenta la cantidad del detalle de oferta
												prevDetail.qty += offerQty;
											} else {
												// Se debe partir el detalle actual
												// creando un nuevo detalle que será el que esté
												// vinculada a la oferta

												var saleDetail2 = angular.copy(saleDetail);

												saleDetail2.offer_detail_id = offerDetail.id;
												saleDetail2.offer_description = offerFound.campaign + ' - ' + offerFound.description;
												saleDetail2.offer_quantity = offerFound.quantity;
												saleDetail2.offer_id = offerFound.id;
												saleDetail2.original_offer_price = saleDetail2.offer_price;
												saleDetail2.offer_price = parseFloat(offerDetail.price);
												saleDetail2.unit_price = parseFloat(offerDetail.price);
												saleDetail2.qty = offerQty;

												$scope.ngModel.push(saleDetail2);
											}

											offerQty = 0;
										}
									});
								});

							} else {
								$scope.offers.push({
									id: offerFound.id,
									campaign: offerFound.campaign,
									description: offerFound.description,
									price: parseFloat(offerFound.price),
									quantity: 1,
									details: offerFound.details // No importará mucho el currentQty, lo importante es quantity que es fijo
								});

								offerFound.details.forEach(function (offerDetail) {
									var offerQty = offerDetail.quantity;

									//offerSaleDetails[offerDetail.product_detail_id] debe existir
									// se creó en isFilledOffer()
									offerSaleDetails[offerDetail.product_detail_id].forEach(function (saleDetail) {
										// Si la cantidad de venta es menor a la cantidad en oferta
										offerDetail.description = offerDetail.description || saleDetail.description;

										if (saleDetail.qty <= offerQty) {
											saleDetail.offer_detail_id = offerDetail.id;
											saleDetail.offer_description = offerFound.campaign + ' - ' + offerFound.description;
											saleDetail.offer_quantity = offerFound.quantity;
											saleDetail.offer_id = offerFound.id;
											saleDetail.original_offer_price = saleDetail.offer_price;
											saleDetail.offer_price = parseFloat(offerDetail.price);
											saleDetail.unit_price = parseFloat(offerDetail.price);

											offerQty -= saleDetail.qty;
										} else {
											// Se quita la cantidad de oferta y se deja
											// el detalle de venta sin ofertas (es el remanente)
											saleDetail.qty -= offerQty;

											// Se debe partir el detalle actual
											// creando un nuevo detalle que será el que esté
											// vinculada a la oferta

											var saleDetail2 = angular.copy(saleDetail);

											saleDetail2.offer_detail_id = offerDetail.id;
											saleDetail2.offer_description = offerFound.campaign + ' - ' + offerFound.description;
											saleDetail2.offer_quantity = offerFound.quantity;
											saleDetail2.offer_id = offerFound.id;
											saleDetail2.original_offer_price = saleDetail2.offer_price;
											saleDetail2.offer_price = parseFloat(offerDetail.price);
											saleDetail2.unit_price = parseFloat(offerDetail.price);
											saleDetail2.qty = offerQty;

											$scope.ngModel.push(saleDetail2);

											offerQty = 0;
										}
									});
								});
							}

							for (var i = $scope.ngModel.length - 1; i >= 0; i--) {
								if ($scope.ngModel[i].qty < 1) {
									$scope.ngModel.splice(i, 1);
								}
							}

						}

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

				$scope.existsSaleDetail = function (item) {
					for (var i = 0; i < $scope.ngModel.length; i++) {
						var saleDetail = $scope.ngModel[i];

						if (saleDetail.id === item.id && saleDetail.offer_id === item.offer_id) { // Se agregó el producto previamente
							if ($scope.ignoreStock || saleDetail.qty + 1 <= item.stock) {
								saleDetail.qty++; // Solo se debe incrementar la cantidad

								$scope.clearInput();
							} else {
								$scope.missingStock(item);
							}

							return true;
						}
					}

					return false;
				};

				$scope.isFilledOffer = function (details) {
					var saleDetails = {};

					for (var i = 0; i < details.length; i++) {
						if (details[i].quantity > details[i].currentQty) {
							saleDetails = null;

							return false;
						} else {
							if (! (details[i].product_detail_id in saleDetails)) {
								saleDetails[details[i].product_detail_id] = [];
							}

							var offerQty = details[i].quantity;

							$scope.ngModel.forEach(function (saleDetail) {
								// Es un producto que no pertenece a un combo y pertenece a ese product_detail_id
								// y además tiene una cantidad <= al remanente de la cantidad de oferta (offerQty)
								if (!saleDetail.offer_id && saleDetail.product_detail_id === details[i].product_detail_id
								 && offerQty >= 0) {
									saleDetails[saleDetail.product_detail_id].push(saleDetail);

									offerQty -= saleDetail.qty;
								}
							});
						}
					}

					return saleDetails;
				};

				$scope.existsOffer = function (id) {
					for (var i = 0; i < $scope.offers.length; i++) {
						if ($scope.offers[i].id == id) {
							return $scope.offers[i];
						}
					}

					return false;
				};

				$scope.getDetailForOffer = function (productBarcodeId, offerId) {
					for (var i = 0; i < $scope.ngModel.length; i++) {
						if ($scope.ngModel[i].id == productBarcodeId && $scope.ngModel[i].offer_id == offerId) {
							return $scope.ngModel[i];
						}
					}

					return false;
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
		                message: '\
		                    <riot-table>\
				        		<div class="row">\
									<div class="col-lg-7">\
										<searchbox input_class="form-control" placeholder="Buscar producto..."></searchbox>\
									</div>\
				        			<div class="col-lg-3">\
                                        <filter term="regime">\
                                            <select class="form-control" __disabled="{ parent.opts.regime }">\
                                                <option value="">- Régimen -</option>\
                                                <option value="General" __selected="{ parent.opts.regime === \'General\' }">Régimen general</option>\
                                                <option value="ZOFRA" __selected="{ parent.opts.regime === \'ZOFRA\' }">Régimen Zofra</option>\
                                            </select>\
                                        </filter>\
                                    </div>\
				        			<div class="col-lg-2">\
                                        <filter term="product_details.company_id">\
                                            <select class="form-control" __disabled="{ parent.opts.company }">\
                                                <option value="">- Empresa -</option>\
                                                <option each="{ parent.opts.companies }" value="{ company_id }" __selected="{ parent.parent.opts.company == company_id }">{ company_name }</option>\
                                            </select>\
                                        </filter>\
                                    </div>\
								</div>\
								<div class="row m-t">\
									<div class="col-lg-12">\
		                                <div class="table-responsive">\
		                                    <table class="table table-bordered table-hover">\
		                                        <thead>\
		                                            <tr>\
		                                                <th style="width:150px">Código</th>\
		                                                <th>Descripción</th>\
		                                                <th style="width:100px">Talla</th>\
		                                                <th style="width:100px" show="{ !opts.regime }">Régimen</th>\
		                                                <th style="width:100px" show="{ !opts.company }">Empresa</th>\
		                                                <th style="width:80px">Stock</th>\
		                                            </tr>\
		                                        </thead>\
		                                        <tbody>\
		                                            <tr each="{ data }" onclick="{ parent.opts.setProduct }" style="cursor:pointer">\
		                                                <td>{ code }</td>\
		                                                <td>{ description }</td>\
		                                                <td>{ size }</td>\
		                                                <td show="{ !parent.opts.regime }">{ regime }</td>\
		                                                <td show="{ !parent.opts.company }">{ company_name }</td>\
		                                                <td class="text-center">{ stock }</td>\
		                                            </tr>\
		                                            <tr if="{ !data.length }">\
		                                                <td if="{ !loading }" class="text-center" colspan="6">\
		                                                    No se encontraron registros\
		                                                <td>\
		                                                <td if="{ loading }" class="text-center" colspan="6">\
		                                                    Obteniendo datos...\
		                                                <td>\
		                                            </tr>\
		                                        </tbody>\
		                                    </table>\
									   </div>\
									</div>\
								</div>\
								<div class="row">\
									<div class="col-lg-6">\
										{ total } registros\
									</div>\
									<div class="col-lg-6">\
										<paginator button_class="btn btn-sm btn-default" active_button_class="btn btn-sm btn-primary"></paginator>\
									</div>\
								</div>\
				        	</riot-table>\
		                ',
		                onEscape: true,
		                backdrop: true,
		                closeButton: false,
		                size: 'large',
		                show: false
		            });

		            $window.riot.mount(modal.find('riot-table').get(0), 'riot-table', {
		                data: function (params) {
		                	return $window.backgroundXHR(
		                		$window.siteUrl( 'products/get_list_for_sale' + ($scope.company && $scope.regime ? '/' + $scope.company + '/' + $scope.regime : '') + '?' + params ),
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
			template: '\
				<form ng-submit="find()" autocomplete="off">\
					<div class="input-group">\
						<input type="text" ng-disabled="disabled" class="form-control" ng-keydown="keyPressed($event)" required ng-model="query" name="query" placeholder="Escanee código de barras" />\
						<span class="input-group-btn">\
							<button class="btn btn-default" ng-disabled="disabled" ng-click="search()" ng-keydown="keyPressed($event)" type="button">\
								<i class="icon-search-1"></i>\
								Buscar\
							</button>\
						</span>\
					</div>\
				</form>\
			'
		};
	}
]);
