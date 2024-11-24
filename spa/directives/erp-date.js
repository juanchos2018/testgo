window.angular.module('ERP').directive('erpDate', [
	'$window',
	function ($window) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				format: '@?',
				ngModel: '='
			},
			controller: ['$scope', '$element', function($scope, $element) {
				$element.on('changeDate', function (e) {
	                $scope.$apply(function () {
	                	$scope.ngModel = $window.moment(e.date).format('DD/MM/YYYY');
	                });
	                $element.datepicker('hide');
	            });
			}],
			link: function (scope, element, attrs) {
				if (attrs.format !== undefined) {
					element.data('dateFormat', attrs.format);
				}
	
	            element.on('keydown', function (e) {
	            	if (e.keyCode === 9) { // TAB
	            		element.datepicker('setValue', element.val()).datepicker('hide');
	                    
	                    scope.ngModel = $window.moment(element.data('datepicker').date).format('DD/MM/YYYY');
	                    scope.$apply();
	            	}
	            });
	
				element.datepicker();
	
	            if (scope.ngModel.length) {
	            	scope.ngModel = $window.moment(scope.ngModel).format('DD/MM/YYYY');
	                element.data('datepicker').setValue(scope.ngModel);
	            }
			},
			template: '<input type="text" data-trigger="change" data-required="true" class="datepicker-input form-control" value="" />'
		};
	}
]);