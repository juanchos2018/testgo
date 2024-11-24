window.angular.module('ERP').directive('erpTime', [
	'$window', '_is',
	function ($window, _is) {
		return {
			restrict: 'AE',
			scope: {
				show24: '=?',
				erpTime: '='
			},
			link: function (scope, element, attrs) {
				var opts = scope.erpTime || {};
				
				opts.show24Hours = (_is.boolean(scope.show24) ? scope.show24 : (_is.boolean(opts.show24Hours) ? opts.show24Hours : true));
				opts.spinnerImage = opts.spinnerImage || '';
				
				element.timeEntry(opts);
			}
		};
	}
]);