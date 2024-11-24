window.angular.module('ERP').controller('BanksAddCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'Auth', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, Auth, QuickHandler) {
        var $ = $window.angular.element;
    

        Page.title('Agregar una Banco');

        QuickHandler.init('banks', 'banks'); // La segunda es ruta CodeIgniter
        QuickHandler.setUrls( // Son rutas AngularJS
            'banks', // ESTA RUTA DE ACA -->
            'banks/save'
        );

        $scope.record = {
            description: '',
            active: 't'
        };

        $scope.submit = function () {
            
            QuickHandler.save(
                $scope.record,
                'Nueva Marca guardada correctamente',
                'Ocurrió un error al guardar la nueva Marca'
            );
        };
    }
]);
