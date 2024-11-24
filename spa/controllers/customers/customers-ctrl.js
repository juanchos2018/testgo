window.angular.module('ERP').controller('CustomersCtrl', [
    '$scope', '$routeParams', '$document', '$location', 'Page', 'cliente',
    function ($scope, $routeParams, $document, $location, Page, cliente) {
        Page.title('Clientes');

        //angular.element('.template-view').css('opacity', 1);

            //$scope.resultado = $scope.clienteCod;
            //$scope.resultado = cliente.lists($scope.clienteCod);
            
        /*$scope.allCustomers = [];
        //llena clientes al cargar
        cliente.lists($scope.clienteCod).success(function(data)
        {
            if(!Object.keys(data).length)
            {
                $scope.response = "empty";
                $scope.allCustomers = [];
            }
            else
            {
                $scope.response = "filled";
                $scope.allCustomers = data;
            }
        });*/
     
        
        $scope.buscarCliente = function(){
         
            cliente.search($scope.clienteCod).success(function(data){
                   $scope.customer = data;
            });
        };    
        
    }
]);
