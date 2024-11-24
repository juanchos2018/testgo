window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/invoices',{
				controller: 'InvoicesCtrl',
				templateUrl: window.siteUrl('invoices')
			})
		;
	}
]);