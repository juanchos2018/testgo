window.angular.module('ERP').directive('erpSerieInput', [
    '$window',
    function ($window) {
        return {
            restrict: 'A',
            scope: {
                zeros: '@'
            },
            link: function (scope, element, attrs) {
                if (!scope.zeros) {
                    element.attr('pattern', "\\w{1,4}-\\d{1,7}");
                } else {
                    element.attr('pattern', "\\w{1," + scope.zeros + "}");
                }
                
                element.blur((function (zeros) {
                    return function () {
                        if (this.checkValidity()) {
                            if (!zeros) {
                                element.val(this.value.split('-').map(function (val, index) {
                                    return val.zeros(!index ? 4 : 7);
                                }).join('-'));
                            } else {
                                element.val(this.value.zeros(zeros));
                            }
                        }
                    };
                })(scope.zeros));
                
                element.keydown((function (zeros) {
                    return function (e) {
                        if (e.keyCode === 13 && this.checkValidity()) {
                            if (!zeros) {
                                element.val(this.value.split('-').map(function (val, index) {
                                    return val.zeros(!index ? 4 : 7);
                                }).join('-'));
                            } else {
                                element.val(this.value.zeros(zeros));
                            }
                        }
                    };
                })(scope.zeros));
            }
        };
    }
]);