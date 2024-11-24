window.angular.module('ERP').controller('SubcategoriesTrashCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Papelera de marcas');

        $scope.subcategories = [];
        $scope.selected = [];

        $scope.restore = function () {
            QuickHandler.setUrls(
                ['subcategories', 'subcategories/trash'],
                'subcategories/restore'
            );
            QuickHandler.move(
                $scope.subcategories,
                'id',
                $scope.selected,
                'Registro{s} restaurado{s} correctamente',
                'Ocurrió un error al restaurar'
            );
        };

        $scope.delete = function () {
            QuickHandler.setUrls(
                'subcategories/trash',
                'subcategories/remove'
            );
            QuickHandler.move(
                $scope.subcategories,
                'id',
                $scope.selected,
                'Registro{s} eliminado{s} correctamente',
                'Ocurrió un error al eliminar'
            );
        };
    }
]);
