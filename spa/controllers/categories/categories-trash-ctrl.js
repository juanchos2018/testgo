window.angular.module('ERP').controller('CategoriesTrashCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Papelera de marcas');

        $scope.categories = [];
        $scope.selected = [];

        $scope.restore = function () {
            QuickHandler.setUrls(
                ['categories', 'categories/trash'],
                'categories/restore'
            );
            QuickHandler.move(
                $scope.categories,
                'id',
                $scope.selected,
                'Registro{s} restaurado{s} correctamente',
                'Ocurrió un error al restaurar'
            );
        };

        $scope.delete = function () {
            QuickHandler.setUrls(
                'categories/trash',
                'categories/remove'
            );
            QuickHandler.move(
                $scope.categories,
                'id',
                $scope.selected,
                'Registro{s} eliminado{s} correctamente',
                'Ocurrió un error al eliminar'
            );
        };
    }
]);
