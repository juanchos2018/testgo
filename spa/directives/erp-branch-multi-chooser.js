window.angular.module('ERP').directive('erpBranchMultiChooser', [
  '$timeout', 'Settings', 'Auth',
  function ($timeout, Settings, Auth) {
    return {
      restrict: 'AE',
      scope: {
        classNames: '=',
        customDisabled: '@',
        disabled: '=',
        formGroupClass: '=',
        labels: '=',
        labelsDisabled: '=',
        model: '=',
        required: '@',
        useLongFormat: '=?'
      },
      controller: ['$scope', '$element', function ($scope, $element) {
        $scope.Settings = Settings;
        $scope.defaultBlank = '&nbsp;';
        $scope.selected = 'TODAS';
        $scope.model = $scope.model || [];
        
        if ($scope.classNames === undefined) $scope.classNames = ['', ''];
        if ($scope.labels === undefined) $scope.labels = [$scope.defaultBlank, $scope.defaultBlank];
        if (typeof $scope.useLongFormat !== 'boolean') $scope.useLongFormat = false;

        $scope.onChange = function () {
          $scope.model = $scope.model || [];
          $scope.model.length = 0;
          
          if ($scope.selected === 'ACTUAL') {
            $scope.model.push(Auth.value('userBranch'));
          }
        };
        
        $scope.$watch('model', function (newVal) {
          if (Array.isArray(newVal)) {
            if (newVal.length === 0) {
              $scope.selected = 'TODAS';
            } else if (newVal.length === 1) {
              if (newVal[0] === Auth.value('userBranch') && $scope.selected !== 'PERSONALIZADO') {
                $scope.selected = 'ACTUAL';
              } else {
                $scope.selected = 'PERSONALIZADO';
                
                $timeout(function () {
                  $element.find('[select2]').trigger('change');
                });
              }
            } else {
              $scope.selected = 'PERSONALIZADO';
              
              $timeout(function () {
                $element.find('[select2]').trigger('change');
              });
            }
          }
        });
      }],
      link: function (scope, element, attrs) {

      },
      template: `
        <div class="{{ classNames[0] || '' }}">
          <div ng-class="{ 'form-group': formGroupClass !== undefined }">
            <label ng-if="labelsDisabled === undefined" ng-class="{ required: required !== undefined }" ng-bind-html="labels[0] || defaultBlank"></label>
            <select class="form-control" ng-model="selected" ng-change="onChange()" ng-disabled="disabled">
              <option value="TODAS" ng-bind="'Todas' + (useLongFormat ? ' las sucursales' : '')"></option>
              <option value="ACTUAL" ng-bind="'Solo la' + (useLongFormat ? ' sucursal ' : ' ') + 'actual'"></option>
              <option value="PERSONALIZADO" ng-if="customDisabled === undefined">Especificar...</option>
            </select>
          </div>
        </div>

        <div class="{{ classNames[1] || '' }}" ng-if="selected === 'PERSONALIZADO'">
          <div ng-class="{ 'form-group': formGroupClass !== undefined }">
            <label ng-if="labelsDisabled === undefined" ng-bind-html="labels[1] || defaultBlank"></label>
            <select
              ng-required="$parent.selected === 'PERSONALIZADO'"
              class="form-control"
              multiple
              select2
              ng-options="v.branch_id as k for (k, v) in Settings.branches"
              ng-disabled="$parent.disabled"
              ng-model="$parent.model"
              style="width:100%"
            >
            </select>
          </div>
        </div>
      `
    };
  }
]);