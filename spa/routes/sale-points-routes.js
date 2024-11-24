window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/sale_points',{
				controller: 'SalePointsCtrl',
				templateUrl: window.siteUrl('sale_points'),
				breadcrumb: ['Mantenimiento', 'Puntos de Venta'],
				menu: ['maintenance', 'points']
			})
			.when('/sale_points/add',{
				controller: 'SalePointsAddCtrl',
				templateUrl: window.siteUrl('sale_points/add'),
				breadcrumb: ['Mantenimiento', { 'Puntos de Venta': '#/sale_points' }, 'Agregar'],
				menu: ['maintenance', 'points']
			})
	        .when('/sale_points/edit/:id',{
				controller: 'SalePointsEditCtrl',
				templateUrl: function (params) {
					return window.siteUrl('sale_points/edit/' + params.id);
				},
				breadcrumb: ['Mantenimiento', { 'Puntos de Venta': '#/sale_points' }, 'Editar'],
				menu: ['maintenance', 'points']
			})
		;
	}
]);