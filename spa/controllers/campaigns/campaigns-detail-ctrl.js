window.angular.module('ERP').controller('CampaignsDetailCtrl', [
  '$scope', '$rootScope', '$window', '$timeout', '$location', '_angular', '_riot', 'Page', 'Auth', 'Ajax', 'Session', 'Settings',
  function ($scope, $rootScope, $window, $timeout, $location, angular, riot, Page, Auth, Ajax, Session, Settings) {
    $scope.id = '';
    $scope.code = '';
    $scope.description = '';
    $scope.startDate = '';
    $scope.endDate = '';
    $scope.startTime = '';
    $scope.endTime = '';
    $scope.branches = [];
    $scope.active = true;
    $scope.packs = [];

    $scope.regimes = { General: 'General', ZOFRA: 'Zofra' };
    $scope.companies = {};

    Settings.getCompaniesOfBranch().forEach(function (company) {
      $scope.companies['' + company.company_id] = company.company_name;
    });
    
    $scope.editPack = function (pack) {
      $scope.packModal.trigger('show', angular.copy(pack));
    };
    
    $scope.removePack = function (pack) {
      $scope.packs.splice($scope.packs.indexOf(pack), 1);
    };

    $scope.save = function () {
      if ($scope.packs.length > 0) {
        var data = {
          description: $scope.description,
          start_date: $scope.startDate,
          end_date: $scope.endDate,
          start_time: $scope.startTime,
          end_time: $scope.endTime,
          branches: $scope.branches,
          active: $scope.active ? 't' : 'f',
          packs: $scope.packs.map(function (pack) {
            return {
              active: pack.active ? 't' : 'f',
              company_id: pack.company_id,
              description: pack.description,
              id: Number(pack.id) < 0 ? null : pack.id,
              price: pack.price,
              regime: pack.regime,
              lists: pack.lists.map(function (list) {
                return {
                  id: Number(list.id) < 0 ? null : list.id,
                  unit_price: list.price,
                  quantity: list.quantity,
                  product_details: list.products
                };
              })
            };
          })
        };

        console.log('Guardar los datos', data);
        
        if ($scope.action === 'add') {
          Ajax.postData(siteUrl('campaigns/save'), data, 'campaigns', 'Se guardó el registro correctamente', 'Ocurrió un error al registrar la campaña');
        } else if ($scope.action === 'edit') {
          Ajax.postData(siteUrl('campaigns/update/' + $scope.id), data, 'campaigns', 'Se actualizó el registro correctamente', 'Ocurrió un error al actualizar la campaña');
        }
      }
    };
    
    $scope.showPackModal = function () {
      if ($scope.packModal !== undefined) {
        $scope.packModal.trigger('show');
      }
    };

    $scope.setCode = function (nextId) {
      $scope.id = nextId;
      $scope.code = 'CMP' + nextId.zeros(3);
    };

  }
]);
