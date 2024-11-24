window.angular.module('ERP').controller('SunatTablesCtrl', [
	'$scope', '$window', 'Page', 'Ajax', '_siteUrl', 'Session', '_bootbox',
	function ($scope, $window, Page, Ajax, siteUrl, Session, bootbox) {
		Page.title('Tablas SUNAT');

		$scope.data = [];

		$scope.delete = function (item) {
            bootbox.confirm({
                title: '¿Está seguro?',
                message: 'Está a punto de eliminar la tabla N° ' + item.id + ', esta acción no podrá deshacerse.',
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
                    	Ajax.postData(siteUrl('sunat_tables/delete'), {id: item.id}).then(function (data) {
                    		if (data.ok) {
                    			Session.setMessage('Se eliminó el registro correctamente', 'success', true);
                    		} else {
                    			Session.setMessage(data.error || 'Ocurrió un error', 'danger', true);
                    		}

                    		$scope.data.splice($scope.data.indexOf(item), 1);
                    		$scope.$apply();
                    	}, function (reason) {
                    		Session.setMessage(reason || 'Ocurrió un error', 'danger', true);

                    		$scope.$apply();
                    	});
                    }
                }
            });
		};
	}
]);
