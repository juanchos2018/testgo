window.angular.module('ERP').controller('SubcategoriesCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Mantenimiento - Sub Categorías');

        $scope.subcategories = [];
        $scope.selected = [];

        $scope.trash = function () {
            QuickHandler.setUrls(
                ['subcategories', 'subcategories/trash'],
                'subcategories/recycle'
            );
            QuickHandler.move(
                $scope.subcategories,
                'id',
                $scope.selected,
                'Registro{s} enviado{s} a la papelera',
                'Ocurrió un error al enviar a papelera'
            );
        };
    }
]);
