window.angular.module('ERP').config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider
			.when('/login', {
				controller: 'SessionsLoginCtrl',
				templateUrl: window.siteUrl('sessions/login'),
				public: true
			})
			.when('/login/recovery', {
				controller: 'SessionsRecoveryCtrl',
				templateUrl: window.siteUrl('sessions/recover_account'),
				public: true
			})
		;
	}
]);