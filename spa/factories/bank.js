window.angular.module('ERP').factory("bank", [
    '$http', '$window', 'Ajax',
    function($http, $window, Ajax) {
        return{
            lists: function(banks){
                return Ajax.get($window.siteUrl('banks/lists'));
            },
           /* search: function(banks){
                return Ajax.post($window.siteUrl('products/search'), {
                    cod: banks
                })
            },*/
            new: function(banks){
                return Ajax.post($window.siteUrl('banks/register_bank'), {
                    cod: banks
                })
            }
        }
    }
]);
