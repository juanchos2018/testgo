window.angular.module('ERP').controller('BanksTrashCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Papelera de bancos');

        $scope.banks = [];
        $scope.selected = [];

        $scope.restore = function () {
            QuickHandler.setUrls(
                ['banks', 'banks/trash'],
                'banks/restore'
            );
            QuickHandler.move(
                $scope.banks,
                'id',
                $scope.selected,
                'Registro{s} restaurado{s} correctamente',
                'Ocurrió un error al restaurar'
            );
        };

        $scope.delete = function () {
            QuickHandler.setUrls(
                'banks/trash',
                'banks/remove'
            );
            QuickHandler.move(
                $scope.banks,
                'id',
                $scope.selected,
                'Registro{s} eliminado{s} correctamente',
                'Ocurrió un error al eliminar'
            );
        };
    }
]);
