window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/banks',{
				controller: 'BanksCtrl',
				templateUrl: window.siteUrl('banks'),
				menu: ['maintenance', 'banks']
			})
			.when('/banks/add',{
				controller: 'BanksAddCtrl',
				templateUrl: window.siteUrl('banks/add'),
				breadcrumb: ['Mantenimiento', { 'Marcas': '#/banks'}, 'Agregar'],
				menu: ['maintenance', 'banks']
			})
			.when('/banks/trash',{
				controller: 'BanksTrashCtrl',
				templateUrl: window.siteUrl('banks/trash'),
				breadcrumb: ['Mantenimiento', { 'Marcas': '#/banks' }, 'Papelera'],
				menu: ['maintenance', 'banks']
			})
		;
		;
	}
]);