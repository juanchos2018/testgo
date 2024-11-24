window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/settings/sales', {
				controller: 'SettingsSalesCtrl',
				templateUrl: window.siteUrl('settings/sales'),
				menu: ['settings', 'sales'],
				breadcrumb: {
					icon: 'fa fa-cog',
					path: ['Configuración', 'Ventas']
				}
			})
			.otherwise({
				redirectTo: '/'
			});
		;
	}
]);
