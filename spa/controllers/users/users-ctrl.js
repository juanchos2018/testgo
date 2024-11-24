window.angular.module('ERP').controller('UsersCtrl', [
	'$scope', '$rootScope', '$window', 'Page',
	function ($scope, $rootScope, $window, Page) {
	    Page.title('Usuarios');

	    $scope.users = [];
	    $scope.selected = [];
	}
]);
