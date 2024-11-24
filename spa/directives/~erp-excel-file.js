window.angular.module('ERP').directive('erpExcelFile', [
	'$window', '$document',
	function ($window, $document) {
		return {
			restrict : 'E',
			scope: {
				ngModel: '=',
				placeholder: '@',
				accept: '@?',
				handler: '=',
				required: '@?'
			},
			controller: ['$scope', function ($scope) {
				$scope.required = ($scope.required !== undefined);
			}],
			link: function (scope, element, attrs) {
				var handler = scope.handler;
				var worker = new Worker($window.baseUrl('public/js/workers/xlsx.js'));

				function setFile(file) {
					console.log('setFile', file);
					scope.ngModel.name = file.name;
					scope.ngModel.blob = file;

					if (handler.onchange) {
	 					handler.onchange.call(scope, file);
					}

					var reader = new FileReader();

					reader.onload = function(e) {
						worker.postMessage(e.target.result, [e.target.result]);
					};

					reader.readAsArrayBuffer(file);

					scope.$apply();
				}

				worker.onmessage = function (e) {
					if ('name' in e.data) {
						switch (e.data.name) {
							case 'sheets':
								if (handler.onready) {
									handler.onready.call(scope, e.data.message);
								}
								break;
							case 'data':
								console.log('data', e.data);
								if (handler.ondata) {
									handler.ondata.call(scope, e.data);
								}
								break;
							case 'loaded':
								if (handler.onloaded) {
									handler.onloaded.call(scope, e.data.data);
								}
								break;
						}
					}
				};

				handler.getData = function (sheet) {
					worker.postMessage({
						name: 'data',
						sheet: sheet
					});
				};

				element.find('input[type="file"]').bind('change', function (event) {
					setFile(event.target.files[0]);
				});

				$document.bind('dragover', function (e) {
					e.preventDefault();

					if (element.find('.row').css('display') === 'none') {
						element.find('.row').css('display', 'block');
					}
				});

				element.find('.dropfile').bind('dragover', function (e) {
					angular.element(this).addClass('hover');
				});

				element.find('.dropfile').bind('dragleave', function (e) {
					element.find('.dropfile').removeClass('hover');
				});

				element.find('.dropfile').get(0).addEventListener('drop', function (event) {
					event.preventDefault();

					if (event.dataTransfer.files.length > 0) {
						setFile(event.dataTransfer.files[0]);
					}
				});
			},
			template: '\
				<div class="row m-b" style="display:none">\
	                <div class="col-sm-12">\
	                    <div class="dropfile dropfile-single visible-lg">\
	                    </div>\
	                </div>\
	            </div>\
				\
	            <div class="input-group m-b">\
	                <input type="text" ng-model="ngModel.name" class="form-control" data-trigger="change" ng-required="required" placeholder="{{placeholder}}" readonly />\
	                <span class="input-group-btn" style="vertical-align:top">\
	                	<label class="btn btn-default" type="button">\
	                		Seleccionar\
	                		<input type="file" style="position:absolute;opacity:0;width:0;height:0" accept="{{accept}}" />\
	                	</label>\
	                </span>\
	            </div>\
	        '
		};
	}
]);
