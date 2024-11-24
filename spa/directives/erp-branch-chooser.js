window.angular.module('ERP').directive('erpBranchChooser', [
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
                <select ng-options="c.branch_id as c.branch_alias + ' - ' + c.branch_department for c in Settings.branches">
                    <option value="" ng-if="showEmpty">- Seleccione -</option>
                </select>
            `
		};
	}
]);
