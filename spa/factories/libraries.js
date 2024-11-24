window.angular.module('ERP').factory('_is', [
	'$window',
	function ($window) {
	    return $window.is;
	}
]);

window.angular.module('ERP').factory('_angular', [
	'$window',
	function ($window) {
	    return $window.angular;
	}
]);

window.angular.module('ERP').factory('_$', [
	'$window',
	function ($window) {
	    return $window.jQuery;
	}
]);

window.angular.module('ERP').factory('_baseUrl', [
	'$window',
	function ($window) {
	    return $window.baseUrl;
	}
]);

window.angular.module('ERP').factory('_siteUrl', [
	'$window',
	function ($window) {
	    return $window.siteUrl;
	}
]);

window.angular.module('ERP').factory('_URI', [
	'$window',
	function ($window) {
	    return $window.URI;
	}
]);

window.angular.module('ERP').factory('_bootbox', [
	'$window',
	function ($window) {
	    return $window.bootbox;
	}
]);

window.angular.module('ERP').factory('_riot', [
	'$window',
	function ($window) {
	    return $window.riot;
	}
]);

window.angular.module('ERP').factory('_moment', [
	'$window',
	function ($window) {
	    return $window.moment;
	}
]);

window.angular.module('ERP').factory('_nv', [
  '$window',
  function ($window) {
      return $window.nv;
  }
]);

window.angular.module('ERP').factory('_d3', [
  '$window',
  function ($window) {
      return $window.d3;
  }
]);
