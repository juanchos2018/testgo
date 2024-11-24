window.angular.module('ERP').directive('erpDatatable', [
	'$timeout', '$log',
	function ($timeout, $log) {
		var table;

		return {
			restrict: 'E',
			replace: true,
			scope: {
				columns: '=',
				model: '=',
				selection: '=?',
				fields: '=',
				type: '@?',
				key: '@?',
				selected: '=?',
				dom: '@?'
			},
			compile: function (element) {
				table = element;
			},
			controller: ['$scope', function ($scope) {
				$scope.isAllSelected = function () {
					for (var i = 0; i < $scope.model.length; i++) {
						if (!$scope.model[i].selected) {
							$scope.all = false;
							return false;
						}
					}

					$scope.all = true;
					return true;
				};

				$scope.changeSelectionAll = function (event) {
	                event.preventDefault();

					var value = !$scope.all;
	                console.log(value);
	                var hasSelection = (typeof $scope.selection === 'object');

	                hasSelection && ($scope.selection.length = 0);

					for (var i = 0; i < $scope.model.length; i++) {
						$scope.model[i].selected = value;

	                    value && hasSelection && $scope.selection.push($scope.model[i]);
					}
				};

				$scope.setValue = function (event, i, val) {
					event.preventDefault();

					if ($scope.type === 'multiple') {
						$scope.model[i].selected = val;
						$scope.changeSelection(i);
					} else if ($scope.type === 'single') {
						$scope.selected = $scope.model[i][$scope.key];
					}
				};

				$scope.changeSelection = function (index) {
					if (typeof $scope.selection === 'object') {
						if ($scope.model[index].selected) {
							$scope.selection.push($scope.model[index]);
						} else {
							for (var i = 0; i < $scope.selection.length; i++) {
								if ($scope.selection[i] === $scope.model[index]) {
									$scope.selection.splice(i, 1);
									break;
								}
							}
						}
					}
				};

				$scope.$watch('model', function (newVal, oldVal) {
					if (typeof newVal === 'object' && 'length' in newVal && newVal.length > 0) {
						newVal.forEach(function (objVal) {
							var row = [];
							var control = '<label class="checkbox m-n i-checks">';

							if ($scope.type === 'single') {
								control += '<input type="radio" name="table-options" ng-model="selected" ng-value="data[key]" style="width:0;height:0" />';
							} else if ($scope.type === 'multiple') {
								control += '<input type="checkbox" ng-model="data.selected" ng-change="changeSelection($index)" style="width:0;height:0" />';
							}

							control += '<i></i></label>';

							row.push(control);

							Object.keys(objVal).forEach(function (fieldVal) {
								row.push(objVal[fieldVal]);
							});

							table.find('table').dataTable().fnAddData(row);
						});
					}
				});

				if (typeof $scope.selection === 'object') {
					$scope.selection.length = 0;
				}

				if ($scope.type === 'single' && $scope.key !== undefined && $scope.model.length > 0) {
					$scope.selected = $scope.model[0][$scope.key];
				}
			}],
			link: function (scope, element, attrs) {
				$timeout(function () {
					var config = {
						"bProcessing": true,
						"sDom": (scope.dom || "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-8'i><'col-sm-4'p>>"),
						"sPaginationType": "full_numbers",
						"oLanguage": {
							"sProcessing":     "Procesando...",
						    "sLengthMenu":     "Mostrar _MENU_ registros",
						    "sZeroRecords":    "No se encontraron resultados",
						    "sEmptyTable":     "Ningún dato disponible en esta tabla",
						    "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
						    "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
						    "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
						    "sInfoPostFix":    "",
						    "sSearch":         "Buscar",
						    "sUrl":            "",
						    "sInfoThousands":  ",",
						    "sLoadingRecords": "Cargando...",
						    "oPaginate": {
								"sFirst":    "«",
								"sPrevious": "←",
								"sNext":     "→",
								"sLast":     "»"
							},
						    "oAria": {
						        "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
						        "sSortDescending": ": Activar para ordenar la columna de manera descendente"
						    }
						}
					};

					if (attrs.display !== undefined) {
						config.iDisplayLength = parseInt(attrs.display);
					}

					if (attrs.type !== undefined) {
						config.aoColumns = [
							{"bSearchable": false, "bSortable": false }
						];

						for (var i = 0; i < scope.columns.length; i++) {
							config.aoColumns.push(null);
						}
					}

					element.find('table').dataTable(config);
				});
			},
			template: '\
				<div class="table-responsive">\
					<table class="table table-hover b-t b-light" data-ride="datatables">\
						<thead>\
							<tr>\
								<th ng-if="type === \'multiple\' || type === \'single\'" width="20">\
									<label class="checkbox m-n i-checks" ng-if="type === \'multiple\'" ng-click="changeSelectionAll($event)">\
		                            	<input type="checkbox" data-custom ng-model="all" ng-checked="isAllSelected()" style="width:0;height:0">\
		                            	<i></i>\
		                            </label>\
								</th>\
								<th ng-repeat="col in columns" width="{{col.width}}">{{col.header}}</th>\
							</tr>\
						</thead>\
						<tbody>\
							<tr ng-repeat="data in model" ng-click="setValue($event, $index, !data.selected)">\
								<td ng-if="type === \'multiple\' || type === \'single\'">\
		                            <label class="checkbox m-n i-checks">\
		                            	<input ng-if="type === \'multiple\'" type="checkbox" ng-model="data.selected" ng-change="changeSelection($index)" style="width:0;height:0" />\
		                            	<input ng-if="type === \'single\'" type="radio" name="table-options" ng-model="selected" ng-value="data[key]" style="width:0;height:0" />\
		                            	<i></i>\
		                            </label>\
		                        </td>\
								<td ng-repeat="field in fields">\
									{{(field.type === "date" ? (data[field.name] | date : field.format) : (field.type === "currency" ? (data[field.name] | currency : field.format) : (data[field.name])))}}\
								</td>\
							</tr>\
						</tbody>\
					</table>\
				</div>\
			'
		};
	}
]);