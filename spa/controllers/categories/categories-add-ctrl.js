window.angular.module('ERP').controller('CategoriesAddCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'Auth', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, Auth, QuickHandler) {
        var $ = $window.angular.element;
    

        Page.title('Agregar una Categoria');

        QuickHandler.init('categories', 'categories'); // La segunda es ruta CodeIgniter
        QuickHandler.setUrls( // Son rutas AngularJS
            'categories', // ESTA RUTA DE ACA -->
            'categories/save'
        );

        $scope.record = {
            description: '',
            image: '',
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
