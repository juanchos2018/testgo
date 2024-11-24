window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/purchases/template',{
				controller: 'PurchasesTemplateCtrl',
				templateUrl: window.siteUrl('purchases/template'),
				breadcrumb: {
					icon: 'icon-list',
					path: ['Compras', 'Plantilla']
				},
				menu: ['purchases', 'template']
			})
			.when('/purchases/add',{
				controller: 'PurchasesAddCtrl',
				templateUrl: window.siteUrl('purchases/add'),
				breadcrumb: {
					icon: 'icon-list',
					path: ['Compras', 'Nuevo ingreso']
				},
				menu: ['purchases', 'add']
			})
			.when('/purchases', {
				controller: 'PurchasesCtrl',
				templateUrl: window.siteUrl('purchases'),
				menu: ['purchases', 'list'],
				breadcrumb: {
					icon: 'icon-list',
					path: ['Compras']
				}
			})
			.when('/purchases/detail/:id',{
				controller: 'PurchasesDetailCtrl',
				templateUrl: function (params) {
					return window.siteUrl('purchases/detail/' + params.id);
				},
				menu: ['purchases', 'list'],
				breadcrumb: {
					icon: 'fa fa-pencil',
					path: [{'Compras': '#/purchases'}, 'Detalle de compra']
				}
			})
		;
	}
]);
