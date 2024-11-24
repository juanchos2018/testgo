window.angular.module('ERP').directive('animatedToggle', function () {
    var $ = angular.element;

    return {
        scope: {
            animatedToggle: '@'
        },
        link: function (scope, element, attrs) {
            element.click(function (e) {
                var oldDisplay = $(this).next().css('display');

                if (oldDisplay === 'none') { // Se va ha mostrar
                    $(this).next().addClass(scope.animatedToggle).on('animationend', function () {
                        $(this).removeClass(scope.animatedToggle);
                    });
                }
            });
        }
    };
});