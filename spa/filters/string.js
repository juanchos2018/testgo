window.angular.module('ERP').filter('capitalize', function () {
    return function (input) {
        input = input || '';

        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    };
});
