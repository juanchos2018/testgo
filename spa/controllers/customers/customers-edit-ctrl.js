window.angular.module('ERP').controller('CustomersEditCtrl', [
    '$scope', '$window', '$location', 'Page', 'Session', 'Ajax',
    function ($scope, $window, $location, Page, Session, Ajax) {
        var $ = $window.angular.element;
        var angular = $window.angular;

        Page.title('Editar Cliente');

        $scope.submit = function () {
            Ajax.post($window.siteUrl('customers/update'), angular.copy($scope.record)).then(function (res) {
                console.log('res', res);
                Session.setMessage('Se editó el registro correctamente');
                $location.path('customers');
            }, function (err) {
                var errorDetail = err.statusText || 'Ocurrió un error al intentar guardar el registro';

                Session.setMessage(errorDetail, 'danger', true);
            });
        };
    }
]);
