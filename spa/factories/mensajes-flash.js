window.angular.module('ERP').factory("mensajesFlash", [
    '$rootScope',
    function($rootScope) {
        return {
            show_success : function(message){
                $rootScope.flash_success = message;
            },
            show_error : function(message){
                $rootScope.flash_error = message;
            },
            clear : function(){
                $rootScope.flash_success = "";
                $rootScope.flash_error = "";
            }
        }
    }
]);
