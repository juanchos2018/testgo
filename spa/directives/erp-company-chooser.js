window.angular.module('ERP').directive('erpCompanyChooser', [
	'$timeout', 'Settings',
	function ($timeout, Settings) {
		return {
            restrict: 'E',
			replace: true,
			link: function (scope, element, attrs) {
				if (attrs.showEmpty === 'false') {
					scope.showEmpty = false;

					attrs.selectFirst !== undefined && attrs.selectFirst !== 'false' && $timeout(function () {
						element.val(element.find('option:first').val()).trigger('change');
					});
				} else {
					scope.showEmpty = true;
				}
			},
            template: `
                <select ng-options="c.company_id as c.company_name for c in Settings.getCompaniesOfBranch()">
                    <option value="" ng-if="showEmpty">- Seleccione -</option>
                </select>
            `
		};
	}
]);
