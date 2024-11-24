window.angular.module('ERP').factory("brand", [
    '$http', '$window', 'Ajax',
    function($http, $window, Ajax) {
        return{
            lists: function(brands){
                return Ajax.get($window.siteUrl('brands/lists'));
            },
           /* search: function(brands){
                return Ajax.post($window.siteUrl('products/search'), {
                    cod: brands
                })
            },*/
            new: function(brands){
                return Ajax.post($window.siteUrl('brands/register_brand'), {
                    cod: brands
                })
            }
        }
    }
]);
