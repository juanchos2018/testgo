window.angular.module('ERP').directive('erpFocus', [
	'$timeout',
	function ($timeout) {
		return {
			scope: {},
			link: function (scope, element, attrs) {
				element.focus();
			}
		};
	}
]);