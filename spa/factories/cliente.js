window.angular.module('ERP').factory("cliente", [
	'$http', '$window', 'mensajesFlash', 'Ajax',
	function($http, $window, mensajesFlash, Ajax) {
		return{
			lists: function(cliente){
				return Ajax.get($window.siteUrl('customers/lists'));
			},
	        search: function(cliente){
	            return Ajax.post($window.siteUrl('customers/search'), {
	                cod: cliente
	            })
	        }
		}
	}
]);
