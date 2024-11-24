window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/', {
				controller: 'DashboardStartCtrl',
				templateUrl: window.siteUrl('dashboard/start'),
				menu: ['dashboard']
			})
			.otherwise({
				redirectTo: '/'
			});
		;
	}
]);
