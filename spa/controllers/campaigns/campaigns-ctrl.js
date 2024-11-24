window.angular.module('ERP').controller('CampaignsCtrl', [
    '$scope', '$window', 'Page',
    function ($scope, $window, Page) {
    	var $ = $window.angular.element;

    	Page.title('Campañas');

        $scope.records = [];
    }
]);
