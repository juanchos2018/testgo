window.angular.module('ERP').controller('SeriesAddCtrl', [
    '$scope', '$window', '$location', 'Settings', 'Session', 'Page', 'Ajax',
    function ($scope, $window, $location, Settings, Session, Page, Ajax) {
    	var $ = $window.angular.element;
        var angular = $window.angular;

    	Page.title('Agregar número de serie');

        $scope.companies = []; // Lista de empresas
        $scope.vouchers = angular.copy(Settings.voucherTypes); // Copiando de Settings el arreglo voucherTypes
        $scope.vouchers.splice($scope.vouchers.indexOf('TICKET'), 1); // Removiendo TICKET (porque se debe registrar con una ticketera)

        $scope.record = {
        	company_id: '',
            voucher: '',
            regime: '',
            serie: '',
            serial_number: '',
            subsidiary_journal: '',
            byTicketPrinter: false
        };

        $scope.submit = function () {
            var data = angular.copy($scope.record);

            if (data.byTicketPrinter && $scope.record.voucher === 'NOTA DE CREDITO') {
                data.voucher = 'TICKET NOTA DE CREDITO';
            }

            delete data.byTicketPrinter;

            Ajax.post($window.siteUrl('series/save'), data).then(function (res) {
                Session.setMessage('Se guardó el registro correctamente');
                $location.path('series');
            }, function (err) {
                var errorDetail = (typeof err === 'string' ? err : err.statusText || 'Ocurrió un error al intentar guardar el registro');

                Session.setMessage(errorDetail, 'danger', true);
            });
        };
    }
]);
