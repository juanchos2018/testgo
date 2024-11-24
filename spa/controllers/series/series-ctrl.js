window.angular.module('ERP').controller('SeriesCtrl', [
    '$scope', '$window', 'Page',
    function ($scope, $window, Page) {
    	var $ = $window.angular.element;

    	Page.title('Números de serie');

        $scope.series = [];
    }
]);
