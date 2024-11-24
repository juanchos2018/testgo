window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/categories',{
				controller: 'CategoriesCtrl',
				templateUrl: window.siteUrl('categories'),
				menu: ['maintenance', 'categories']
			})
			.when('/categories/add',{
				controller: 'CategoriesAddCtrl',
				templateUrl: window.siteUrl('categories/add'),
				breadcrumb: ['Mantenimiento', { 'Marcas': '#/categories'}, 'Agregar'],
				menu: ['maintenance', 'categories']
			})
			.when('/categories/trash',{
				controller: 'CategoriesTrashCtrl',
				templateUrl: window.siteUrl('categories/trash'),
				breadcrumb: ['Mantenimiento', { 'Marcas': '#/categories' }, 'Papelera'],
				menu: ['maintenance', 'categories']
			})
		;
	}
]);