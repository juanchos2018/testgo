/*
** Esta directiva crea el cuadro para seleccionar un vendedor para una venta
**
*/

window.angular.module('ERP').directive('erpSalemanChooser', [
	'$window', '$filter', '$timeout',
	function ($window, $filter, $timeout) {
		var $ = $window.angular.element;

		return {
			restrict: 'E',
			scope: {
				list: '=',
				ngModel: '=',
				disabled: '='
			},
			controller: ['$scope', '$element', function ($scope, $element) {
				$scope.ngModel.id = $scope.ngModel.id || '';
				$scope.ngModel.full_name = $scope.ngModel.full_name || '';
				$scope.ngModel.code = $scope.ngModel.code || '';

				$scope.label = ($scope.ngModel.code && $scope.ngModel.full_name ? $scope.ngModel.code + ' - ' + $scope.ngModel.full_name : '');
				$scope.originalLabel = $scope.ngModel.label || '';
				$scope.selected = $scope.ngModel.id || '';

				$scope.searchText = '';
				$scope.data = [];

				$scope.list = $scope.list || [];

				$scope.clear = function () {
					if ($scope.ngModel.id || $scope.label) {
						$scope.ngModel.id = '';
						$scope.ngModel.full_name = '';
						$scope.ngModel.code = '';
						
						$scope.label = '';
						$scope.originalLabel = '';
						$scope.selected = '';
					}
				};

				$scope.getAvatar = function (url) {
					url = url || 'images/avatar/1.png';

					return $window.baseUrl('public/' + url);
				};

				$scope.getSaleman = function () {
					if ( $scope.selected ) {
						for ( var i = 0; i < $scope.list.length; i++ ) {
							if ( $scope.list[i].id == $scope.selected ) {
								return $scope.list[i];
							}
						}
					}

					return false;
				};

				$scope.getSalemanByCode = function (code) {
					for ( var i = 0; i < $scope.list.length; i++ ) {
						if ( $scope.list[i].code == code ) {
							return $scope.list[i];
						}
					}

					return false;
				};

				$scope.setValue = function (item) {
					item = item || $scope.getSaleman();

					if ( item ) {
						$scope.ngModel.id = item.id;
						$scope.ngModel.full_name = item.full_name;
						$scope.ngModel.code = item.code;
						
						$scope.label = item.code + ' - ' + item.full_name;
						$scope.originalLabel = $scope.label;
					}

					$element.find('.modal').modal('hide');
				};

				$scope.$watch('searchText', function (newVal, oldVal) {
					$scope.data = $filter('filter')($scope.list, newVal);

					if ( $scope.data.length ) {
						$scope.selected = $scope.data[0].id;
					} else {
						$scope.selected = '';
					}
				});

				$scope.$watch('ngModel', function (newVal, oldVal) {
					if (!newVal.full_name) { // Se resetea el valor
						$scope.label = '';
						$scope.originalLabel = $scope.label;
					}
				});

				$element.find('.modal').on('show.bs.modal', function (e) {
					$scope.$apply(function () {
						if ( !$scope.data.length ) {
							$scope.data = $filter('filter')($scope.list, $scope.searchText);
						}

						if ( !$scope.selected ) {
							$scope.data.length && ($scope.selected = $scope.data[0].id);
						}
					});
				});
				
				$element.find('.modal').on('hidden.bs.modal', function (e) {
					var selected = $scope.selected; // Because of watch will reset selected
					$scope.searchText = '';
					$scope.$apply();

					$timeout(function () {
						$scope.selected = selected;
						$scope.$apply();
					});
				});

				$element.find('input[ng-model="label"]').on('blur', function () {
					if ( $scope.label !== $scope.originalLabel ) {
						if ( $scope.label.length ) {
							var match = /\d+/ .exec($scope.label);

							if ( match && match.length ) {
								var code = $filter('lpad')(match[0], 4);
								var item = $scope.getSalemanByCode(code);
								
								if ( item ) {
									$scope.selected = item.id;

									$scope.setValue(item);
								} else {
									$scope.clear();
								}
							} else {
								$scope.clear();
							}
						} else {
							$scope.clear();
						}

						$scope.$apply();
					}
				});
			}],
			link: function (scope, element, attrs) {
				element.find('.modal').on('shown.bs.modal', function (e) {
					$(this).find('input[type="text"]:first-of-type').focus();
				});

				element.find('[name="search-button"]').click(function () {
					element.find('.modal[name="search"]').modal('show');
				});

				element.find('[name="search-input"]').keydown(function (e) {
                    if (e.ctrlKey && e.keyCode === 66) { // Si presiona CTRL + B
                        element.find('.modal[name="search"]').modal('show');
                        e.preventDefault();
                    }
				});

				element.find('.modal[name="search"]').on('hidden.bs.modal', function () {
                    element.find('input[name="search-input"]').focus();
                });
			},
			template: '\
	            <div class="input-group m-b">\
					<span class="input-group-btn">\
						<button class="btn btn-default" type="button" name="search-button" tabindex="-1" ng-disabled="disabled">\
							Vendedor\
						</button>\
					</span>\
					<input type="text" name="search-input" class="form-control" ng-model="label" ng-disabled="disabled" placeholder="Ingrese código">\
					<span class="input-group-btn">\
						<button class="btn btn-default" ng-disabled="disabled" type="button" data-tooltip data-toggle="tooltip" data-placement="bottom" title="Borrar" ng-click="clear()" tabindex="-1">\
							<i class="fa fa-remove text"></i>\
						</button>\
					</span>\
	            </div>\
	            <div class="modal fade" name="search">\
				    <div class="modal-dialog modal-lg">\
						<form autocomplete="off" ng-submit="setValue()">\
							<div class="modal-content">\
								<div class="modal-header">\
									<button type="button" class="close" data-dismiss="modal">\
							    		<span aria-hidden="true">&times;</span>\
							    		<span class="sr-only">Cerrar</span>\
									</button>\
									<h4 class="modal-title">Seleccione vendedor</h4>\
								</div>\
						        <div class="modal-body wrapper-lg" style="padding-bottom:10px">\
						        	<div class="row">\
						        		<div class="col-md-6 col-md-offset-6">\
						        			<div class="input-group">\
												<span class="input-group-addon" data-toggle="tooltip" data-placement="bottom" title="Filtrar">\
													<i class="glyphicon glyphicon-filter"></i>\
												</span>\
												<input type="text" class="form-control" ng-model="searchText">\
											</div>\
						        		</div>\
						        	</div>\
						        	<div class="erp-avatar m-t-lg" style="white-space: nowrap; overflow-x: scroll; height: 200px">\
						        		<div ng-show="data.length" ng-repeat="item in data" class="text-center" style="width:150px; display: inline-block">\
							        		<label class="erp-avatar m-b-none m-r" style="cursor: pointer">\
							        			<input type="radio" name="saleman" ng-model="$parent.selected" ng-value="item.id" />\
							        			<span class="thumb avatar pull-left m-b" style="width: auto; border-width: 3px">\
							        				<img style="width:100px" ng-src="{{ getAvatar(item.avatar) }}">\
							        			</span>\
							    				<div style="display: block; clear: both">\
							    					<p style="max-width: 106px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">\
							    						<strong>{{ item.full_name }}</strong>\
							    					</p>\
						    						<p>Cód. {{ item.code }}</p>\
							    				</div>\
							        		</label>\
							        	</div>\
							        	<div ng-show="!data.length" class="text-center">\
							        		<h3 style="line-height: 120px">No se encontraron coincidencias</h3>\
							        	</div>\
						        	</div>\
						        </div>\
						        <div class="modal-footer">\
									<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>\
									<button ng-disabled="!selected" class="btn btn-primary">Aceptar</button>\
								</div>\
					    	</div>\
						</form>\
				    </div>\
				</div>\
	        '
		};
	}
]);