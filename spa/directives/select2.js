window.angular.module('ERP').directive('select2', [
	'$window', '$timeout',
	function ($window, $timeout) {
		return {
			scope: {
				select2: '=?',
				placeholder: '@?',
				allowClear: '=?',
				ngModel: '='
			},
			link: function (scope, element, attrs) {
				scope.opts = scope.select2 || {};
				//scope.started = new Date();

				scope.placeholder && (scope.opts.placeholder = scope.placeholder);
				scope.allowClear && (scope.opts.allowClear = scope.allowClear);

				element.select2(scope.opts);
				
				if (scope.opts.data && scope.opts.data.constructor.name === 'Array') {
					scope.$watch('opts.data', function (newVal, oldVal) {
						if (newVal && oldVal && (newVal.length || oldVal.length)) {
							element.select2('destroy');
							element.select2(scope.opts);
						}
					});
				}
				
				$timeout(function () {
					element.trigger('change');
				});

				// element.on('change', function () {
				// 	console.log('changed');
				// });
				//
				// scope.$watch('ngModel', function (newVal, oldVal) {
				// 	if (newVal !== oldVal && new Date() - scope.started < 1000) {
				// 		if (element.data('select2')) {
				// 			console.log('select2 changed');
				// 			element.select2('destroy');
				//
				// 			$timeout(function () {
				// 				element.select2(scope.opts);
				// 			}, 100);
				// 		}
				// 	}
				// });
			}
		};
	}
]);
