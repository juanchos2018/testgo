window.angular.module('ERP').controller('SettingsSalesCtrl', [
	'$scope', 'Page', 'Auth', 'Ajax', 'Session', 'Settings', '_siteUrl',
	function($scope, Page, Auth, Ajax, Session, Settings, siteUrl) {
	    Page.title('Configuración de Ventas');
	    
	    $scope.saleTicketMessage = '';
	    $scope.returnTicketMessage = '';
	    $scope.promoTicketStatus = '';
	  
	    $scope.save = function () {
	    	Ajax.post(siteUrl('settings/save'), {
	    		'sale_ticket_message:text': $scope.saleTicketMessage,
	    		'return_ticket_message:text': $scope.returnTicketMessage,
	    		'promo_ticket_status:numeric': $scope.promoTicketStatus
	    	}).then(function (res) {
	    		if ('ok' in res.data) {
	    			Settings.setItem('sale_ticket_message:text', $scope.saleTicketMessage);
	    			Settings.setItem('return_ticket_message:text', $scope.returnTicketMessage);
	    			Settings.setItem('promo_ticket_status:numeric', $scope.promoTicketStatus);
	    			
	    			Session.setMessage('Se guardó la configuración con éxito', 'success', true);
	    		} else {
	    			Session.setMessage('Ocurrió un error al guardar la configuración', 'danger', true);
	    		}
	    	}, function () {
	    		Session.setMessage('Ocurrió un error al guardar la configuración', 'danger', true);
	    	});
	    };
	}
]);
