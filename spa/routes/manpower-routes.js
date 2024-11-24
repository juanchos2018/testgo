window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/manpower/reports',{
				controller: 'ManpowerReportsCtrl',
				templateUrl: window.siteUrl('manpower/reports'),
				breadcrumb: {
					icon: 'fa fa-male',
					path: ['Recursos humanos', 'Reportes']
				},
				menu: ['human-resources', 'reports']
			})
		;
	}
]);