window.angular.module('ERP').controller('SubcategoriesAddCtrl', [
    '$scope', '$rootScope', '$window', 'Page', 'Auth', 'QuickHandler',
    function ($scope, $rootScope, $window, Page, Auth, QuickHandler) {
        var $ = $window.angular.element;
    

        Page.title('Agregar una Sub Categoria');

        QuickHandler.init('subcategories', 'subcategories'); // La segunda es ruta CodeIgniter
        QuickHandler.setUrls( // Son rutas AngularJS
            'subcategories', // ESTA RUTA DE ACA -->
            'subcategories/save'
        );

        $scope.record = {
            category_id: '',
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
