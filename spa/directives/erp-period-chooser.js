window.angular.module('ERP').directive('erpPeriodChooser', [
  '_angular',
  '_moment',
  function (angular, moment) {
    return {
      restrict: 'AE',
      scope: {
        customOpts: '=?',
        disabled: '=?',
        ngModel: '=',
        period: '=',
        periods: '@?',
        required: '=?'
      },
      controller: ['$scope', function ($scope) {
        var now = new Date();

        $scope.periodLabels = {
          month: 'Mensual',
          year: 'Anual',
          custom: 'Personalizado'
        };

        if (typeof $scope.disabled === 'undefined') {
          $scope.disabled = false;
        }

        if (typeof $scope.required === 'undefined') {
          $scope.required = false;
        }

        if (typeof $scope.periods === 'undefined') {
          $scope.periods = ['year', 'month', 'custom'];
        } else if (typeof $scope.periods === 'string') {
          $scope.periods = JSON.parse($scope.periods);
        }

        if ($scope.periods.indexOf('year') > -1) {
          $scope.year = now.getFullYear();
        }

        if ($scope.periods.indexOf('month') > -1) {
          $scope.month = now.getMonth();
        }

        if ($scope.periods.indexOf('custom') > -1) {
          $scope.custom = [moment().subtract(30, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        }

        if (!$scope.ngModel) {
          if ($scope.period === 'year') {
            $scope.ngModel = $scope.year;
          } else if ($scope.period === 'month') {
            $scope.ngModel = [$scope.year, $scope.month + 1];
          } else {
            $scope.ngModel = angular.copy($scope.custom);
          }
        }

        $scope.$watch('year', function (newVal, oldVal) {
          if (newVal !== undefined && newVal !== oldVal) {
            if (Array.isArray($scope.ngModel)) {
              $scope.ngModel[0] = newVal;
            } else {
              $scope.ngModel = newVal;
            }
          }
        });

        $scope.changeMonth = function () {
          if (Array.isArray($scope.ngModel)) {
            $scope.ngModel[1] = $scope.month + 1;
          }
        };

        $scope.changePeriod = function () {
          if (Array.isArray($scope.ngModel)) {
            $scope.ngModel.length = 0;
          }

          if ($scope.period === 'year') {
            $scope.ngModel = $scope.year;
          } else if ($scope.period === 'month') {
            $scope.ngModel = [$scope.year, $scope.month + 1];
          } else {
            $scope.ngModel = angular.copy($scope.custom);
          }
        };
      }],
      link: function (scope, element, attrs) {
        
      },
      template: `
        <div class="col-sm-2">
          <div class="form-group">
            <label>Período</label>
            <select ng-model="period" class="form-control" ng-options="p as periodLabels[p] for p in periods"
            ng-disabled="disabled" ng-change="changePeriod()">
            </select>
          </div>
        </div>

        <div class="col-sm-2" ng-if="period === 'month'">
          <div class="form-group">
            <label>Mes</label>
            <erp-month-chooser ng-model="$parent.month" class="form-control" show-empty="false"
            ng-disabled="disabled" ng-change="$parent.changeMonth()">
            </erp-month-chooser>
          </div>
        </div>

        <div class="col-sm-2" ng-if="period === 'month' || period === 'year'">
          <div class="form-group">
            <label ng-class="{ required: required }">Año</label>
            <input type="number" ng-required="required" ng-model="$parent.year" class="form-control text-center" min="2000" max="3000" ng-disabled="disabled">
          </div>
        </div>

        <div class="col-sm-4" ng-if="period === 'custom'">
          <div class="form-group">
            <label ng-class="{ required: required }">Rango de fechas</label>
            <input
              type="text"
              class="form-control text-center"
              date-range-picker="customOpts"
              data-model="ngModel"
              data-show-format="DD/MM/YYYY"
              data-format="YYYY-MM-DD"
              ng-disabled="disabled"
              ng-required="required"
            >
          </div>
        </div>
      `
    };
  }
]);