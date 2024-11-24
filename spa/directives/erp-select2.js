window.angular.module('ERP').directive('erpSelect2', [
    '$timeout',
    function ($timeout) {
        var getModelName = function (expr) {
            return expr.trim().split(' ').pop();
        };

        var modelScope;

        return {
            restrict: 'A',
            scope: {
                ngModel: '@',
                ngOptions: '@'
            },
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                $scope.modelName = getModelName($scope.ngOptions);

                modelScope = $element.scope();

                modelScope.$watch($scope.modelName, function (newVal, oldVal) {
                    if (oldVal.length || newVal.length) {
                        if (!oldVal.length && newVal.length) {
                            $element.get(0).dataset.placeholder = '-- Seleccione --';
                        } else if (oldVal.length && !newVal.length) {
                            $element.get(0).dataset.placeholder = '-- Sin registros --';
                        } else {
                            $element.get(0).dataset.placeholder = '-- Seleccione --';
                        }

                        $element.select2({
                            allowClear: ($attrs.required === undefined)
                        });
                    }
                }, true);

                modelScope.$watch($scope.ngModel, function (newVal, oldVal) {
                    if (oldVal || newVal) {
                        $element.select2({
                            allowClear: ($attrs.required === undefined)
                        });
                    }
                });
            }],
            link: function (scope, element, attrs, ctrl) {
                $timeout(function () {
                    if (modelScope[scope.modelName].length === 0) {
                        element.get(0).dataset.placeholder = '-- Sin registros --';
                    }

                    element.select2({
                        allowClear: (attrs.required === undefined)
                    });
                });
            }
        };
    }
]);