window.angular.module('ERP').directive('noLink', function () {
    return {
        link: function (scope, element, attrs) {
            element.click(function (e) {
                e.preventDefault();
            });
        }
    };
});