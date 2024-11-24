window.angular.module('ERP').controller('AccountancyEditExchangeRateCtrl', [
    '$scope', '$window', '$location', 'Page', 'Ajax', 'Session',
    function ($scope, $window, $location, Page, Ajax, Session) {
        var angular = $window.angular,
            $ = angular.element;

        Page.title('Editar tipo de cambio');

        $scope.update = function () {
            var item = $scope.record;

            Ajax.post($window.siteUrl('accountancy/update_exchange_rate'), {
                money_abbrev: item.money_abbrev,
                purchase_value: item.purchase_value,
                sale_value: item.sale_value,
            }).then(function (res) {
                Session.setMessage('Se actualizó el tipo de cambio correctamente');
                $location.path('accountancy/exchange_rates');
            }, function (err) {
                var errorMessage = err.statusText || 'Ocurrió un error al actualizar el tipo de cambio';

                Session.setMessage(errorMessage, 'danger', true);
            });
        };
    }
]);