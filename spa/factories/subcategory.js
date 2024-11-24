window.angular.module('ERP').factory("subcategory", [
    '$http', '$window', 'Ajax',
    function($http, $window, Ajax) {
        return{
            lists: function(subcategories){
                return Ajax.get($window.siteUrl('subcategories/lists'));
            },
           /* search: function(subcategories){
                return Ajax.post($window.siteUrl('products/search'), {
                    cod: subcategories
                })
            },*/
            new: function(subcategories){
                return Ajax.post($window.siteUrl('subcategories/register_subcategory'), {
                    cod: subcategories
                })
            }
        }
    }
]);
