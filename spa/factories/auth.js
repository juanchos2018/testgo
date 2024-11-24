window.angular.module('ERP').factory('Auth', [
	'$window', '$location', '$rootScope', '$routeParams', '$templateCache', '$browser', '$route', 'Ajax', 'Session', 'Page', '$timeout', '$q',
	function ($window, $location, $rootScope, $routeParams, $templateCache, $browser, $route, Ajax, Session, Page, $timeout, $q) {
		var Auth = {};
		//var delayLogin = 250;

		Auth.login = function (credentials) {
			//alert("aqui 1");
			return Ajax.post($window.siteUrl('sessions/validate'), {
				login: credentials.login,
				password: btoa(credentials.password)
			});
		};

		Auth.checkSession = function () {
			//alert("aqui 2 ");
			//
			//	Ajax.get($window.siteUrl('sales/cashOut')).then(function (res) {
         //   $.post(siteUrl('campaigns/activate'), { id: item.id, active: item.active }).done(function (data) {

		// return null;
		console.log("redfdmise",$window.siteUrl('sessions/get'))
			return Ajax.get($window.siteUrl('sessions/get')).then(function (res) {

		
				var data = res.data;

				Session.set(data);

				return data;
			});
		};

		Auth.session = function (path, user) {
			if ('customRoleId' in user) { // Si es un usuario que puede elegir el cargo (Desarrollador)
				user.roleId = user.customRoleId;
				
				user.roles.forEach(function (role) {
					if (role.id == user.customRoleId) {
						user.role = role.text;
					}
				});
				
				user.roles.length = 0;
			}
			
	        return (user === undefined ? Ajax.get($window.siteUrl('sessions/get')) : Ajax.post($window.siteUrl('sessions/set'), angular.copy(user))).then(function (res) {
	            var data = res.data;

	            Session.set(angular.copy(data));

	            $location.path(path);
	            $timeout(function () {
	                $rootScope.$apply();
	            });

	            return data;
	        }, function() {
	            Auth.showLogin();
	        });
		};

		Auth.promise = function (isPublic) {
			var defer = $q.defer();

			if (isPublic || Auth.isLoggedIn()) {
				Page.isPublic = isPublic;
				
				defer.resolve();
			} else {
				Auth.checkSession().then(function (data) {
					Page.isPublic = isPublic;

					defer.resolve();
				}, function (reject) {
    				defer.reject(reject.statusText); // Unauthorized
    			});
			}

			return defer.promise;
		};

		Auth.showLogin = function () {
			$location.path('/login');
		};

		Auth.logout = function () {
			Ajax.get($window.siteUrl('sessions/remove')).then(function () {
				Session.destroy();
				$templateCache.removeAll();
				Auth.showLogin();
			});
		};

		Auth.isLoggedIn = function () {
			return !!Session.userKey;
		};

		Auth.value = function (sessionKey) {
			return Session.get(sessionKey);
		};

		Auth.switchBranch = function (branchData) {
			if (branchData.branch_id !== Session.get('userBranch')) {
				var sessionData = {
					user_branch: branchData.branch_id,
					user_branch_name: branchData.branch_alias
				};

				Ajax.post(siteUrl('sessions/switch_branch'), sessionData).then(function (res) {
					var data = res.data;

					Session.set(data);

					$templateCache.removeAll();

					$route.reload();
				});
			}
		};

		$rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
			console.log('rejection', rejection);
			event.preventDefault();
			if (rejection === 'Unauthorized') {
				Auth.logout();
			}
		});

		return Auth;
	}
]);