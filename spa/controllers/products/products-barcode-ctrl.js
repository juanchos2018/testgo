window.angular.module('ERP').controller('ProductsBarcodeCtrl', [
	'$scope', '$window','$filter', 'Page', 'FileHandler', 'Ajax', 'Auth',
	function ($scope, $window, $filter, Page, FileHandler, Ajax, Auth) {
		Page.title('Impresión de codigo de barra');

		$scope.filters = {
			include: 0,
			group: false,
			groupBy: 'category',
			onlyActive: true,
			filter: false,
			filterBy: {
				key: '',
				term: ''
			},
			filterList: [] // { key: { id, text }, term: { id, text } }
		};

		$scope.options = {
            width: 1,
            height: 30,
            quite: 10,
            displayValue: true,
            font: "monospace",
            textAlign: "center",
            fontSize: 11,
            backgroundColor: "",
            lineColor: "#000"
        };

		$scope.filterTerms = []; // Está afuera por compatibilidad con erp-select2

		$scope.filterKeys = [
			{ id: 'categories', text: 'Línea' },
			{ id: 'uses', text: 'Deporte' },
			{ id: 'ages', text: 'Edad' },
			{ id: 'genders', text: 'Género' },
			{ id: 'brands', text: 'Marca' }
		];

		$scope.getTermText = function (termId) {
			var result = '';

			$scope.filterTerms.forEach(function (term) {
				if (term.id == termId) {
					result = term.text;
				}
			});

			return result;
		};

		$scope.getKeyText = function (keyId) {
			var result = '';

			$scope.filterKeys.forEach(function (key) {
				if (key.id == keyId) {
					result = key.text;
				}
			});

			return result;
		};

		$scope.changeFilter = function () {
			if (!$scope.filters.filter) {
				$scope.filters.filterBy.key = '';
				$scope.filters.filterBy.term = '';
				$scope.filters.filterList.length = 0;
			}
		};

		$scope.changeFilterBy = function () {
			var key = $scope.filters.filterBy.key;

			$scope.filterTerms.length = 0;
			$scope.filters.filterBy.term = '';

			if (key) {
				Ajax.get(siteUrl(key + '/simple_list')).then(function (res) {
					var data = res.data;

					$scope.filterTerms = data;
				});;
			}
		};

		$scope.changeFilterTerm = function () {
			var key = $scope.filters.filterBy.key;
			var term = $scope.filters.filterBy.term;

			if (term) {
				$scope.filters.filterList.push({
					key: { id: key, text: $scope.getKeyText(key) },
					term: { id: term, text: $scope.getTermText(term) }
				});

				$scope.filters.filterBy.key = '';
				$scope.filters.filterBy.term = '';
			}
		};

		$scope.removeFilter = function (index) {
			$scope.filters.filterList.splice(index, 1);
		};

		$scope.startedDownload = false;
		$scope.downloading = false;

		$scope.downloadUrl = function () {
			if ($scope.filters.include) {
				return '';
			} else {
				var append = (Auth.value('userCompanyRegime') === 'ZOFRA' ? '-zofra' : '');
				return baseUrl('public/files/purchase-template' + append + '.xlsx');
			}
		};

		$scope.download = function () {
			alert('gato');
			//if ($scope.filters.include === 'TEST') {
				$scope.startedDownload = true;

				var includeUrl = $filter('number')($scope.filters.include);
				var onlyActiveUrl = $filter('number')($scope.filters.onlyActive);
				var groupUrl = $scope.filters.group ? $scope.filters.groupBy : '';

				Ajax.get(siteUrl('purchases/template/data/' + onlyActiveUrl + '/' + groupUrl)).then(function (response) {
					var data = response.data;

					$scope.downloading = true;

					new Promise(function (resolve, reject) {
						FileHandler.get('arraybuffer', siteUrl('purchases/template/file/' + onlyActiveUrl + '/' + groupUrl), resolve, reject);
					}) .then(function (arraybuffer) {
						console.log('data', data);
						console.log('arraybuffer', arraybuffer);

						var worker = new Worker(baseUrl('public/js/workers/purchase-template.js'));

						worker.postMessage(arraybuffer, [arraybuffer]);
						worker.postMessage({
							group: (groupUrl ? (groupUrl === 'brand' ? 'brand' : 'type') : null),
							data: data
						});

						worker.onmessage = function (e) {
							var blob = e.data;

							FileHandler.download(blob, 'ingreso_de_productos.xlsx');
							
							$scope.downloading = false;
							$scope.startedDownload = false;

							$scope.$apply();
						};

					}, function (reason) {
						console.error('Error downloading file: ' + reason);
						$scope.downloading = false;
						$scope.startedDownload = false;

						$scope.$apply();
					});
				});
			//}
		};

		$scope.barcode = function() {
			$("#barcode").JsBarcode("9780199532179",{width:1,height:30,format:"EAN",displayValue:true,fontSize:15});
			
			var includeUrl = $filter('number')($scope.filters.include);
			var onlyActiveUrl = $filter('number')($scope.filters.onlyActive);
			var groupUrl = $scope.filters.group ? $scope.filters.groupBy : '';
			var filtersUrl = $scope.filters.filterList ? $scope.filters.filterList : '';
			//var gato = 'gato';
			//console.log(filtersUrl);
	            
		
			Ajax.post($window.siteUrl('products/list_barcode_by'), {
				active: angular.toJson(onlyActiveUrl),
				groupby: angular.toJson(groupUrl),
				filters: angular.toJson(filtersUrl)
			}).then(function (response) {
				var data = response.data;
				
				//$scope.setValue(data);
				//alert(data);
				console.log(data);
				//$element.find('.modal[name="add"]').modal('hide');
                
				//$scope.saveLoading = false;
				//return data;
                
			}, function (error) {
                if (error.status === 400 && error.statusText) {
                    $scope.saveMessage = error.statusText;
                } else {
                    $scope.saveMessage = 'Ocurrió un error, por favor inténtelo más adelante';
                }
                
                //$scope.saveLoading = false;
            });
				
			/*Ajax.get(siteUrl('products/list_barcode_by/data' + onlyActiveUrl + '/' + groupUrl)).then(function (response){
				var data = response.data;
				console.log(data);
				return data;
			}); */
			//console.log(canvas.currentSrc);

			//var doc = new jsPDF();
			//doc.setFontSize(10);
			//doc.text(90,15,"Reporte Codigo de Barras");
			//var canvas = document.getElementById("barcode");
			//doc.addImage(canvas.currentSrc,'PNG',15,40);
			//var string = doc.output('datauristring');

			//$('iframe').attr('src', string);
			//console.log($scope.filters);
			//console.log($scope.filters.filterList);
		};

		$scope.barcode2 = function(barcode) {
			var canvas = document.getElementsByTagName("canvas");
			//var doc = new jsPDF();
			console.log(canvas);
			//var gato = canvas[0]["__proto__"];
			console.log(canvas[0]["__proto__"]);
			console.log(canvas["__proto__"]);
			var dataURL = canvas[0]["__proto__"].toDataURL.call(window);
			console.log(dataURL);
			//console.log(img);
			//console.log(img.currentSrc);
			//doc.setFontSize();
			//doc.text(35,15,"Reporte Codigo de Barras");
			//doc.addImage(img.currentSrc,'PNG',15,40);
			//var string = doc.output('datauristring');

			//$('iframe').attr('src', string);
			//doc.save("Reporte Codigo de Barra");
		};

	}
]);
