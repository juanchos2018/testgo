window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/sales', { /* ESTA RUTA DEBERIA ELIMINARSE YA QUE ES AUXILIAR */
				redirectTo: '/sales/point'
			})
			.when('/sales/point',{
				controller: 'SalesPointCtrl',
				templateUrl: window.siteUrl('sales/point'),
				menu: ['sales', 'point'],
				breadcrumb: {
					dropdown: true,
					icon: 'fa fa-shopping-cart',
					path: ['Punto de venta', 'Caja']
				},
				bottomPanel: true
			})
			.when('/sales/add',{
				controller: 'SalesAddCtrl',
				templateUrl: window.siteUrl('sales/add'),
				menu: ['sales', 'add'],
				breadcrumb: {
					icon: 'fa fa-shopping-cart',
					path: ['Punto de venta', 'Registrar documento']
				}
			})
			.when('/sales/settings', {
				controller: 'SalesSettingsCtrl',
				templateUrl: window.siteUrl('sales/settings'),
				menu: ['sales', 'settings'],
				breadcrumb: {
					icon: 'fa fa-shopping-cart',
					path: ['Punto de venta', 'Configuración']
				}
			})
			.when('/sales/operations', {
				controller: 'SalesOperationsCtrl',
				templateUrl: window.siteUrl('sales/operations'),
				menu: ['sales', 'operations'],
				breadcrumb: {
					icon: 'fa fa-shopping-cart',
					path: ['Punto de venta', 'Consultar documento']
				}
			})
	        .when('/sales/detail/:id',{
				controller: 'SalesDetailCtrl',
				templateUrl: function (params) {
					return window.siteUrl('sales/detail/' + params.id);
				},
				menu: ['sales', 'detail'],
				breadcrumb: {
					icon: 'fa fa-shopping-cart',
					path: ['Punto de venta', { 'Consultar documento' : '#/sales/operations' }, 'Detalle']
				}
			})
		;
	}
]);