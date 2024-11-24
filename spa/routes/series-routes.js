window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/series',{
				controller: 'SeriesCtrl',
				templateUrl: window.siteUrl('series'),
				breadcrumb: ['Mantenimiento', 'Números de serie'],
				menu: ['maintenance', 'series']
			})
			.when('/series/add',{
				controller: 'SeriesAddCtrl',
				templateUrl: window.siteUrl('series/add'),
				breadcrumb: ['Mantenimiento', { 'Números de serie': '#/series' }, 'Agregar'],
				menu: ['maintenance', 'series']
			})
	        .when('/series/edit/:id',{
				controller: 'SeriesEditCtrl',
				templateUrl: function (params) {
					return window.siteUrl('series/edit/' + params.id);
				},
				breadcrumb: ['Mantenimiento', { 'Números de serie': '#/series' }, 'Editar'],
				menu: ['maintenance', 'series']
			})
		;
	}
]);
