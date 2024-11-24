window.angular.module('ERP').config([
	'$routeProvider', '$httpProvider',
	function ($routeProvider, $httpProvider) {
		var originalWhen = $routeProvider.when;
		
		$routeProvider.when = function (path, route) {
			var isPublic = (route.public === true);

			if (!route.redirectTo) {
				route.resolve || (route.resolve = {});

		        angular.extend(route.resolve, {
		            session : ['Auth', function (Auth) {
		                return Auth.promise(isPublic);
		            }]
		        });
			}

			return originalWhen.call($routeProvider, path, route);
		};   

		$httpProvider.interceptors.push(function($q, $location) {
			return {
				responseError: function (rejection) {
					if (rejection.status === 401) { // Unauthorized
						$location.path('/login');
					}

					return $q.reject(rejection.statusText);
				}
			};
		});
	}
]);
