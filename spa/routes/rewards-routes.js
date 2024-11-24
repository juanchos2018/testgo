window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/rewards',{
				controller: 'RewardsCtrl',
				templateUrl: window.siteUrl('rewards'),
				breadcrumb: ['Marketing', 'Programa de Puntos'],
				menu: ['marketing', 'points']
			})
			.when('/rewards/add',{
				controller: 'RewardsAddCtrl',
				templateUrl: window.siteUrl('rewards/add'),
				breadcrumb: ['Marketing', { 'Programa de Puntos': '#/rewards'}, 'Agregar'],
				menu: ['marketing', 'points']
			})
	        .when('/rewards/edit/:id',{
				controller: 'RewardsEditCtrl',
				templateUrl: function (params) {
					return window.siteUrl('rewards/edit/' + params.id);
				},
				breadcrumb: ['Marketing', { 'Programa de Puntos': '#/rewards'}, 'Editar'],
				menu: ['marketing', 'points']
			})
			.when('/rewards/trash',{
				controller: 'RewardsTrashCtrl',
				templateUrl: window.siteUrl('rewards/trash'),
				breadcrumb: ['Marketing', { 'Programa de Puntos': '#/rewards'}, 'Papelera'],
				menu: ['marketing', 'points']
			})
		;
	}
]);