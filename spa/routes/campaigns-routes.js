window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/campaigns',{
				controller: 'CampaignsCtrl',
				templateUrl: window.siteUrl('campaigns'),
				breadcrumb: ['Marketing', 'Campañas'],
				menu: ['marketing', 'campaigns']
			})
			.when('/campaigns/add',{
				controller: 'CampaignsDetailCtrl',
				templateUrl: window.siteUrl('campaigns/add'),
				breadcrumb: ['Marketing', { 'Campañas': '#/campaigns'}, 'Agregar'],
				menu: ['marketing', 'add-campaign']
			})
	        .when('/campaigns/edit/:id',{
				controller: 'CampaignsDetailCtrl',
				templateUrl: function (params) {
					return window.siteUrl('campaigns/edit/' + params.id);
				},
				breadcrumb: ['Marketing', { 'Campañas': '#/campaigns'}, 'Editar'],
				menu: ['marketing', 'campaigns']
			})
	        .when('/campaigns/:id',{
				controller: 'CampaignsDetailCtrl',
				templateUrl: function (params) {
					return window.siteUrl('campaigns/detail/' + params.id);
				},
				breadcrumb: ['Marketing', { 'Campañas': '#/campaigns'}, 'Ver detalle'],
				menu: ['marketing', 'campaigns']
			})
		;
	}
]);