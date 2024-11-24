window.angular.module('ERP').directive('dateRangePicker', [
	'$window', '$timeout',
	function ($window, $timeout) {
		var moment = $window.moment;
		
		return {
			scope: {
				dateRangePicker: '=?',
				format: '@?', /* Formato para guardarlo en BD */
				showFormat: '@?', /* Formato para mostrarlo en el INPUT */
				startDate: '@?',
				endDate: '@?',
				onChange: '=?',
				model: '=' /* OJO: no se usa ng-model porque el formato en que se muestra la fecha puede ser distinto al formato del valor en el modelo */
			},
			link: function (scope, element, attrs) {
				var opts = scope.dateRangePicker || {}, startDate, endDate, ignoreWatch = false;
				
				opts.locale = opts.locale || {};
				opts.locale.format = opts.locale.format || scope.showFormat || 'DD/MM/YYYY'; // Formato por defecto comúnmente usado
				opts.locale.applyLabel = opts.locale.applyLabel || 'Aceptar';
				opts.locale.cancelLabel = opts.locale.cancelLabel || 'Cancelar';
				opts.locale.fromLabel = opts.locale.fromLabel || 'De';
				opts.locale.toLabel = opts.locale.toLabel || 'A';
				opts.locale.separator = opts.locale.separator || ' - ';
				opts.locale.customRangeLabel = opts.locale.customRangeLabel || 'Personalizado';
				opts.locale.daysOfWeek = opts.locale.daysOfWeek || ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
				opts.locale.monthNames = opts.locale.monthNames || ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
				
				if (!opts.startDate && scope.startDate) {
					opts.startDate = scope.startDate;
				}
				
				if (!opts.endDate && scope.endDate) {
					opts.endDate = scope.endDate;
				}
				
				opts.autoUpdateInput = opts.autoUpdateInput || false;
				
				scope.format = scope.format || 'YYYY-MM-DD'; // Formato por defecto para PostgreSQL
        scope.model = scope.model || [];
	
				if (scope.model.length === 2) {
					opts.startDate = moment(scope.model[0], scope.format).format(opts.locale.format);
					opts.endDate = moment(scope.model[1], scope.format).format(opts.locale.format);
					
					element.val(opts.startDate + opts.locale.separator + opts.endDate);
					
					if (scope.onChange) {
						scope.onChange.call(element, scope.model[0], scope.model[1]);
					}
				}
				
				element.daterangepicker(opts, function(start, end, label) {
					scope.$apply(function () {
						startDate = start.format(scope.format);
						endDate = end.format(scope.format);
						ignoreWatch = true;
						
            scope.model.length = 0;
            scope.model.push(startDate, endDate);
						//scope.model = [startDate, endDate];
            
						//console.log('callback');
						if (scope.onChange) {
							scope.onChange.call(element, startDate, endDate);
						}
					});
				});
				
				element.on('apply.daterangepicker', function(ev, picker) {
					element.val(picker.startDate.format(opts.locale.format) + opts.locale.separator + picker.endDate.format(opts.locale.format));
				});
				
				if (scope.model.length !== 2 && element.val().length) {
					startDate = element.data('daterangepicker').startDate.format(scope.format);
					endDate = element.data('daterangepicker').endDate.format(scope.format);
					
          scope.model = [startDate, endDate];
					//console.log('inicializacion sin fecha');
					if (scope.onChange) {
						scope.onChange.call(element, startDate, endDate);
					}
				} 
				
				scope.$watch('model', function (newVal, oldVal) {
					if ((!ignoreWatch && !oldVal.length && newVal.length) || (newVal.length === 2 && oldVal.length === 2 && (newVal[0] !== oldVal[0] || newVal[1] !== oldVal[1]))) {
						startDate = moment(newVal[0], scope.format).format(opts.locale.format);
						endDate = moment(newVal[1], scope.format).format(opts.locale.format);
						
						element.data('daterangepicker').setStartDate(startDate);
						element.data('daterangepicker').setEndDate(endDate);
						
						element.val(startDate + opts.locale.separator + endDate);
						//console.log('$watch model');
						if (scope.onChange) {
							scope.onChange.call(element, newVal[0], newVal[1]);
						}
					} else if (ignoreWatch) {
						ignoreWatch = false;
					}
				});
			}
		};
	}
]);