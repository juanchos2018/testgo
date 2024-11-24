window.angular.module('ERP').controller('BrandsTrashCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Papelera de marcas');

        $scope.brands = [];
        $scope.selected = [];

        $scope.restore = function () {
            QuickHandler.setUrls(
                ['brands', 'brands/trash'],
                'brands/restore'
            );
            QuickHandler.move(
                $scope.brands,
                'id',
                $scope.selected,
                'Registro{s} restaurado{s} correctamente',
                'Ocurrió un error al restaurar'
            );
        };

        $scope.delete = function () {
            QuickHandler.setUrls(
                'brands/trash',
                'brands/remove'
            );
            QuickHandler.move(
                $scope.brands,
                'id',
                $scope.selected,
                'Registro{s} eliminado{s} correctamente',
                'Ocurrió un error al eliminar'
            );
        };
    }
]);
