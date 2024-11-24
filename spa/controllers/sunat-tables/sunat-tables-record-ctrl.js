window.angular.module('ERP').controller('SunatTablesRecordCtrl', [
	'$scope', '$window', 'Page', 'Ajax', '_bootbox', '_$', '_siteUrl',
	function ($scope, $window, Page, Ajax, bootbox, $, siteUrl) {
		$scope.id = '';
		$scope.description = '';

		$scope.submit = function (e) {
			if ($scope.codes.indexOf($scope.id) < 0) {
				var params = {
					id: $scope.id,
					description: $scope.description,
					items: JSON.stringify($scope.data)
				};

				if ($scope.action === 'add') {
					Ajax.postData(siteUrl('sunat_tables/save'), params, 'sunat_tables', 'Se guardó el registro correctamente', 'Ocurrió un error al registrar la tabla');
				} else if ($scope.action === 'edit') {
					Ajax.postData(siteUrl('sunat_tables/update/' + $scope.originalId), params, 'sunat_tables', 'Se actualizó el registro correctamente', 'Ocurrió un error al actualizar la tabla');

				}
			} else {
				bootbox.alert({
					title: 'No se puede completar la operación',
					message: 'Ya se encuentra registrada una tabla SUNAT N° ' + $scope.id + '.',
					buttons: {
						ok: {
							label: 'Aceptar',
							className: 'btn btn-danger'
						}
					},
					callback: function () {
						$('input[ng-model="id"]').select().focus();
					}
				});
			}
		};
	}
]);
