window.angular.module('ERP').directive('modalAutofocus', function () {
    return {
        scope: {
            modalAutofocus: '@?'
        },
        link: function (scope, element, attrs) {
            if (!scope.modalAutofocus) {
                scope.modalAutofocus = 'input[type="text"], input[type="search"], button';
            }

            element.on('shown.bs.modal', function () {
                $(this).find(scope.modalAutofocus).first().focus();
            });
        }
    };
});