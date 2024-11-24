window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/customers', {
				controller: 'CustomersCtrl',
				templateUrl: window.siteUrl('customers'),
				breadcrumb: {
          icon: 'fa fa-user',
          path: ['Clientes']
        },
				menu: ['customers']
			})
			.when('/customers/add',{
				controller: 'CustomersAddCtrl',
				templateUrl: window.siteUrl('customers/add'),
				breadcrumb: {
          icon: 'fa fa-user',
          path: [{ 'Clientes': '#/customers/' }, 'Nuevo']
        },
				menu: ['customers', 'add']
			})
			.when('/customers/edit/:id',{
				controller: 'CustomersEditCtrl',
				templateUrl: function(params) {
					return window.siteUrl('customers/edit/' + params.id);
				},
				breadcrumb: {
          icon: 'fa fa-user',
          path: [{ 'Clientes': '#/customers/' }, 'Editar']
        },
				menu: ['customers', 'edit']
				
			})
			.when('/customers/reports',{
				controller: 'CustomersReportsCtrl',
				templateUrl: window.siteUrl('customers/reports'),
				breadcrumb: {
          icon: 'fa fa-user',
          path: [{ 'Clientes': '#/customers/' }, 'Reportes']
        },
				menu: ['customers', 'reports']
			})
		;
	}
]);