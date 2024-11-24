window.angular.module('ERP').directive('datePicker', [
	'$window',
	function ($window) {
		var moment = $window.moment;

		return {
			scope: {
				datePicker: '=?',
				ngDisabled: '=?',
				format: '@?', /* Formato para guardarlo en BD */
				showFormat: '@?', /* Formato para mostrarlo en el INPUT */
				model: '=' /* OJO: no se usa ng-model porque el formato en que se muestra la fecha puede ser distinto al formato del valor en el modelo */
			},
			link: function (scope, element, attrs) {
				var opts = scope.datePicker || {};

				opts.format = opts.format || scope.showFormat || 'dd/mm/yyyy';
				opts.autoclose = opts.autoclose || true;
				opts.language = opts.language || 'es';

				scope.format = scope.format || 'YYYY-MM-DD';

				element.datepicker(opts).on('changeDate', function (e) {
	   				scope.$apply(function () {
	   					scope.model = moment(e.date).format(scope.format);
	   				});
	   			}).on('clearDate', function () {
	   				scope.$apply(function () {
	   					scope.model = '';
	   				});
	   			});

	            if (scope.model.length) {
					element.datepicker('update', moment(scope.model, scope.format).toDate());
	            }

				scope.$watch('model', function (newVal, oldVal) {
					if (newVal !== oldVal) {
						element.datepicker('update', moment(newVal, scope.format).toDate());
					}
				});

				if (typeof scope.ngDisabled === 'boolean') {
					scope.$watch('ngDisabled', function (newVal, oldVal) {
						if (newVal !== oldVal) {
							element.prop('disabled', newVal);
						}
					});
				}
			}
		};
	}
]);
