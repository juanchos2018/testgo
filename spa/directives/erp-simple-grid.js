window.angular.module('ERP').directive('erpSimpleGrid', [
    '$timeout', 'SimpleGrid', '$filter',
    function ($timeout, SimpleGrid, $filter) {
        var $ = angular.element;

        return {
            restrict: 'E',
            scope: {
                limit: '@?',
                labels: '=',
                editable: '=?',
                inputClass: '@?',
                inputStyle: '=?',
                ngModel: '='
            },
            controller: ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
                $scope.id = $scope.$id;

                SimpleGrid.set($scope.id);

                SimpleGrid.limitPerPage($scope.id, parseInt($scope.limit || 10));
                $scope.pages = [];
                $scope.shown = true;
                $scope.SimpleGrid = SimpleGrid;
                $scope.editable = $scope.editable || [];
                $scope.inputClass = $scope.inputClass || '';
                $scope.inputStyle = $scope.inputStyle || {};

                SimpleGrid.filteredData($scope.id, $scope.ngModel);

                $scope.$watch('search', function (newVal, oldVal) {
                    if (SimpleGrid.startIndex($scope.id) != 0) {
                        SimpleGrid.startIndex($scope.id, 0);
                    }
                });

                $scope.isEditable = function (key) {
                    return $scope.editable.indexOf(key) > -1;
                };

                $scope.currentPage = function () {
                    return SimpleGrid.startIndex($scope.id) / SimpleGrid.limitPerPage($scope.id) + 1;
                };

                $scope.setPage = function (page) {
                    console.log('Cambiar a página', page);
                    if (page > 0 && page <= $scope.getPages().length) {
                        console.log('Cambiando el startIndex a', (page - 1) * SimpleGrid.limitPerPage($scope.id));
                        SimpleGrid.startIndex($scope.id, (page - 1) * SimpleGrid.limitPerPage($scope.id));
                    }
                };

                $scope.getPages = function () {
                    var pages = $filter('range')(Math.ceil(SimpleGrid.filteredData($scope.id).length / SimpleGrid.limitPerPage($scope.id)));

                    if (!pages.length) {
                        return [0];
                    } else {
                        return pages;
                    }
                };
            }],
            link: function (scope, element, attrs, ctrl) {
                
            },
            template: '\
                <div class="row m-b">\
                    <div class="col-lg-6 col-lg-offset-6">\
                        <input type="search" class="form-control" ng-model="search" />\
                    </div>\
                </div>\
                <div class="fixed-scroll-x">\
                    <table ng-if="shown" class="table table-hover table-nowrap">\
                        <thead>\
                            <tr>\
                                <th ng-repeat="label in labels">{{label}}</th>\
                            </tr>\
                        </thead>\
                        <tbody>\
                            <tr ng-if="!SimpleGrid.filteredData(id).length">\
                                <td colspan="{{labels.length}}" style="padding-top: 15px; padding-bottom: 15px">No se encontraron datos</td>\
                            </tr>\
                            <tr ng-if="SimpleGrid.filteredData(id).length" ng-repeat="data in ngModel | filter : search | filteredSimpleGrid : id | limitSimpleGrid : id">\
                                <td ng-repeat="(key, value) in data">\
                                    <input ng-if="isEditable(key)" ng-model="data[key]" ng-class="inputClass" ng-style="inputStyle" />\
                                    <span ng-if="!isEditable(key)">{{value}}</span>\
                                </td>\
                            </tr>\
                        </tbody>\
                    </table>\
                </div>\
                <div class="row m-t">\
                    <div class="col-lg-6">\
                        {{SimpleGrid.filteredData(id).length}} registros\
                    </div>\
                    <div class="col-lg-6">\
                        <div class="pages-sg">\
                            <span class="page-sg first-page-sg" ng-click="setPage(1)">«</span>\
                            <span class="page-sg" ng-click="setPage(currentPage() - 1)">←</span>\
                            <span  ng-if="getPages().length < 8">\
                                <span class="page-sg" ng-repeat="page in getPages()" ng-click="setPage(page + 1)" ng-class="{current: currentPage() == page + 1}">{{page + 1}}</span>\
                            </span>\
                            <span  ng-if="getPages().length > 7">\
                                <span class="page-sg" ng-click="setPage(1)" ng-class="{current: currentPage() == 1}">1</span>\
                                <span ng-if="currentPage() < 5">\
                                    <span class="page-sg" ng-click="setPage(2)" ng-class="{current: currentPage() == 2}">2</span>\
                                    <span class="page-sg" ng-click="setPage(3)" ng-class="{current: currentPage() == 3}">3</span>\
                                    <span class="page-sg" ng-click="setPage(4)" ng-class="{current: currentPage() == 4}">4</span>\
                                    <span class="page-sg" ng-click="setPage(5)" ng-class="{current: currentPage() == 5}">5</span>\
                                </span>\
                                <span ng-if="currentPage() > 4 && currentPage() < getPages().length - 3">\
                                    <span class="page-sg separator-sg">...</span>\
                                    <span class="page-sg" ng-click="setPage(currentPage() - 1)" >{{currentPage() - 1}}</span>\
                                    <span class="page-sg current" ng-click="setPage(currentPage())">{{currentPage()}}</span>\
                                    <span class="page-sg" ng-click="setPage(currentPage() + 1)">{{currentPage() + 1}}</span>\
                                </span>\
                                <span ng-if="currentPage() > getPages().length - 4">\
                                    <span class="page-sg separator-sg">...</span>\
                                    <span class="page-sg" ng-click="setPage(getPages().length - 4)" ng-class="{current: currentPage() == getPages().length - 4}">{{getPages().length - 4}}</span>\
                                    <span class="page-sg" ng-click="setPage(getPages().length - 3)" ng-class="{current: currentPage() == getPages().length - 3}">{{getPages().length - 3}}</span>\
                                    <span class="page-sg" ng-click="setPage(getPages().length - 2)" ng-class="{current: currentPage() == getPages().length - 2}">{{getPages().length - 2}}</span>\
                                    <span class="page-sg" ng-click="setPage(getPages().length - 1)" ng-class="{current: currentPage() == getPages().length - 1}">{{getPages().length - 1}}</span>\
                                </span>\
                                <span ng-if="currentPage() < getPages().length - 3">\
                                    <span class="page-sg separator-sg">...</span>\
                                </span>\
                                <span class="page-sg" ng-click="setPage(getPages().length)" ng-class="{current: currentPage() == getPages().length}">{{getPages().length}}</span>\
                            </span>\
                            <span class="page-sg" ng-click="setPage(currentPage() + 1)">→</span>\
                            <span class="page-sg last-page-sg" ng-click="setPage(getPages().length)">»</span>\
                        </div>\
                    </div>\
                </div>\
            '
        };
    }
]);
