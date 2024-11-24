window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/logistic/dashboard',{
				controller: 'SalesCtrl',
				templateUrl: window.siteUrl('sales'),
				breadcrumb: {
					icon: 'fa fa-dashboard',
					path: ['Ventas']
				},
				menu: ['logistic']
			})
			
			.when('/logistic/inputs',{
				controller: 'LogisticInputCtrl',
				templateUrl: window.siteUrl('inputs'),
				breadcrumb: {
					icon: 'fa fa-user',
					path: ['Ingresos']
				},
				menu: ['logistic', 'movements', 'inputs']
			})
			.when('/logistic/initial_inventory',{
				controller: 'InventoryInitialCtrl',
				templateUrl: window.siteUrl('inventory/initial_inventory'),
				breadcrumb: {
					icon: 'fa fa-user',
					path: ['Inventario', 'Inventario Inicial']
				},
				menu: ['logistic', 'inventory', 'initial']
			})
			.when('/logistic/inventory',{
				controller: 'InventoryCtrl',
				templateUrl: window.siteUrl('inventory'),
				breadcrumb: {
					icon: 'fa fa-list-alt',
					path: ['Logística', 'Inventario']
				},
				menu: ['logistic', 'inventory']
			})
			.when('/logistic/kardex',{
				controller: 'InventoryKardexCtrl',
				templateUrl: window.siteUrl('inventory/kardex'),
				breadcrumb: {
					icon: 'fa fa-list-alt',
					path: ['Logística', 'Kárdex por producto']
				},
				menu: ['logistic', 'kardex']
			})
		;
	}
]);