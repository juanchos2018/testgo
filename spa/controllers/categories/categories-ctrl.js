window.angular.module('ERP').controller('CategoriesCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Mantenimiento - Categorías');

        $scope.categories = [];
        $scope.selected = [];

        $scope.trash = function () {
            QuickHandler.setUrls(
                ['categories', 'categories/trash'],
                'categories/recycle'
            );
            QuickHandler.move(
                $scope.categories,
                'id',
                $scope.selected,
                'Registro{s} enviado{s} a la papelera',
                'Ocurrió un error al enviar a papelera'
            );
        };
    }
]);
