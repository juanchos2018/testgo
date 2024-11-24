/*Accountancy and Financial*/
window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/accountancy/sales',{
				controller: 'AccountancySalesCtrl',
				templateUrl: window.siteUrl('accountancy/sales'),
				breadcrumb: ['Contabilidad y Finanzas', 'Registro de ventas'],
				menu: ['accountant', 'sales']
			})
			.when('/accountancy/customers',{
				controller: 'AccountancyCustomersCtrl',
				templateUrl: window.siteUrl('accountancy/customers'),
				breadcrumb: {
					icon: 'fa fa-cog',
					path: ['Contabilidad']
				},
				menu: ['accountant', 'customers']
			})
			.when('/accountancy/exchange_rates',{
				controller: 'AccountancyExchangeRatesCtrl',
				templateUrl: window.siteUrl('accountancy/exchange_rates'),
				breadcrumb: {
					icon: 'fa fa-usd',
					path: ['Contabilidad y finanzas', 'Tipo de cambio']
				},
				menu: ['accountant', 'exchange']
			})
			.when('/accountancy/edit_exchange_rate/:id', {
				controller: 'AccountancyEditExchangeRateCtrl',
				templateUrl: function (params) {
					return window.siteUrl('accountancy/edit_exchange_rate/' + params.id);
				},
				breadcrumb: {
					icon: 'fa fa-usd',
					path: ['Contabilidad y finanzas', { 'Tipo de cambio': '#/accountancy/exchange_rates' }, 'Editar']
				},
				menu: ['accountant', 'exchange']
			})
			.when('/sunat_tables', {
				controller: 'SunatTablesCtrl',
				templateUrl: window.siteUrl('sunat_tables'),
				breadcrumb: {
					icon: 'fa fa-usd',
					path: ['Contabilidad y finanzas', 'Tablas SUNAT']
				},
				menu: ['accountant', 'sunat']
			})
			.when('/sunat_tables/add', {
				controller: 'SunatTablesRecordCtrl',
				templateUrl: window.siteUrl('sunat_tables/add'),
				breadcrumb: {
					icon: 'fa fa-usd',
					path: ['Contabilidad y finanzas', { 'Tablas SUNAT': '#/sunat_tables' }, 'Nuevo']
				},
				menu: ['accountant', 'sunat']
			})
			.when('/sunat_tables/edit/:id', {
				controller: 'SunatTablesRecordCtrl',
				templateUrl: function (params) {
					return window.siteUrl('sunat_tables/edit/' + params.id);
				},
				breadcrumb: {
					icon: 'fa fa-usd',
					path: ['Contabilidad y finanzas', { 'Tablas SUNAT': '#/sunat_tables' }, 'Editar']
				},
				menu: ['accountant', 'sunat']
			})
			.when('/sunat_tables/:id', {
				controller: 'SunatTablesRecordCtrl',
				templateUrl: function (params) {
					return window.siteUrl('sunat_tables/detail/' + params.id);
				},
				breadcrumb: {
					icon: 'fa fa-usd',
					path: ['Contabilidad y finanzas', { 'Tablas SUNAT': '#/sunat_tables' }, 'Ver detalle']
				},
				menu: ['accountant', 'sunat']
			})
		;
	}
]);

