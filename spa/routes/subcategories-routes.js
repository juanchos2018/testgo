window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/subcategories',{
				controller: 'SubcategoriesCtrl',
				templateUrl: window.siteUrl('subcategories'),
				menu: ['maintenance', 'subcategories']
			})
			.when('/subcategories/add',{
				controller: 'SubcategoriesAddCtrl',
				templateUrl: window.siteUrl('subcategories/add'),
				breadcrumb: ['Mantenimiento', { 'Sub categorias': '#/subcategories'}, 'Agregar'],
				menu: ['maintenance', 'subcategories']
			})
			.when('/subcategories/trash',{
				controller: 'SubcategoriesTrashCtrl',
				templateUrl: window.siteUrl('subcategories/trash'),
				breadcrumb: ['Mantenimiento', { 'Sub categorias': '#/subcategories' }, 'Papelera'],
				menu: ['maintenance', 'subcategories']
			})
		;
	}
]);