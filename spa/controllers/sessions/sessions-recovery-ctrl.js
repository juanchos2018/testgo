window.angular.module('ERP').controller('SessionsRecoveryCtrl', [
	'Page', '$timeout',
	function (Page, $timeout) {
		Page.title('Recuperación de cuenta');

	    $timeout(function () {
			$('#txtLogin').focus();
	    });
	}
]);
