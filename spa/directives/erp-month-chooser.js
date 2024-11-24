window.angular.module('ERP').directive('erpMonthChooser', [
	'$timeout',
	function ($timeout) {
		return {
            restrict: 'E',
			replace: true,
			link: function (scope, element, attrs) {
				scope.months = [
					{val: 0, text: 'Enero'},
					{val: 1, text: 'Febrero'},
					{val: 2, text: 'Marzo'},
					{val: 3, text: 'Abril'},
					{val: 4, text: 'Mayo'},
					{val: 5, text: 'Junio'},
					{val: 6, text: 'Julio'},
					{val: 7, text: 'Agosto'},
					{val: 8, text: 'Septiembre'},
					{val: 9, text: 'Octubre'},
					{val: 10, text: 'Noviembre'},
					{val: 11, text: 'Diciembre'}
				];

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
                <select ng-options="m.val as m.text for m in months">
                    <option value="" ng-if="showEmpty">- Seleccione -</option>
                </select>
            `
		};
	}
]);
