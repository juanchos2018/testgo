window.angular.module('ERP').directive('erpFilePicker', [
	'$window', '$document',
	function ($window, $document) {
		return {
			restrict : 'E',
			scope: {
				model: '=',
				placeholder: '@?',
				accept: '@?',
				required: '@?',
				form: '@?',
				label: '@?',
				showInput: '=?',
				onChange: '=?',
				disabled: '=?'
			},
			controller: ['$scope', '$element', function ($scope, $element) {
				$scope.required = $scope.required || false;
				$scope.form = $scope.form || '';
				$scope.label = $scope.label || 'Seleccionar';
				$scope.disabled = ($scope.disabled === undefined ? false : $scope.disabled);

				$scope.setFile = function (file) {
					if ($scope.accept) {
						if (!(new RegExp($scope.accept + '$') .test(file.name))) {
							file = null;
						}
					}

					if (file) {
						$scope.$apply(function () {
							$scope.model.name = file.name;
							$scope.model.blob = file;

							if ($scope.onChange) {
								$scope.onChange(file);
							}
						});
					}
				};

				$element.find('input[type="file"]').bind('change', function (event) {
					$scope.setFile(event.target.files[0]);
				});

				$document.bind('dragover', function (e) {
					e.preventDefault();

					if ($element.find('.row').css('display') === 'none') {
						$element.find('.row').css('display', 'block');
					}
				});

				$element.find('.dropfile').bind('dragover', function (e) {
					$element.find('.dropfile').addClass('hover');
				});

				$element.find('.dropfile').bind('dragleave', function (e) {
					$element.find('.dropfile').removeClass('hover');
				});

				$element.find('.dropfile').get(0).addEventListener('drop', function (event) {
					event.preventDefault();

					if (!$scope.disabled && event.dataTransfer.files.length > 0) {
						$scope.setFile(event.dataTransfer.files[0]);
					}
				});

				$element.find('input[ng-model="model.name"]').click(function (e) {
					$element.find('input[type="file"]').trigger('click');
				});
			}],
			template: `
				<div class="row m-b" style="display:none">
	                <div class="col-sm-12">
	                    <div class="dropfile dropfile-single visible-lg">
	                    </div>
	                </div>
	            </div>

	            <div class="input-group m-b">
	                <input type="text" ng-model="model.name" class="form-control" data-trigger="change" ng-required="required" form="{{ form }}" placeholder="{{ placeholder }}" ng-if="showInput" readonly />
	                <span class="input-group-btn" style="vertical-align:top">
	                	<label class="btn btn-default" type="button" ng-disabled="disabled">
	                		{{ label }}
	                		<input type="file" style="position:absolute;opacity:0;width:0;height:0" accept="{{ accept }}" ng-disabled="disabled" />
	                	</label>
	                </span>
	            </div>
	        `
		};
	}
]);
