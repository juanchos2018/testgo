window.angular.module('ERP').directive('erpSupplierChooser', [
	'$timeout', '$filter', 'Ajax', '_siteUrl', '_bootbox',
	function ($timeout, $filter, Ajax, siteUrl, bootbox) {
		return {
            restrict: 'E',
			scope: {
				model: '=',
				required: '=?',
				disabled: '=?',
				addButton: '=?'
			},
			controller: ['$scope', '$element', function($scope, $element) {
				$scope.required = $scope.required || false;
				$scope.options = [];

				Ajax.get(siteUrl('suppliers/simple_list')).then(function (res) {
					$scope.options = res.data;

					$timeout(function () {
						$element.find('select').trigger('change');
					});
				});

				if (typeof $scope.addButton === 'boolean') {
					$scope.addButton = $scope.addButton || false;
				} else {
					$scope.addButton = true;
				}

				if (typeof $scope.disabled === 'boolean') {
					if ($scope.disabled) {
						$element.find('[ng-model="model"]').prop('disabled', true);
						$element.find('button[type="button"]').prop('disabled', true);
					}

					$scope.$watch('disabled', function (newVal, oldVal) {
						if (newVal !== oldVal) {
							$element.find('[ng-model="model"]').prop('disabled', newVal);
							$element.find('button[type="button"]').prop('disabled', newVal);
						}
					});
				}
				
				$scope.$watch('model', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						var currVal = $element.find('select').val();
						
						if (currVal.toString().indexOf('string:') === 0) {
							currVal = currVal.split(':')[1];
						}
						
						if (newVal !== currVal) { // Quiere decir que no se actualizó el DOM del select
							$timeout(function () {
								$element.find('select').trigger('change');
							});
						}
					}
				});

				$scope.showForm = function () {
					var modalForm = bootbox.dialog({
						message: `
						<div class="alert alert-danger alert-dismissible" style="display:none" role="alert">
							<button type="button" class="close" aria-label="Cerrar"><span aria-hidden="true">&times;</span></button>
							<p name="content"></p>
						</div>
							<form class="form-horizontal" autocomplete="off">
								<div class="form-group required">
									<label class="col-sm-3 control-label">R.U.C.</label>
									<div class="col-sm-5">
										<input type="text" class="form-control" name="id_number" required pattern="^\\d+$">
									</div>
								</div>
								<div class="form-group required">
									<label class="col-sm-3 control-label">Nombre</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" name="name" required>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label">Dirección</label>
									<div class="col-sm-9">
										<input type="text" class="form-control" name="address">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label">Teléfono 1</label>
									<div class="col-sm-5">
										<input type="text" class="form-control" name="phone_number" pattern="^\\+?\\d+$">
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-3 control-label">Teléfono 2</label>
									<div class="col-sm-5">
										<input type="text" class="form-control" name="phone_number2" pattern="^\\+?\\d+$">
									</div>
								</div>
								<button type="submit" class="hidden"></button>
							</form>
						`,
						title: 'Nuevo proveedor',
						buttons: {
							cancel: {
								label: 'Cancelar',
								className: 'btn-default',
							},
							save: {
								label: 'Guardar',
								className: 'btn-primary',
								callback: function () {
									modalForm.find('button[type="submit"]').trigger('click');

									return false;
								}
							}
						},
						onEscape: true,
                        backdrop: true,
                        closeButton: false,
                        show: false
					});

					modalForm.one('show.bs.modal', function () {
						modalForm.find('form').submit(function (e) {
							e.preventDefault();

							Ajax.post(siteUrl('suppliers/save'), new FormData(this)).then(function (res) {
								if (is.json(res.data)) {
									if ('ok' in res.data) {
										var insertId = res.data.result.toString();

										modalForm.modal('hide');

										$scope.options.push({
											id: insertId,
											text: modalForm.find('input[name="name"]').val()
										});

										$scope.model = insertId;

										$timeout(function () {
											$element.find('select[select2]').trigger('change');
										});
									} else {
										console.log('error', res.data.error);
										modalForm.find('.alert').css('display', 'block').find('[name="content"]').text(res.data.error || 'Ocurrió un error');
									}
								} else {
									modalForm.find('.alert').css('display', 'block').find('[name="content"]').text('Ocurrió un error');
								}
							}, function (reason) {
								modalForm.find('.alert').css('display', 'block').find('[name="content"]').text('Ocurrió un error');
							}).finally(function () {
								modalForm.find('input,button').attr('disabled', false);
							});

							modalForm.find('input,button').attr('disabled', true);
						});

						modalForm.find('.alert button.close').on('click', function (e) {
							modalForm.find('.alert').css('display', 'none');
						});
					}).on('shown.bs.modal', function () {
						modalForm.find('input[name="id_number"]').focus();
					}).modal('show');
				};
			}],
            template: `
				<div ng-class="{'input-group': addButton}">
					<select ng-model="model" ng-required="required" select2 style="width:100%" ng-options="s.id as s.text for s in options" data-placeholder="- Seleccione -">
					</select>
					<span class="input-group-btn" ng-if="addButton">
						<button class="btn btn-success" type="button" title="Nuevo proveedor" data-tooltip ng-click="showForm()">
							<i class="fa fa-plus text"></i>
						</button>
					</span>
				</div>
            `
		};
	}
]);
