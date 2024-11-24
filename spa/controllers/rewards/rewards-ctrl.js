window.angular.module('ERP').controller('RewardsCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Programa de Puntos');

        $scope.rewards = [];
        $scope.selected = [];

        $scope.trash = function () {
            QuickHandler.setUrls(
                ['rewards', 'rewards/trash'],
                'rewards/recycle'
            );
            QuickHandler.move(
                $scope.rewards,
                'id',
                $scope.selected,
                'Registro{s} enviado{s} a la papelera',
                'Ocurrió un error al enviar a papelera'
            );
        };
    }
]);
