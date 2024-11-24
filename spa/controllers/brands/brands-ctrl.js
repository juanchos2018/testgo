window.angular.module('ERP').controller('BrandsCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Mantenimiento - Marcas');

        $scope.brands = [];
        $scope.selected = [];

        $scope.trash = function () {
            QuickHandler.setUrls(
                ['brands', 'brands/trash'],
                'brands/recycle'
            );
            QuickHandler.move(
                $scope.brands,
                'id',
                $scope.selected,
                'Registro{s} enviado{s} a la papelera',
                'Ocurrió un error al enviar a papelera'
            );
        };
    }
]);
