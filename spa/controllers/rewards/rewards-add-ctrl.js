window.angular.module('ERP').controller('RewardsAddCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'Auth', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, Auth, QuickHandler) {
        var $ = $window.angular.element;
      
        Page.title('Agregar nuevo Programa de Puntos');

        QuickHandler.init('rewards', 'rewards'); // La segunda es ruta CodeIgniter
        QuickHandler.setUrls( // Son rutas AngularJS
            'rewards', // ESTA RUTA DE ACA -->
            'rewards/save'
        );

        $scope.companies = Auth.value('userCompanies');

        $scope.record = {
            description: '',
            abbrev: '',
            earn_points: 0,
            min_points: 0,
            points_to_voucher: 0,
            voucher_amount: 0,
            voucher_birthday: 0,
            company_id: '',
            active: 't'
        };

        $scope.submit = function () {
            
            QuickHandler.save(
                $scope.record,
                'Punto de Venta guardado correctamente',
                'Ocurrió un error al guardar el Punto de Venta'
            );
        };
    }
]);
