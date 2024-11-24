window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/purchase-orders/template', {
				controller: 'PurchaseOrdersTemplateCtrl',
				templateUrl: window.siteUrl('purchase_orders/template'),
				menu: ['purchase-orders', 'template'],
				breadcrumb: {
					icon: 'fa fa-pencil icon',
					path: ['Pedidos', 'Plantilla']
				}
			})
			.when('/purchase-orders', {
				controller: 'PurchaseOrdersCtrl',
				templateUrl: window.siteUrl('purchase_orders'),
				menu: ['purchase-orders', 'list'],
				breadcrumb: {
					icon: 'fa fa-pencil',
					path: ['Pedidos']
				}
			})
			.when('/purchase-orders/add', {
				controller: 'PurchaseOrdersAddCtrl',
				templateUrl: window.siteUrl('purchase_orders/add'),
				menu: ['purchase-orders', 'add'],
				breadcrumb: {
					icon: 'fa fa-pencil',
					path: [{'Pedidos': '#/purchase-orders'}, 'Agregar pedido']
				}
			})
			.when('/purchase-orders/detail/:id',{
				controller: 'PurchaseOrdersDetailCtrl',
				templateUrl: function (params) {
					return window.siteUrl('purchase_orders/detail/' + params.id);
				},
				menu: ['purchase-orders', 'list'],
				breadcrumb: {
					icon: 'fa fa-pencil',
					path: [{'Pedidos': '#/purchase-orders'}, 'Detalle de pedido']
				}
			})
			.when('/purchase-orders/edit/:id',{
				controller: 'PurchaseOrdersEditCtrl',
				templateUrl: function (params) {
					return window.siteUrl('purchase_orders/edit/' + params.id);
				},
				menu: ['purchase-orders', 'list'],
				breadcrumb: {
					icon: 'fa fa-pencil',
					path: [{'Pedidos': '#/purchase-orders'}, 'Editar pedido']
				}
			})
		;
	}
]);
