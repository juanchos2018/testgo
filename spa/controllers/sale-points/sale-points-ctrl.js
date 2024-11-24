window.angular.module('ERP').controller('SalePointsCtrl', [
    '$scope', '$window', 'Page',
    function ($scope, $window, Page) {
    	var $ = $window.angular.element;

    	Page.title('Puntos de venta');

        $scope.salePoints = [];
        $scope.selected = [];
    }
]);
