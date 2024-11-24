window.angular.module('ERP').controller('ProductsCtrl', [
    '$scope', '$routeParams', '$document', '$location', 'Page', 'Ajax', 'FileHandler', '_siteUrl',
    function ($scope, $routeParams, $document, $location, Page, Ajax, FileHandler,  siteUrl) {
        Page.title('Productos');

        
        /*
        $scope.data = [];
        $scope.customer = 20696;

        $scope.downloadStocks = function () {
            Ajax.get(siteUrl('products/data_for_temporal_stock')).then(function (res) {
                FileHandler.get(baseUrl('public/files/report_stock_products.xlsx'), 'arraybuffer').then(function (file) {
                    var template = new XlsxTemplate(file, {autoClose: true});

                    template.putData(res.data, 'A4:K4', function (data) {
                        var newData = [];

                        data.forEach(function (row, index) {
                            newData.push([
                                index + 1, // A
                                row.code, // B
                                row.size, // C
                                row.description, // D
                                row.old_barcode, // E
                                row.linea, // F
                                row.genero, // G
                                row.edad, // H
                                row.deporte, // I
                                row.marca, // J
                                parseInt(row.store_stock) // J
                            ]);
                        });

                        return newData;
                    });

                    template.on('build', function (blob) {
                        console.log('Hecho!', blob);
                        FileHandler.download(blob, 'reporte_stock_productos.xlsx');
                    });

                    template.on('progress', function (percent) {
                    	console.log('%cPROGRESO', 'background:yellow;color:blue;font-size:3em', percent);
                    });
                });
            });
        };

        $scope.customerOpts = {
            placeholder: '- Seleccione -',
            ajax: {
              url: siteUrl('customers/remote_search'),
              dataType: 'json',
              data: function (params) {
                return {
                  q: params.term,
                  page: params.page
                };
              }
            },
            templateResult: function(item) {
              if (item.text) {
                return item.text;
              } else {
                var result = '<div class="row">';
      
                if (item.full_name) {
                  result += `<div class="col-lg-12">${ item.full_name }</div>`;
                }
      
                result += `
                    <div class="col-md-4 col-sm-6">
                      ${ $scope.getDocType(item.type, item.id_number.length) } Nº ${ item.id_number}
                    </div>
                    <div class="col-md-8 col-sm-6 text-right">
                      ${ item.barcode_card2 ? 'Tarjeta N° ' + item.barcode_card2 : (item.barcode_inticard ? 'Inticard ' + item.barcode_inticard : '') }
                    </div>
                  </div>
                `;
      
                return $(result);
              }
            },
            templateSelection: function (item) {
              if (item.text) {
                return item.text;
              } else {
                return $scope.getDocType(item.type, item.id_number.length) + ' Nº ' + item.id_number + (item.full_name ? ' — ' + item.full_name : '');
              }
            }
        };

        $scope.getDocType = function (customerType, idNumberLength) {
        if (customerType === 'PERSONA') {
            return idNumberLength === 8 ? 'DNI' : 'Doc.';
        } else {
            return 'RUC';
        }
        };
        $scope.getCustomerSelected = function () {
        if ($('#customer').select2('data').length > 0) {
            var customer = $('#customer').select2('data')[0];
    
            return $scope.getDocType(customer.type, customer.id_number.length) + ' Nº ' + customer.id_number + (customer.full_name ? ' — ' + customer.full_name : '');
        } else {
            return '';
        }
        };
        /*
        products.lists().success(function(data)
        {
            if(!Object.keys(data).length)
            {
                $scope.response = "empty";
                $scope.data = [];
            }
            else
            {
                $scope.response = "filled";
                $scope.data = data;
            }
        });*/

    }
]);
