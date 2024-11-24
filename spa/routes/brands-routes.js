window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/brands',{
				controller: 'BrandsCtrl',
				templateUrl: window.siteUrl('brands'),
				menu: ['maintenance', 'brands']
			})
			.when('/brands/add',{
				controller: 'BrandsAddCtrl',
				templateUrl: window.siteUrl('brands/add'),
				breadcrumb: ['Mantenimiento', { 'Marcas': '#/brands'}, 'Agregar'],
				menu: ['maintenance', 'brands']
			})
			.when('/brands/trash',{
				controller: 'BrandsTrashCtrl',
				templateUrl: window.siteUrl('brands/trash'),
				breadcrumb: ['Mantenimiento', { 'Marcas': '#/brands' }, 'Papelera'],
				menu: ['maintenance', 'brands']
			})
		;
	}
]);