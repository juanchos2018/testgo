window.angular.module('ERP').controller('BrandsAddCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'Auth', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, Auth, QuickHandler) {
        var $ = $window.angular.element;
    

        Page.title('Agregar una marca');

        QuickHandler.init('brands', 'brands'); // La segunda es ruta CodeIgniter
        QuickHandler.setUrls( // Son rutas AngularJS
            'brands', // ESTA RUTA DE ACA -->
            'brands/save'
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
