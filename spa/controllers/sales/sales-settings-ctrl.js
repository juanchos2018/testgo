window.angular.module('ERP').controller('SalesSettingsCtrl', [
	'$scope', '$rootScope', '$window', '$timeout', '$route', 'Page', 'Ajax', 'Session',
	function ($scope, $rootScope, $window, $timeout, $route, Page, Ajax, Session) {
		var angular = $window.angular, $ = angular.element;

		Page.title('Configuración de punto de venta');

		$scope.getSalePoint = function (id) {
			for (var i = 0; i < $scope.salePoints.length; i++) {
				if ($scope.salePoints[i].id.toString() === id.toString()) { // Ambos son texto
					return $scope.salePoints[i];
				}
			}

			return false;
		};

		$scope.save = function () {
			if ($scope.currentSalePoint) {
				var salePointId = $window.localStorage.currentSalePoint = $scope.currentSalePoint;

				var data = {
					cash_amount: $scope.salePoint.initial_amount,
					exchange_rates: Array.from($scope.exchangeRates, function (row) {
						return {
							money: row.money_abbrev,
							value: row.purchase_value
						};
					})
				};

				Ajax.post($window.siteUrl('sales/save_settings/' + salePointId), data).then(function (res) {
					console.log('data', res.data);
					Session.setMessage('Se guardó la configuración correctamente');
					$route.reload();
				}, function (err) {
					Session.setMessage(err.statusText || err, 'danger', true);
				});
			}
		};

		$scope.$watch('currentSalePoint', function (newVal, oldVal) {
			if (newVal !== oldVal) {
				if (newVal) {
					$scope.salePoint = $scope.getSalePoint(newVal);
				}
			}
		});
	}
]);
