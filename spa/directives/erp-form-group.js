window.angular.module('ERP').directive('erpFormGroup', [
	'$window', '$document', '$location',
	function ($window, $document, $location) {
		var $ = $window.jQuery, formGroups = {};

		return {
			scope: {
				erpFormGroup: '@',
				submit: '=?'
			},
			link: function (scope, element, attrs) {
				var groupKey = $location.path() + ':' + scope.erpFormGroup;

				if ( !(groupKey in formGroups) ) {
					formGroups[groupKey] = $(`<form id="${scope.erpFormGroup}" style="display:none"></form>`).appendTo($document[0].body);
				}

				if (scope.submit && !formGroups[groupKey].data('submit')) {
					formGroups[groupKey].data('submit', true).submit(function (e) {
						e.preventDefault();

						scope.submit.call(this, e);

						return false;
					});
				}

				$(element).attr('form', scope.erpFormGroup);
			}
		};
	}
]);
