window.angular.module('ERP').directive('erpChosen', [
	'$window',
	function ($window) {
		var $ = $window.jQuery;

		return {
			scope: {
				erpChosen: '=?' // Options
			},
			link: function (scope, element, attrs) {
				var opts = scope.erpChosen || {};

				$(element).chosen(opts);
			}
		};
	}
]);
