window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/testing',{
				controller: 'TestingDatepickerCtrl',
				templateUrl: window.siteUrl('testing/datepicker'),
				breadcrumb: ['Testing'],
				menu: ['settings', 'testing']
			})
			.when('/migration',{
				controller: 'TestingMigrationCtrl',
				templateUrl: window.siteUrl('testing/migration'),
				breadcrumb: ['Mantenimiento', 'Migración'],
				menu: ['maintenance', 'migration']
			})
			.when('/migration/purchase',{
				controller: 'TestingMigrationPurchaseCtrl',
				templateUrl: window.siteUrl('testing/purchase'),
				breadcrumb: ['Mantenimiento', 'Migración de compra'],
				menu: ['maintenance', 'purchase']
			})
			.when('/migration/transfer',{
				controller: 'TestingMigrationTransferCtrl',
				templateUrl: window.siteUrl('testing/transfer'),
				breadcrumb: ['Mantenimiento', 'Migración de traslados'],
				menu: ['maintenance', 'transfer']
			})
		;
	}
]);
