window.angular.module('ERP').controller('SalesOperationsCtrl', [
	'$window', '$scope', '$timeout', '$location', 'Ajax', 'Page', 'Auth', 'Settings', 'Session',
	function ($window, $scope, $timeout, $location, Ajax, Page, Auth, Settings, Session) {
		var angular = $window.angular, $ = angular.element;

		Page.title('Consultar venta');

		$scope.voucher = 'TICKET';
		$scope.company = '';
		$scope.serie = '';
		$scope.searching = false;

		$scope.companies = Settings.companiesOfBranch(Auth.value('userBranch'));

		$scope.search = function () {
			$scope.searching = true;
			// OJO: revisar al buscar Ticket - LFA - 1-14
			$window.backgroundXHR(
				$window.siteUrl('sales/get_id_for_detail/' + $scope.voucher + '/' + $scope.company + '/' + $scope.serie.split('-').map(function (v) {
					return v;
				}).join('/')),
				null,
				{responseType: 'json'}
			).then(function (data) {
				$scope.$apply(function () {
					if (typeof data !== 'object' || 'error' in data) {
						$scope.searching = false;
						Session.setMessage(data.message || 'Ocurrió un error', 'danger', true);
					} else if ('ok' in data) {
						$location.path('sales/detail/' + data.sale_id);
					}
				});
			}, function (err) {
				$scope.$apply(function () {
					$scope.searching = false;
					Session.setMessage(err.statusText || 'Ocurrió un error', 'danger', true);
				});
			});
		};

	}
]);
