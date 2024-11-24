window.angular.module('ERP').controller('SalesCtrl', [
	'$scope', '$rootScope', '$window', 'Page',
	function ($scope, $rootScope, $window, Page) {
	    Page.title('Ventas');

	    $scope.sales = [];
	    $scope.selected = [];
	}
]);
