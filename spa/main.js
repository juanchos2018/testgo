/*
	Declara la variable global y sus dependencias
	para acceder al mòdulo principal ERP
*/

(function () {
	var ERP = window.angular.module('ERP', [
		'ngRoute',
		'ngAnimate',
		'ngSanitize',
		'nvd3',
		'breakpointApp'
	]);
})();
