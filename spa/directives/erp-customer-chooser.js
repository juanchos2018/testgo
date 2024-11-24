/*
** Esta directiva crea el cuadro para seleccionar un vendedor para una venta
**
*/

window.angular.module('ERP').directive('erpCustomerChooser', [
	'$window', '$filter', '$timeout', 'Ajax',
	function ($window, $filter, $timeout, Ajax) {
		var angular = $window.angular, $ = angular.element;
        
        var countriesUrl = $window.siteUrl('customers/get_countries_array');
        var queryUrl = $window.siteUrl('customers/get_for_sale_by');
        var citiesUrl = $window.siteUrl('customers/get_cities_array');
        var correlUrl = $window.siteUrl('customers/get_correlatives');
        var detailUrl = $window.siteUrl('customers/get_detail');

		return {
			restrict: 'E',
			scope: {
				ngModel: '=',
                voucherType: '@',
                autofocus: '@',
                disabled: '='
			},
			controller: ['$scope', '$element', function ($scope, $element) {
				$scope.submitted = false;
				$scope.cuyo = false;
                $scope.voucherType = $scope.voucherType;
                $scope.searchUrl = $scope.searchUrl || $window.siteUrl('customers/get_list_for_sale/' + ($scope.voucherType === 'BOLETA' ? 'PERSONA' : $scope.voucherType === 'FACTURA' ? 'EMPRESA' : ''));
                
                $scope.originalLabel = '';

                $scope.ngModel.id           = $scope.ngModel.id         || '';
				$scope.ngModel.full_name    = $scope.ngModel.full_name  || '';
				$scope.ngModel.doc_type		= $scope.ngModel.doc_type	|| '';
                $scope.ngModel.id_number    = $scope.ngModel.id_number  || '';
                $scope.ngModel.type         = $scope.ngModel.type       || '';
                $scope.ngModel.address      = $scope.ngModel.address    || '';
                $scope.ngModel.verified     = $scope.ngModel.verified   || '';

                $scope.countries = [];
                $scope.cities = [];
                
				$scope.record = { // Para nuevo cliente
					type: $scope.voucherType === 'FACTURA' ? 'EMPRESA' : 'PERSONA', // Por defecto se trata de una persona natural
					doc_type: '',
					id_number: '',
					gender: '',
					born_date: '',
					name: '',
					last_name: '',
					address: '',
					city: '', // En realidad es departamento
					country: '',
					phone_number: '',
					mobile_phone_number: '',
					email: '',
					facebook: '',
					workplace: '',
					web: '',
					barcode_card2: '',
					nro_inticard: '',
					barcode_inticard: '',
					customer_id: '', // SOLO EN CASO de registrar una persona jurídica
					company: {
						doc_type: 6,
						id_number: '',
						name: '',
						address: '',
					},
				};
                
				$scope.detail = {
					type: '',
					doc_type: '',
					id_number: '',
					gender: '',
					born_date: '',
					name: '',
					last_name: '',
					address: '',
					city: '',
					country: '',
					phone_number: '',
					mobile_phone_number: '',
					email: '',
					facebook: '',
					workplace: '',
					web: '',
					barcode_card2: '',
					nro_inticard: '',
					barcode_inticard: '',
					customer_id: '',
					current_points: '',
					registered_by: ''
				};

				$scope.clear = function () {
					if ($scope.ngModel.id || $scope.ngModel.full_name) {
                        $scope.ngModel.id           = '';
						$scope.ngModel.full_name    = '';
						$scope.ngModel.doc_type		= '';
                        $scope.ngModel.id_number    = '';
                        $scope.ngModel.type         = '';
                        $scope.ngModel.address      = '';
                        $scope.ngModel.verified     = '';

                        $scope.originalLabel = '';
					}
				};

				$scope.setValue = function (item) {
                    console.log('setValue', item);

                    $scope.ngModel.id           = item.id;
					$scope.ngModel.full_name    = item.full_name;
					$scope.ngModel.doc_type		= item.doc_type;
                    $scope.ngModel.id_number    = item.id_number;
                    $scope.ngModel.type         = item.type;
                    $scope.ngModel.address      = item.address;
                    $scope.ngModel.verified     = Boolean(item.barcode_inticard || item.barcode_card2);

					$scope.originalLabel = $scope.ngModel.full_name;
				};

				$scope.find = function () {
					if ( !$scope.submitted && $scope.ngModel.full_name !== $scope.originalLabel ) {
						if ( $scope.ngModel.full_name.length ) {
							var match = /\d+/ .exec($scope.ngModel.full_name);

							if ( match && match.length ) {
								var query = match[0];
								
								$scope.submitted = true;

								Ajax.get(queryUrl + '/' + encodeURIComponent(query)).then(function (res) {
									var data = res.data;
									if(data.length > 1){
										var items = data.map(function (record, index) {
											return `
												<tr>
													<td>
														<div class="radio i-checks">
															<label>
																<input type="radio" value="${index}" name="customer-for-sale" ${!index ? 'checked' : ''}/>
																<i></i>
															</label>
														</div>
													</td>
													<td>${ record.type }</td>
													<td>${ record.type === "PERSONA" ? (record.id_number.length === 8 ? "DNI" : "N°") : "RUC" }</td>
													<td>${ record.id_number }</td>
													<td>${ record.full_name }</td>
												</tr>
											`
										});

										var modal = $window.bootbox.dialog({
											title: 'Se encontraron varios clientes',
											message: `
												<p class="m-b">
													Seleccione uno de los clientes con código de tarjeta:  <strong>${ query }</strong>
												</p>
												<div class="table-responsive">
													<table class="table table-bordered table-hover">
														<thead>
															<tr>
																<th>&nbsp;</th>
																<th>Tipo</th>
																<th>DNI/RUC</th>
																<th>Nro Documento</th>
																<th>Nombre completo</th>
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
													callback: function() {
														$scope.$apply(function() {
															$scope.clear();
															$scope.submitted = false;
														});
													}
												},
												success: {
													label: 'Aceptar',
													className: 'btn-success',
													callback: function () {
														$scope.$apply(function() {
															$scope.clear();
															$scope.submitted = false;
															var selected = $(`[name="customer-for-sale"]:checked`).val();
															$scope.setValue(data[selected]);
														});
													}
												}
											}
										});
										modal
											.on('shown.bs.modal', function() {
												modal.find('button').focus();
											})
											.modal('show');
									} else {
										$scope.setValue(data);
										$scope.submitted = false;
									}
								}, function () {
									// OJO PIOJO: si se pasó un nro. de documento se podría lanzar el formulario para registrar cliente
									$scope.clear();
									$scope.submitted = false;
								});
							} else {
								$scope.clear();
							}
						} else {
							$scope.clear();
						}
					}
				};

				$scope.returnFocus = function () {
                    $scope.saveMessage = '';
                    
					$timeout(function () {
						$element.find('.modal[name="add"]').find('input[type="search"]:visible, input[type="text"]:visible').first().focus();
					});
				};
                
                $scope.saveLoading = false;
                $scope.saveMessage = '';
                $scope.saveWithCompany = false;
                
                $scope.saveCorrelLoading = false;
                
                $scope.detailLoading = true;
                $scope.waitingForDetail = false;
                
                $scope.changeSaveWithCompany = function (value) {
                    $timeout(function () {
                        if (value) {
                            $element.find('[name="save-with-company-row"] input[type="text"]').first().focus();
                        } else {
                            $scope.record.company.id_number = '';
							$scope.record.company.name = '';
							$scope.record.company.address = '';
                        }
                    });
                };
                
                $scope.clearSaveMessage = function () {
                    $scope.saveMessage = '';
                };
                
				$scope.save = function () {
					$scope.saveLoading = true;

					Ajax.post($window.siteUrl('customers/save_from_sale'), $scope.record).then(function (res) {
						var data = res.data;
						console.log("respuesta stgore",res);
						$scope.setValue(data);

						$element.find('.modal[name="add"]').modal('hide');
                        
						$scope.saveLoading = false;
                        
					}, function (error) {
                        if (error.status === 400 && error.statusText) {
                            $scope.saveMessage = error.statusText;
                        } else {
                            $scope.saveMessage = 'Ocurrió un error, por favor inténtelo más adelante';
                        }
                        
                        $scope.saveLoading = false;
                    });
				};
                
                $scope.searchPerson = function (e) {
                    var modal = $window.bootbox.dialog({
                        message: '\
                            <riot-table>\
				        		<div class="row">\
									<div class="col-lg-12">\
										<searchbox input_class="form-control" placeholder="Buscar persona..."></searchbox>\
									</div>\
								</div>\
								<div class="row m-t">\
									<div class="col-lg-12">\
                                        <div class="table-responsive">\
                                            <table class="table table-bordered table-hover">\
                                                <thead>\
                                                    <tr>\
                                                        <th>N° Documento</th>\
                                                        <th>Nombres y apellidos</th>\
                                                        <th>N° Tarjeta</th>\
                                                    </tr>\
                                                </thead>\
                                                <tbody>\
                                                    <tr each="{ data }" onclick="{ parent.opts.setCustomer }" style="cursor:pointer">\
                                                        <td>{ type === "PERSONA" ? (id_number.length === 8 ? "DNI" : "N°") : "RUC" } { id_number }</td>\
                                                        <td>{ full_name }</td>\
                                                        <td>{ barcode_inticard ? barcode_inticard : "-" }</td>\
                                                    </tr>\
                                                    <tr if="{ !data.length }">\
                                                        <td if="{ !loading }" class="text-center" colspan="3">\
                                                            No se encontraron registros\
                                                        <td>\
                                                        <td if="{ loading }" class="text-center" colspan="3">\
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
                        backdrop: false,
                        closeButton: false,
                        size: 'large',
                        show: false
                    });
                    
                    $window.riot.mount(modal.find('riot-table').get(0), 'riot-table', {
                        data: $window.siteUrl('customers/get_list_for_sale/PERSONA'),
                        setCustomer: function (e) {
                            var data = e.item;

                            $scope.$apply(function () {
                                $scope.record.customer_id = data.id_number;
                            });
                            
                            modal.modal('hide');
                        }
                    });
                    
                    modal
                        .on('shown.bs.modal', function () {
                            modal.find('searchbox input').focus();
                        })
                        .on('hidden.bs.modal', function () {
                            $(e.target).parent().prev().focus();
                        })
                        .modal('show');
                };
                
                // Cargamos los datos de países y ciudades de forma asíncrona
                Ajax.get(countriesUrl).then(function (res) {
                    $scope.countries = res.data;

                    Ajax.get(citiesUrl).then(function (res) {
                        $scope.cities = res.data;
                    });
                });
                
			}],
			link: function (scope, element, attrs) {
			    $timeout(function () {
    			    $window.tmpHTML = element.find('[data-riot-table]').get(0).innerHTML;
    			    //console.log('Montar', $window.tmpHTML);
			        console.log('Montar', element.find('[data-riot-table]').length);
			    }, 1000);
				
				$window.riot.mount(element.find('[data-riot-table]').get(0), 'riot-table', {
					data: scope.searchUrl,
					type: scope.voucherType === 'BOLETA' ? 'PERSONA' : (scope.voucherType === 'FACTURA' ? 'EMPRESA' : ''),
					setCustomer: function (e) {
						var data = e.item;

						scope.setValue(data);
						scope.$apply();

						element.find('.modal[name="search"]').modal('hide');
					}
				});
				
				if (scope.autofocus === 'true') {
				    $timeout(function () {
				        element.find('[name="search-input"]').focus();
				    });
				}

				element.find('.modal').on('shown.bs.modal', function (e) {
					$(this).find('input[type="search"]:visible, input[type="text"]:visible').first().focus();
				});

                element.find('[name="search-button"]').click(function () {
                    element.find('.modal[name="search"]').modal('show');
                });

                element.find('[name="search-input"]').keydown(function (e) {
                    if (e.ctrlKey && e.keyCode === 66) { // Si presiona CTRL + B
                        element.find('.modal[name="search"]').modal('show');
                        e.preventDefault();
                    } else if (e.keyCode === 13) {
                        scope.find();
                        e.preventDefault();
                    }
				});

				element.find('[name="add-button"]').click(function () {
					element.find('.modal[name="add"]').modal('show');
				});

				element.find('[name="detail-button"]').click(function () {
                    if (scope.ngModel.id) {
                        scope.$apply(function () {
                            scope.waitingForDetail = true;

                            scope.detail.type = scope.ngModel.type;
                        });
                        
                        Ajax.get(detailUrl + '/' + scope.ngModel.id).then(function (res) {
                            if (scope.waitingForDetail) {
                                var data = res.data;
                                
                                scope.waitingForDetail = false;
                                scope.detailLoading = false;
                                
                                console.log('data', data);
                                
                                scope.detail.type = data.type;
                                scope.detail.id_number = data.id_number;
								scope.detail.name = data.name;
								scope.detail.address = data.address;
								scope.detail.barcode_card2 = data.barcode_card2;
								scope.detail.nro_inticard = data.nro_inticard;
								scope.detail.barcode_inticard = data.barcode_inticard;
                                scope.detail.registered_by = data.registered_by;
                                
                                if (scope.detail.type === 'PERSONA') {
                                    scope.detail.gender = data.gender;
                                    scope.detail.born_date = data.born_date !== null ? $window.moment(data.born_date).format('DD/MM/YYYY') : data.born_date;
                                    scope.detail.last_name = data.last_name;
                                    scope.detail.city = data.city;
                                    scope.detail.country = data.country;
                                    scope.detail.phone_number = data.phone_number;
                                    scope.detail.mobile_phone_number = data.mobile_phone_number;
                                    scope.detail.email = data.email;
                                    scope.detail.facebook = data.facebook;
                                    scope.detail.workplace = data.workplace;
                                    scope.detail.web = data.web;
                                    
                                    scope.detail.current_points = data.current_points;
                                }
                            }
                        }, function (err) {
                            scope.waitingForDetail = false;
                            scope.detailLoading = false;
                        });
                        
                        element.find('.modal[name="detail"]').modal('show');
                    }
				});
                
                element.find('.modal[name="add"]').on('show.bs.modal', function () {
                    scope.saveCorrelLoading = true;
                    Ajax.get(correlUrl).then(function (res) {
                        if (scope.saveCorrelLoading) {
                            var data = res.data;
                            
                            if (data.nro_inticard) {
                                scope.record.nro_inticard = data.nro_inticard.toString();
                            }

                            if (data.barcode_card2) {
                                scope.record.barcode_card2 = data.barcode_card2.toString();
                            }
                            
                            scope.saveCorrelLoading = false;
                        }
                    }, function (err) {
                        scope.saveCorrelLoading = false;
                        scope.record.nro_inticard = '';
                        scope.record.barcode_card2 = '';
                    });
                });
                
                element.find('.modal[name="add"]').on('hidden.bs.modal', function () {
                    scope.record.type = scope.voucherType === 'FACTURA' ? 'EMPRESA' : 'PERSONA';
                    scope.record.id_number = '';
                    scope.record.gender = '';
                    scope.record.born_date = '';
                    scope.record.name = '';
                    scope.record.last_name = '';
                    scope.record.address = '';
                    scope.record.city = '';
                    scope.record.country = '';
                    scope.record.phone_number = '';
                    scope.record.mobile_phone_number = '';
                    scope.record.email = '';
                    scope.record.facebook = '';
                    scope.record.workplace = '';
                    scope.record.web = '';
                    scope.record.barcode_card2 = '';
                    scope.record.nro_inticard = '';
                    scope.record.barcode_inticard = '';
                    scope.record.customer_id = '';
                    scope.record.company.id_number = '';
					scope.record.company.name = '';
					scope.record.company.address = '';
                });

                element.find('.modal[name="search"]').on('hidden.bs.modal', function () {
                    element.find('input[name="search-input"]').focus();
                });
            },
            template: '\
                <div class="input-group m-b">\
                    <span class="input-group-btn">\
                        <button class="btn btn-default" type="button" name="search-button" tabindex="-1" ng-disabled="disabled">\
                            Cliente\
						</button>\
						<button class="btn btn-info" ng-show="ngModel.id" type="button" tabindex="-1" ng-disabled="disabled">\
							{{  ngModel.type === "PERSONA" ? (ngModel.id_number.length === 8 ? "DNI" : "N°") : "RUC" }}\
						</button>\
                    </span>\
                    <input type="text" name="search-input" class="form-control" ng-model="ngModel.full_name" ng-disabled="disabled || submitted" placeholder="Escanee tarjeta o ingrese {{ (voucherType === \'BOLETA\' || voucherType === \'BOLETA\' ? \'DNI\' : \'\') + (voucherType === \'BOLETA\' ? \'/\' : \'DNI o RUC\') + (voucherType === \'FACTURA\' || voucherType === \'BOLETA\' ? \'RUC\' : \'\') }}" ng-blur="find()">\
                    <span class="input-group-btn">\
                        <button ng-disabled="disabled" ng-show="ngModel.id" class="btn" ng-class="{ \'btn-success\': ngModel.verified, \'btn-default\': !ngModel.verified }" type="button" data-tooltip title="Ver detalle" name="detail-button" tabindex="-1">\
							<i class="fa" ng-class="{ \'fa-check\': ngModel.verified, \'fa-list\': !ngModel.verified }"></i>\
						</button>\
						<button ng-disabled="disabled" ng-show="!ngModel.id" class="btn btn-default" type="button" data-toggle="tooltip" data-placement="bottom" title="Nuevo Cliente" data-tooltip name="add-button" tabindex="-1">\
							<i class="fa fa-plus text"></i>\
						</button>\
						<button ng-disabled="disabled" class="btn btn-default" type="button" data-toggle="tooltip" data-placement="bottom" data-tooltip title="Borrar" ng-click="clear()" tabindex="-1">\
							<i class="fa fa-remove text"></i>\
						</button>\
					</span>\
	            </div>\
	            <div class="modal fade" name="search">\
				    <div class="modal-dialog modal-lg">\
				      <div class="modal-content">\
				        <div class="modal-body">\
				        	<div data-riot-table class="table-responsive">\
				        		<div class="row">\
									<div class="col-lg-3">\
                                        <filter term="type" if="{ !opts.type.length }">\
                                            <select class="form-control">\
                                                <option value="">- Todos -</option>\
                                                <option value="PERSONA">Sólo personas</option>\
                                                <option value="EMPRESA">Sólo empresas</option>\
                                            </select>\
                                        </filter>\
                                        <select class="form-control" if="{ opts.type.length }" >\
                                            <option value="">{ opts.type === \'PERSONA\' ? \'Sólo personas\' : \'Sólo empresas\' }</option>\
                                        </select>\
                                    </div>\
                                    <div class="col-lg-9">\
										<searchbox input_class="form-control" placeholder="Buscar cliente..."></searchbox>\
									</div>\
								</div>\
								<div class="row m-t">\
									<div class="col-lg-12">\
						        		<table class="table table-bordered table-hover">\
						        			<thead>\
						        				<tr>\
						        					<th>N° Documento</th>\
						        					<th>Nombre o razón social</th>\
						        					<th>N° Tarjeta</th>\
						        				</tr>\
						        			</thead>\
						        			<tbody>\
						        				<tr each="{ data }" onclick="{ parent.opts.setCustomer }" style="cursor:pointer">\
						        					<td>{ type === "PERSONA" ? (id_number.length === 8 ? "DNI" : "N°") : "RUC" } { id_number }</td>\
						        					<td>{ full_name }</td>\
						        					<td>{ barcode_inticard ? "INTI. " + barcode_inticard : (barcode_card2 ? "LFA. " + barcode_card2 : "-" ) }</td>\
						        				</tr>\
						        				<tr if="{ !data.length }">\
						        					<td if="{ !loading }" class="text-center" colspan="3">\
						        						No se encontraron registros\
						        					<td>\
						        					<td if="{ loading }" class="text-center" colspan="3">\
						        						Obteniendo datos...\
						        					<td>\
						        				</tr>\
						        			</tbody>\
						        		</table>\
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
				        	</div>\
				        </div>\
				      </div>\
				    </div>\
				</div>\
				<div class="modal fade" name="add" data-loading="{{ saveLoading }}">\
				    <div class="modal-dialog modal-lg">\
			      		<div class="modal-content">\
			      			<div class="modal-header">\
			      				<div class="row">\
			      					<div class="col-md-8">\
						        		<h4 class="modal-title">Nuevo cliente</h4>\
			      					</div>\
			      					<div class="col-md-4 text-right">\
			      						<select class="form-control" ng-model="record.type" ng-change="returnFocus()">\
										  	<option value="PERSONA" selected>Persona Natural</option>\
										  	<option value="EMPRESA">Persona Jurídica</option>\
									  	</select>\
			      					</div>\
			      				</div>\
						    </div>\
					        <div class="modal-body">\
                                <div class="alert alert-danger alert-dismissible" role="alert" ng-if="saveMessage.length > 0">\
                                    <button type="button" class="close" ng-click="clearSaveMessage()" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                                    {{ saveMessage }}\
                                </div>\
								<form ng-submit="save()">\
									<div class="row" ng-if="record.type === \'PERSONA\'">\
										<div class="col-lg-5">\
											<div class="form-group">\
												<label>Nombres <sup class="text-danger">*</sup></label>\
										  		<input type="text" class="form-control" ng-required="record.type === \'PERSONA\'" ng-model="record.name">\
											</div>\
										</div>\
										<div class="col-lg-5">\
											<div class="form-group">\
												<label>Apellidos</label>\
										  		<input type="text" class="form-control" ng-model="record.last_name">\
											</div>\
										</div>\
										<div class="col-lg-2">\
											<div class="form-group">\
												<label>F. nacimiento <sup class="text-danger">*</sup></label>\
										  		<input type="text" class="form-control" date-picker data-model="record.born_date" ng-required="record.type === \'PERSONA\'" pattern="^\\d{2}\\/\\d{2}\\/\\d{4}$">\
											</div>\
										</div>\
										<div class="col-lg-2">\
											<div class="form-group">\
											 	<label>Tipo Doc <sup class="text-danger">*</sup></label>\
												<select class="form-control" ng-model="record.doc_type">\
													<option value="">-- Seleccione --</option>\
													<option value="0">SIN DOM/RUC</option>\
												  	<option value="1">DNI</option>\
													<option value="4">CE</option>\
													<option value="6">RUC</option>\
													<option value="7">Pasaporte</option>\
													<option value="B">DOC ID PAIS RESI</option>\
											  	</select>\
											</div>\
										</div>\
										<div class="col-lg-2">\
											<div class="form-group">\
											 	<label>DNI o documento <sup class="text-danger">*</sup></label>\
										  		<input type="text" class="form-control" ng-required="record.type === \'PERSONA\'" ng-model="record.id_number">\
											</div>\
										</div>\
										<div class="col-lg-2">\
											<div class="form-group">\
											 	<label>Sexo <sup class="text-danger">*</sup></label>\
										  		<select class="form-control" ng-required="record.type === \'PERSONA\'" ng-model="record.gender">\
												  	<option value="">-- Seleccione --</option>\
												  	<option value="M">Masculino</option>\
												  	<option value="F">Femenino</option>\
											  	</select>\
											</div>\
										</div>\
										<div class="col-lg-6">\
											<div class="form-group">\
											  	<label>Dirección</label>\
										  		<input type="text" class="form-control" ng-model="record.address">\
											</div>\
										</div>\
										<div class="col-lg-3">\
											<div class="form-group">\
											  	<label>Departamento o ciudad</label>\
										  		<input type="text" class="form-control" ng-model="record.city" list="cities-list">\
											</div>\
										</div>\
										<div class="col-lg-3">\
											<div class="form-group">\
											  	<label>País</label>\
										  		<input type="text" class="form-control" ng-model="record.country" list="countries-list">\
											</div>\
										</div>\
										<div class="col-lg-3">\
											<div class="form-group">\
											  	<label>Teléfono</label>\
										  		<input type="text" class="form-control" ng-model="record.phone_number">\
											</div>\
										</div>\
										<div class="col-lg-3">\
											<div class="form-group">\
											  	<label>Celular</label>\
										  		<input type="text" class="form-control" ng-model="record.mobile_phone_number">\
											</div>\
										</div>\
										<div class="col-lg-4">\
											<div class="form-group">\
											  	<label>Correo electrónico</label>\
										  		<input type="email" class="form-control" ng-model="record.email">\
											</div>\
										</div>\
										<div class="col-lg-4">\
											<div class="form-group">\
											  	<label>Facebook</label>\
                                                <div class="input-group">\
                                                    <span class="input-group-addon">facebook.com/</span>\
                                                    <input type="text" class="form-control" ng-model="record.facebook">\
                                                </div>\
											</div>\
										</div>\
										<div class="col-lg-4">\
											<div class="form-group">\
											  	<label>Centro de trabajo</label>\
										  		<input type="text" class="form-control" ng-model="record.workplace">\
											</div>\
										</div>\
										<div class="col-lg-4">\
											<div class="form-group">\
											  	<label>Página web</label>\
										  		<input type="text" class="form-control" ng-model="record.web">\
											</div>\
										</div>\
										<div class="col-lg-2">\
											<div class="form-group">\
											  	<label>Correl. interno</label>\
										  		<input type="text" class="form-control" ng-model="record.barcode_card2" ng-disabled="saveCorrelLoading" maxlength="5" pattern="\\d{5}">\
											</div>\
										</div>\
										<div class="col-lg-2">\
											<div class="form-group">\
											  	<label>Correl. LFA</label>\
										  		<input type="text" class="form-control" ng-model="record.nro_inticard" ng-disabled="saveCorrelLoading" pattern="\\d+">\
											</div>\
										</div>\
										<div class="col-lg-4">\
											<div class="form-group">\
											  	<label>N° tarjeta LFA</label>\
										  		<input type="text" class="form-control" ng-model="record.barcode_inticard" maxlength="13" pattern="\\d+">\
											</div>\
										</div>\
										<div class="col-lg-12 m-b-sm">\
                                            <div class="checkbox i-checks">\
                                                <label>\
                                                    <input type="checkbox" ng-model="saveWithCompany" ng-change="changeSaveWithCompany(saveWithCompany)"><i></i> Emitir {{ voucherType | lowercase }} a nombre de empresa\
                                                </label>\
                                            </div>\
                                        </div>\
                                        <div ng-show="saveWithCompany" class="col-lg-12 slidedown-anim">\
                                            <div class="row" name="save-with-company-row">\
                                                <div class="col-lg-4">\
                                                    <div class="form-group">\
                                                        <label>RUC <sup class="text-danger">*</sup></label>\
                                                        <input type="text" class="form-control" ng-model="record.company.id_number" maxlength="11" pattern="\\d{11}" ng-required="saveWithCompany">\
                                                    </div>\
                                                </div>\
                                                <div class="col-lg-8">\
                                                    <div class="form-group">\
                                                        <label>Razón Social <sup class="text-danger">*</sup></label>\
                                                        <input type="text" class="form-control" ng-model="record.company.name" ng-required="saveWithCompany">\
                                                    </div>\
                                                </div>\
											</div>\
											<div class="row" name="save-with-company-row">\
                                                <div class="col-lg-12">\
                                                    <div class="form-group">\
                                                        <label>Dirección <sup class="text-danger">*</sup></label>\
                                                        <input type="text" class="form-control" ng-model="record.company.address" ng-required="saveWithCompany">\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
									</div>\
									<div class="row" ng-if="record.type === \'EMPRESA\'">\
										<div class="col-lg-4">\
											<div class="form-group">\
											  	<label>RUC <sup class="text-danger">*</sup></label>\
										  		<input type="text" class="form-control" ng-required="record.type === \'EMPRESA\'" ng-model="record.id_number" maxlength="11" pattern="\\d{11}">\
											</div>\
										</div>\
										<div class="col-lg-8">\
											<div class="form-group">\
											  	<label>Razón Social <sup class="text-danger">*</sup></label>\
										  		<input type="text" class="form-control" ng-required="record.type === \'EMPRESA\'" ng-model="record.name">\
											</div>\
										</div>\
										<div class="col-lg-12">\
											<div class="form-group">\
											  	<label>Dirección <sup class="text-danger">*</sup></label>\
										  		<input type="text" class="form-control" ng-required="record.type === \'EMPRESA\'" ng-model="record.address">\
											</div>\
										</div>\
										<div class="col-lg-12">\
											<div class="form-group">\
											  	<label>Vincular a cliente registrado</label>\
                                                <div class="input-group">\
                                                    <input type="text" class="form-control" ng-model="record.customer_id" placeholder="Escanee tarjeta o ingrese N° de documento">\
                                                    <span class="input-group-btn">\
                                                        <button class="btn btn-default" type="button" ng-click="searchPerson($event)">Buscar</button>\
                                                    </span>\
                                                </div>\
											</div>\
										</div>\
									</div>\
									<div class="row">\
										<div class="col-lg-12 text-right">\
											<div class="form-group m-t">\
												<button type="button" data-dismiss="modal" class="btn btn-default">Cancelar</button>\
										  		<button type="submit" class="btn btn-primary">\
										  			RegistrarCliente \
										  		</button>\
											</div>\
										</div>\
									</div>\
								</form>\
					        </div>\
			      		</div>\
				    </div>\
				</div>\
                <div class="modal fade" name="detail" data-loading="{{ detailLoading }}">\
				    <div class="modal-dialog modal-lg">\
			      		<div class="modal-content">\
			      			<div class="modal-header">\
			      				<div class="row">\
			      					<div class="col-md-8">\
						        		<h4 class="modal-title">Detalle de cliente</h4>\
			      					</div>\
			      					<div class="col-md-4 text-right">\
                                        <input type="text" class="form-control" disabled ng-value="detail.type === \'EMPRESA\' ? \'Persona Jurídica\' : \'Persona Natural\'">\
			      					</div>\
			      				</div>\
						    </div>\
					        <div class="modal-body">\
								<div class="row" ng-if="detail.type === \'PERSONA\'">\
									<div class="col-lg-5">\
										<div class="form-group">\
											<label>Nombres</label>\
									  		<input type="text" class="form-control" readonly ng-required="detail.type === \'PERSONA\'" ng-model="detail.name">\
										</div>\
									</div>\
									<div class="col-lg-5">\
										<div class="form-group">\
											<label>Apellidos</label>\
									  		<input type="text" class="form-control" readonly ng-model="detail.last_name">\
										</div>\
									</div>\
									<div class="col-lg-2">\
										<div class="form-group">\
											<label>F. nacimiento</label>\
									  		<input type="text" class="form-control" readonly ng-model="detail.born_date" ng-required="record.type === \'PERSONA\'" pattern="^\\d{2}\\/\\d{2}\\/\\d{4}$">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										 	<label>DNI o documento</label>\
									  		<input type="text" readonly class="form-control" ng-required="detail.type === \'PERSONA\'" ng-model="detail.id_number">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										 	<label>Sexo</label>\
									  		<select class="form-control" readonly ng-required="detail.type === \'PERSONA\'" ng-model="detail.gender">\
											  	<option value="">-- Seleccione --</option>\
											  	<option value="M">Masculino</option>\
											  	<option value="F">Femenino</option>\
										  	</select>\
										</div>\
									</div>\
									<div class="col-lg-6">\
										<div class="form-group">\
										  	<label>Dirección</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.address">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										  	<label>Departamento o ciudad</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.city" list="cities-list">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										  	<label>País</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.country" list="countries-list">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										  	<label>Teléfono</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.phone_number">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										  	<label>Celular</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.mobile_phone_number">\
										</div>\
									</div>\
									<div class="col-lg-4">\
										<div class="form-group">\
										  	<label>Correo electrónico</label>\
									  		<input type="email" readonly class="form-control" ng-model="detail.email">\
										</div>\
									</div>\
									<div class="col-lg-4">\
										<div class="form-group">\
										  	<label>Facebook</label>\
                                            <div class="input-group">\
                                                <span class="input-group-addon">facebook.com/</span>\
                                                <input type="text" readonly class="form-control" ng-model="detail.facebook">\
                                            </div>\
										</div>\
									</div>\
									<div class="col-lg-4">\
										<div class="form-group">\
										  	<label>Centro de trabajo</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.workplace">\
										</div>\
									</div>\
									<div class="col-lg-4">\
										<div class="form-group">\
										  	<label>Página web</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.web">\
										</div>\
									</div>\
									<div class="col-lg-2">\
										<div class="form-group">\
										  	<label>N° Correl. interno</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.barcode_card2" maxlength="5" pattern="\\d{5}">\
										</div>\
									</div>\
									<div class="col-lg-2">\
										<div class="form-group">\
										  	<label>Correl. LFA</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.nro_inticard" pattern="\\d+">\
										</div>\
									</div>\
									<div class="col-lg-4">\
										<div class="form-group">\
										  	<label>N° tarjeta LFA</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.barcode_inticard" maxlength="13" pattern="\\d+">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										  	<label>Puntos</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.current_points" pattern="\\d+">\
										</div>\
									</div>\
									<div class="col-lg-9">\
										<div class="form-group">\
										  	<label>Registrado por</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.registered_by">\
										</div>\
									</div>\
								</div>\
								<div class="row" ng-if="detail.type === \'EMPRESA\'">\
									<div class="col-lg-4">\
										<div class="form-group">\
										  	<label>RUC</label>\
									  		<input type="text" readonly class="form-control" ng-required="detail.type === \'EMPRESA\'" ng-model="detail.id_number" maxlength="11" pattern="\\d{11}">\
										</div>\
									</div>\
									<div class="col-lg-8">\
										<div class="form-group">\
										  	<label>Razón Social</label>\
									  		<input type="text" readonly class="form-control" ng-required="detail.type === \'EMPRESA\'" ng-model="detail.name">\
										</div>\
									</div>\
									<div class="col-lg-12">\
										<div class="form-group">\
										  	<label>Dirección</label>\
									  		<input type="text" readonly class="form-control" ng-required="detail.type === \'EMPRESA\'" ng-model="detail.address">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										  	<label>N° Correl. interno</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.barcode_card2" maxlength="5" pattern="\\d{5}">\
										</div>\
									</div>\
									<div class="col-lg-3">\
										<div class="form-group">\
										  	<label>Correl. LFA</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.nro_inticard" pattern="\\d+">\
										</div>\
									</div>\
									<div class="col-lg-6">\
										<div class="form-group">\
										  	<label>N° tarjeta LFA</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.barcode_inticard" maxlength="13" pattern="\\d+">\
										</div>\
									</div>\
									<div class="col-lg-12">\
										<div class="form-group">\
										  	<label>Registrado por</label>\
									  		<input type="text" readonly class="form-control" ng-model="detail.registered_by">\
										</div>\
									</div>\
								</div>\
								<div class="row">\
									<div class="col-lg-12 text-right">\
										<div class="form-group m-t">\
											<button type="button" data-dismiss="modal" class="btn btn-default">Cerrar</button>\
										</div>\
									</div>\
								</div>\
					        </div>\
			      		</div>\
				    </div>\
				</div>\
                <datalist id="cities-list">\
                    <option ng-repeat="city in cities" ng-value="city">\
                </datalist>\
                <datalist id="countries-list">\
                    <option ng-repeat="country in countries" ng-value="country">\
                </datalist>\
	        '
		};
	}
]);