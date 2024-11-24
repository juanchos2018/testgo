window.angular.module('ERP').controller('RewardsTrashCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, QuickHandler) {
        var $ = $window.angular.element;

        Page.title('Papelera de Programa de Puntos');

        $scope.rewards = [];
        $scope.selected = [];

        $scope.restore = function () {
            QuickHandler.setUrls(
                ['rewards', 'rewards/trash'],
                'rewards/restore'
            );
            QuickHandler.move(
                $scope.rewards,
                'id',
                $scope.selected,
                'Registro{s} restaurado{s} correctamente',
                'Ocurrió un error al restaurar'
            );
        };

        $scope.delete = function () {
            QuickHandler.setUrls(
                'rewards/trash',
                'rewards/remove'
            );
            QuickHandler.move(
                $scope.rewards,
                'id',
                $scope.selected,
                'Registro{s} eliminado{s} correctamente',
                'Ocurrió un error al eliminar'
            );
        };
    }
]);
