window.angular.module('ERP').directive('erpNumberInput', [
    '$timeout', '$filter',
    function ($timeout, $filter) {
        return {
            restrict: 'A',
            scope: {
                model: '=',
                decimals: '@'
            },
            link: function (scope, element, attrs) {
                scope.decimals = (typeof scope.decimals === 'number' ? scope.decimals : 2);

                if (!scope.decimals) {
                    element.attr('pattern', "[\\d\\,]+");
                } else {
                    element.attr('pattern', "[\\d]+(\\.\\d{" + scope.decimals + "})?");
                }

                element.blur(function () {
                    if (this.value.length && !isNaN(this.value)) {
                        scope.model = parseFloat(this.value);
                    } else if (!this.value.length) {
                        scope.model = 0;
                    } else {
                        scope.model = scope.model || 0;
                    }

                    this.value = $filter('number')(scope.model, 2);
                    
                    scope.$apply();
                });

                $timeout(function () {
                    var self = element.get(0);

                    if (self.value.length && !isNaN(self.value)) {
                        scope.model = parseFloat(self.value);
                    } else {
                        scope.model = scope.model || 0;
                    }

                    self.value = $filter('number')(scope.model, 2);

                    scope.$apply();
                });
            }
        };
    }
]);
