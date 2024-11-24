window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/products',{
				controller: 'ProductsCtrl',
				templateUrl: window.siteUrl('products'),
				breadcrumb: {
					icon: 'fa fa-dashboard',
					path: ['Inventario']
				},
				menu: ['logistic', 'products', 'products']
			})
			.when('/products/stocks',{
				controller: 'ProductsStocksCtrl',
				templateUrl: window.siteUrl('products/stocks'),
				breadcrumb: {
					icon: 'fa fa-list-alt',
					path: ['Logística', 'Existencias de productos']
				},
				menu: ['logistic', 'stocks']
			})
			.when('/products/detail/:id',{
				controller: 'ProductsCtrl',
				templateUrl: function (params) {
					return window.siteUrl('products/detail/' + params.id);
				},
				menu: ['products', 'detail'],
				breadcrumb: {
					icon: 'fa fa-pencil',
					path: [{'Productos': '#/products/'}, 'Ficha de Producto']
				}
			})
		;
	}
]);