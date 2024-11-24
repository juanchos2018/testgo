window.angular.module('ERP').factory("category", [
    '$http', '$window', 'Ajax',
    function($http, $window, Ajax) {
        return{
            lists: function(categories){
                return Ajax.get($window.siteUrl('categories/lists'));
            },
           /* search: function(categories){
                return Ajax.post($window.siteUrl('products/search'), {
                    cod: categories
                })
            },*/
            new: function(categories){
                return Ajax.post($window.siteUrl('categories/register_category'), {
                    cod: categories
                })
            }
        }
    }
]);
