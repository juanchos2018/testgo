window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/transfers/template',{
				controller: 'TransfersTemplateCtrl',
				templateUrl: window.siteUrl('transfers/template'),
				breadcrumb: {
					icon: 'icon-list',
					path: ['Traslados', 'Plantilla']
				},
				menu: ['transfers', 'template']
			})
			.when('/transfers/add',{
				controller: 'TransfersAddCtrl',
				templateUrl: window.siteUrl('transfers/add'),
				breadcrumb: {
					icon: 'icon-list',
					path: ['Traslados', 'Nuevo traslado']
				},
				menu: ['transfers', 'add']
			})
			.when('/transfers', {
				controller: 'TransfersCtrl',
				templateUrl: window.siteUrl('transfers'),
				menu: ['transfers', 'list'],
				breadcrumb: {
					icon: 'icon-list',
					path: ['Traslados']
				}
			})
			.when('/transfers/detail/:id',{
				controller: 'TransfersDetailCtrl',
				templateUrl: function (params) {
					return window.siteUrl('transfers/detail/' + params.id);
				},
				menu: ['transfers', 'list'],
				breadcrumb: {
					icon: 'fa fa-pencil',
					path: [{'Traslados': '#/transfers'}, 'Detalle de Traslado']
				}
			})
		;
	}
]);
