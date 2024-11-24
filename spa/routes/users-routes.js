window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			/*.when('/login', {
				controller: 'UsersLoginCtrl',
				templateUrl: window.siteUrl('users/login'),
				public: true
			})
			.when('/login/recovery', {
				controller: 'UsersRecoveryCtrl',
				templateUrl: window.siteUrl('users/recover_account'),
				public: true
			})*/
			.when('/users',{
				controller: 'UsersCtrl',
				templateUrl: window.siteUrl('users'),
				breadcrumb: {
					icon: 'fa fa-male',
					path: ['Recursos humanos', 'Usuarios']
				},
				menu: ['human-resources', 'users']
			})
	        .when('/users/add',{
				controller: 'UsersAddCtrl',
				templateUrl: window.siteUrl('users/add'),
				breadcrumb: {
					icon: 'fa fa-male',
					path: ['Recursos humanos', { 'Usuarios': '#/users'}, 'Agregar']
				},
				menu: ['human-resources', 'users']
			})
	        .when('/users/edit/:id',{
				controller: 'UsersEditCtrl',
				templateUrl: function (params) {
					return window.siteUrl('users/edit/' + params.id);
				},
				breadcrumb: {
					icon: 'fa fa-male',
					path: ['Recursos humanos', { 'Usuarios': '#/users'}, 'Editar']
				},
				menu: ['human-resources', 'users']
			})
		;
	}
]);