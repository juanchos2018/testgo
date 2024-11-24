window.angular.module('ERP').controller('TransfersDetailCtrl', [
	'$scope', '$rootScope', '$window', '$filter', '$location', '$timeout', 'Page', 'Settings', 'FileHandler', 'Ajax', 'Session', '_baseUrl', '_siteUrl', '_bootbox', '_riot', '_$', '_moment',
	function ($scope, $rootScope, $window, $filter, $location, $timeout, Page, Settings, FileHandler, Ajax, Session, baseUrl, siteUrl, bootbox, riot, $, moment) {
		Page.title('Detalle de Traslado');

		$scope.description = '';
		$scope.company = '';
		$scope.paymentDate = '';
		$scope.startDate = '';
		$scope.endDate = '';
		$scope.active = false;

		$scope.supplierId = null;
		$scope.showSupplier = true;

		$scope.downloading = false;

		$scope.setDetail = function (detail) {
			$scope.id = detail.id;
			$scope.code = detail.code;
			$scope.description = detail.description;

			detail.registered_at && ($scope.paymentDate = moment(detail.registered_at).format('DD/MM/YYYY'));
			detail.start_date && ($scope.startDate = moment(detail.start_date).format('DD/MM/YYYY'));
			detail.finish_date && ($scope.endDate = moment(detail.finish_date).format('DD/MM/YYYY'));

			$scope.data = detail.details.map(function (row) {
				return {
					'CODIGO': row.code,
					'TALLA' : row.size,
					'CANT.': row.quantity,
					'CODIGO_DE_BARRA': row.old_barcode,
					'DESCRIPCION': row.description,
					'MARCA': row.brand,
					'product_id': row.product_id,
					'product_detail_id': row.product_detail_id,
					'PVP' : parseFloat(row.price),
					'POFERTA': parseFloat(row.offer_price),
					'GUIA': row.guide
				};
			});

			$scope.$apply();

			$scope.dataTags = riot.mount(document.querySelector('[ng-view] riot-table'), 'riot-table', {
				data: $scope.data
			});
		};

		$scope.data = [];
	}
]);
