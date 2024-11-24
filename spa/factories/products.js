window.angular.module('ERP').factory("products", [
    '$http', '$window', 'Ajax',
    function($http, $window, Ajax) {
        return{
            lists: function (products){
                return Ajax.get($window.siteUrl('products/lists'));
            },
            search: function (products){
                return Ajax.post($window.siteUrl('products/search'), {
                    cod: products
                })
            }
        }
    }
]);
