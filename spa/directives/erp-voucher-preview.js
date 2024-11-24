window.angular.module('ERP').directive('erpVoucherPreview', [
    '$window', '$rootScope', '$timeout', 'Sales',
    function ($window, $rootScope, $timeout, Sales) {
        var $ = $window.angular.element;

        return {
            restrict: 'E',
            scope: {
                voucher: '@',
                printer: '=',
                ngModel: '=',
                serie: '=',
                origin: '=?',
                total: '='
            },
            controller: ['$scope', '$element', function ($scope, $element) {
                $scope.currentDate = $rootScope.currentDate;
                $scope.buildSerie = Sales.buildSerie;
            }],
            link: function (scope, element, attrs, ctrl) {

            },
            replace: true,
            template: '\
                <div class="ticket-container">\
                    <div>\
                        <div class="col30">\
                            Nro. Serie\
                        </div>\
                        <div class="col35">\
                            : {{printer}}\
                        </div>\
                        <div class="col35 text-right">\
                            {{currentDate() | date : \'dd/MM/yyyy\'}}\
                        </div>\
                    </div>\
                    <div>\
                        <div class="col30">\
                            {{voucher === "' + Sales.NOTA_DE_CREDITO + '" ? \'N.C.\' : voucher.capitalize()}} Nro.\
                        </div>\
                        <div class="col35">\
                            : {{buildSerie(serie.serie, serie.serial_number)}}\
                        </div>\
                        <div class="col35 text-right">\
                            {{currentDate() | date : \'HH:mm:ss\'}}\
                        </div>\
                    </div>\
                    <div ng-if="!!origin">\
                        <div class="col30">\
                            {{origin.voucher.capitalize()}} Nro.\
                        </div>\
                        <div class="col60">\
                            : {{buildSerie(origin.serie, origin.serial_number)}}\
                        </div>\
                    </div>\
                    <div class="separator"></div>\
                    <div ng-repeat="detail in ngModel">\
                        <div class="col100" ng-if="detail.regime === \'ZOFRA\'">\
                            D.S. {{detail.output_statement}}<br />\
                        </div>\
                        <div class="col25">\
                            {{detail.code}}\
                        </div>\
                        <div class="col75 text-right">\
                            {{detail.product}} - {{detail.size}}\
                        </div>\
                        <div class="col50">\
                            {{detail.quantity}} &times; {{detail.price | currency : \'S/\' : 2}}\
                        </div>\
                        <div class="col10 text-right">\
                            S/\
                        </div>\
                        <div class="col40 text-right">\
                            {{detail.quantity * detail.price | number : 2}}\
                        </div>\
                        <div class="separator"></div>\
                    </div>\
                    <div>\
                        <div class="col50">\
                            TOTAL\
                        </div>\
                        <div class="col10 text-right">\
                            S/\
                        </div>\
                        <div class="col40 text-right">\
                            {{total | number : 2}}\
                        </div>\
                    </div>\
                </div>\
            '
        };
    }
]);
