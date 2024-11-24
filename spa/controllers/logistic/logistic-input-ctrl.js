window.angular.module('ERP').controller('LogisticInputCtrl', [
	'$scope', 'Page',
	function ($scope,Page) {
	    Page.title('Ingresos');
	    $scope.users = [];
	    
	    $scope.getInputs = function () {
	        return "gato";
	    };

	    $scope.prueba = $scope.getInputs();
	}
]);
