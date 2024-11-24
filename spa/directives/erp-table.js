window.angular.module('ERP').directive('erpTable', [
    '$log', '$window', '$timeout', '$parse',
    function ($log, $window, $timeout, $parse) {
        var $ = $window.jQuery;
        /*var varName = '';
        var dataName = '';

        var addSelAttr = function (data) {
            data.forEach(function (row) {
                row.selected = true;
            });
        };*/

        return {
            scope: {
                ajax: '@?',
                selection: '@?',
                dom: '@?', // DOM structure
                langSearch: '@?', // Translation for Seach label
                callback: '@?', // Translation for Seach label
                hideId: '@?',
                hideCols: '=?',
                order: '=?'
            },
            /*restrict: 'A',
            replace: true,
            scope: {
                erpTable: '=',
                ngModel: '=?',
                selection: '@?'
            },
            transclude: true,
    //        compile: function (element) {
    //            $log.error('compile');
    //            $log.log(element.html());
    //        },*/
            //controller: function ($scope, $element, $transclude) {
                //addSelAttr($scope.erpTable);

                /*$scope.dataset = 'SDFDS';
                $transclude(function (clone) {
                    var scope = angular.element('[ng-view]').scope();
                    var matches = clone.filter('tbody').html().match(/ngRepeat\: (\w+) in (\w+)/);

                    dataName = matches.pop();
                    varName = matches.pop();

                    if ($scope.selection !== undefined) {
                        addSelAttr(scope[dataName]);
                    }

                    $scope.dataset = scope[dataName];

                    scope.$watch(dataName, function (newVal, oldVal) {
                        if ($scope.selection !== undefined) {
                            addSelAttr(newVal);
                        }

                        $scope.dataset = newVal;
                    });

                });*/


                /*var scope = $element.scope();
                scope.$data = $scope.erpTable;

                $scope.$watch('erpTable', function (newVal, oldVal) {
                    if (newVal.length > 0 || oldVal.length > 0) {
                        console.log('oldVal = ' + JSON.stringify(oldVal));
                        console.log('newVal = ' + JSON.stringify(newVal));

                        scope.$data = newVal;
                    }
                }, true);*/
            //},
            link: function (scope, element, attrs, ctrl) {
                $timeout(function () {
                    var config = {
                        bProcessing: true,
                        sDom: (scope.dom || "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-8'i><'col-sm-4'p>>"),
                        sPaginationType: 'full_numbers',
                        oLanguage: {
                            sProcessing:     'Procesando...',
                            sLengthMenu:     'Mostrar _MENU_ registros',
                            sZeroRecords:    'No se encontraron resultados',
                            sEmptyTable:     'Ningún dato disponible en esta tabla',
                            sInfo:           'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
                            sInfoEmpty:      'Mostrando registros del 0 al 0 de un total de 0 registros',
                            sInfoFiltered:   '(filtrado de un total de _MAX_ registros)',
                            sInfoPostFix:    '',
                            sSearch:         (scope.langSearch !== undefined ? scope.langSearch : 'Buscar'),
                            sUrl:            '',
                            sInfoThousands:  ',',
                            sLoadingRecords: 'Cargando...',
                            oPaginate: {
                                sFirst:    '«',
                                sPrevious: '←',
                                sNext:     '→',
                                sLast:     '»'
                            },
                            oAria: {
                                sSortAscending:  ': Activar para ordenar la columna de manera ascendente',
                                sSortDescending: ': Activar para ordenar la columna de manera descendente'
                            }
                        }
                    };

                    if (scope.ajax) {
                        config.processing = true;
                        config.serverSide = true;
                        config.ajax = scope.ajax;
                    }

                    if (scope.callback) {
                        config.fnDrawCallback = scope.callback;
                    }

                    // Por defecto creamos todas las columnas iguales (sin atributos especiales):
                    config.aoColumns = [];

                    for (var i = 0; i < element.find('thead > tr > th').length; i++) {
                        config.aoColumns.push(null);
                    }

                    // Si se trata de una tabla con controles de selección, configuramos la primera columna (0)

                    if (scope.selection !== undefined) {
                        config.aoColumns[0] = {
                            bSearchable: false,
                            bSortable: false
                        };
                            }

                    // hideId ocultará la primera (o segunda si tiene controles de selección) columna
                    // hideId es OBSOLETA y NO es recomendable usarlo, en su lugar usar hideCols

                    if (scope.hideId !== undefined && scope.hideId) {
                        var indexId = (!config.aoColumns[0] ? 0 : 1);

                        config.aoColumns[indexId] = {
                            bVisible: false
                        };
                    }

                    // Se ocultan las columnas especificadas en hideCols (tiene que ser un array)

                    if (scope.hideCols && scope.hideCols.constructor.name === 'Array') {
                        scope.hideCols.forEach(function (col) {
                            config.aoColumns[col] = {
                                bVisible: false
                            };
                        });
                    }

                    // Si se estableció un orden inicial

                    if (scope.order && scope.order.constructor.name === 'Array') {
                        config.order = scope.order;
                    }

                    /*    var type = (scope.selection === 'single' ? 'radio' : 'checkbox');
                        if (scope.selection === 'single') {
                            element.find('table > thead > tr').prepend('<th width="20">&nbsp;</label>\
                            </th>');
                        } else {
                            element.find('table > thead > tr').prepend('<th width="20" class="text-center">\
                                <label class="checkbox m-n i-checks">\
                                    <input type="checkbox" style="width: 0; height: 0" />\
                                    <i></i>\
                                </label>\
                            </th>');
                        }

                        element.find('table > tbody > tr').prepend('<td class="text-center">\
                            <label class="checkbox m-n i-checks">\
                                <input type="' + type + '" style="width: 0; height: 0" ng-model="erpTable[0].selected" />\
                                <i></i>\
                            </label>\
                        </td>');

                    }*/

                    $(element.get(0)).dataTable(config);
                });
            }/*,
            template: '\
                <div class="table-responsive">\
                    <table class="table table-hover b-t b-light" ng-transclude>\
                    </table>\
                </div>\
            '*/
        };
    }
]);