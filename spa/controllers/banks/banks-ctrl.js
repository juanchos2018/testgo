window.angular.module('ERP').controller('BanksCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Mantenimiento - Bancos');

        $scope.banks = [];
        $scope.selected = [];

        $scope.trash = function () {
            QuickHandler.setUrls(
                ['banks', 'banks/trash'],
                'banks/recycle'
            );
            QuickHandler.move(
                $scope.banks,
                'id',
                $scope.selected,
                'Registro{s} enviado{s} a la papelera',
                'Ocurrió un error al enviar a papelera'
            );
        };
    }
]);
