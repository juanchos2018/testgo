window.angular.module('ERP').directive('erpSelect', function () {
	return {
		restrict: 'E',
		replace: true,
		scope: {
			data: '=',
			disabled: '=?',
			model: '=',
			value: '@?',
			selected: '=?',
            onChange: '&?'
		},
		controller: ['$scope', function ($scope) {
			$scope.getValue = function () {
				var val = '';

				for (var i = 0; i < $scope.data.length; i++) {
					if ($scope.data[i].id == $scope.model) {
						val = $scope.data[i].text;
						break;
					}
				}

				return val;
			};

			$scope.getId = function (txt) {
				var id = 0;
				txt = txt.toLowerCase();

				for (var i = 0; i < $scope.data.length; i++) {
					if ($scope.data[i].text.toLowerCase() === txt) {
						id = $scope.data[i].id;
						break;
					}
				}

				return id;
			};

			$scope.setId = function (newVal, event) {
                var oldVal = $scope.model;

                if (oldVal !== newVal) {
    				$scope.model = newVal;

                    if ($scope.onChange) {
                        $scope.onChange({newVal: newVal, oldVal: oldVal});
                    }
                }

				event && event.preventDefault();
			};

            if ($scope.disabled === undefined) {
                $scope.disabled = false;
            }

			if (!$scope.model && $scope.data.length > 0) {
				if ($scope.value !== undefined) {
                    $scope.setId($scope.value);
                    //$scope.model = $scope.value;
                } else if($scope.selected !== undefined) {
                    $scope.setId($scope.getId($scope.selected));
                    //$scope.model = $scope.getId($scope.selected);
                }

                if (!$scope.model) {
                    $scope.setId($scope.data[0].id);
					//$scope.model = $scope.data[0].id;
				}
			}
		}],
		link: function (scope, element, attrs) {

		},
		template: '\
			<div>\
				<button type="button" data-toggle="dropdown" ng-disabled="disabled" class="btn btn-default dropdown-toggle">\
					<span class="dropdown-label">{{getValue()}}</span>\
					<span class="caret"></span>\
				</button>\
				<ul class="dropdown-menu dropdown-select">\
					<li ng-repeat="item in data" ng-class="(item.id == model ? \'active\' : \'\')">\
						<a href="#" ng-click="setId(item.id, $event)">\
							<input type="radio" name="d-s-r" ng-checked="item.id == model" />\
							{{item.text}}\
						</a>\
					</li>\
				</ul>\
			</div>\
		'
	};
});
