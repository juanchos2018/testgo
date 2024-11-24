window.angular.module('ERP').directive('erpProductChooser', [
  '_siteUrl',
  function (siteUrl) {
    const RECORDS_PER_REQUEST = 10;

    return {
      restrict: 'AE',
      replace: true,
      scope: {
        // model: '=',
      },
      controller: ['$scope', function ($scope) {
        $scope.select2 = {
          allowClear: true,
          placeholder: '- Busque por código o descripción -',
          ajax: {
            url: siteUrl('products/search'),
            dataType: 'json',
            delay: 250,
            data: function (params) {
              return {
                term: params.term,
                page: params.page,
                display: RECORDS_PER_REQUEST
              };
            },
            processResults: function (data, params) {
              params.page = params.page || 1;

              return {
                results: data.items,
                pagination: {
                  more: (params.page * RECORDS_PER_REQUEST) < data.total_count
                }
              };
            },
            cache: true
          },
          escapeMarkup: function (markup) {
            return markup;
          },
          minimumInputLength: 3,
          templateResult: function (product) {
            if (!product.id) {
              return product.text;
            } else {
              return `
                <div class="row">
                  <div class="col-lg-12">
                    ${ product.description }
                  </div>
                  <div class="col-md-6">
                    Cód. ${ product.code }
                  </div>
                  <div class="col-md-6 text-right">
                    R. ${ product.regime }
                  </div>
                </div>
              `;
            }
          },
          templateSelection: function (product) {
            if (!product.id) {
              return product.text;
            } else {
              return product.code + ' &mdash; ' + product.description;
            }
          }
        };
      }],
      link: function (scope, element, attrs) {
        element.select2(scope.select2);
      },
      template: `
        <select></select>
      `
    };
  }
]);