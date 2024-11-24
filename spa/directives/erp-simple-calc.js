window.angular.module('ERP').directive('erpSimpleCalc', [
    'HotKeys',
    function (HotKeys) {
        var $ = angular.element;
        var enterPressed = false;

        return {
            scope: {
                title: '@',
                ngModel: '='
            },
            controller: ['$scope', '$element', '$transclude', function ($scope, $element, $transclude) {
                $scope.label = $scope.ngModel.toString();

                $scope.write = function (num) {
                    num = parseInt(num);

                    if (isNaN(num)) { // Es un PUNTO
                        if ($scope.label.indexOf('.') < 0) {
                            $scope.label += '.';
                        }
                    } else {
                        if ($scope.label === '0') {
                            $scope.label = num.toString();
                        } else {
                            $scope.label += num.toString();
                        }
                    }

                    $scope.ngModel = parseFloat($scope.label);
                };

                $scope.clear = function () {
                    $scope.label = '0';
                    $scope.ngModel = 0;
                };

                $scope.del = function () {
                    if ($scope.label.length > 1) {
                        $scope.label = $scope.label.substring(0, $scope.label.length - 1);
                    } else if ($scope.ngModel > 0) {
                        $scope.label = '0';
                    }

                    $scope.ngModel = parseFloat($scope.label);
                };

                $scope.ok = function () {
                    enterPressed = true;
                };
            }],
            link: function (scope, element, attrs, ctrl) {
                $(element).on('show.bs.modal', function (e) {
                    enterPressed = false;

                    scope.ngModel = 0;
                    scope.label = '0';

                    HotKeys.add(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'], function (e, key) {
                        console.warn(key);
                        scope.write(key);
                        scope.$apply();

                        e.preventDefault();
                    }, '_simpleCalcInputNum');

                    HotKeys.add('DEL', function (e, key) {
                        console.warn(key);
                        scope.del();
                        scope.$apply();

                        e.preventDefault();
                    }, '_simpleCalcInputDel');

                    HotKeys.add('INTRO', function (e, key) {
                        console.warn(key);
                        $(element).find('.btn-primary:last').trigger('click');

                        e.preventDefault();
                    }, '_simpleCalcInputIntro');

                    HotKeys.add('ESC', function (e, key) {
                        console.warn(key);
                        $(element).find('button[data-dismiss].close').focus();
                        
                        e.preventDefault();
                    }, '_simpleCalcEsc');
                });

                $(element).on('hide.bs.modal', function (e) {
                    if (!enterPressed) {
                        scope.ngModel = '';
                        scope.$apply();
                    }

                    HotKeys.remove(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'], '_simpleCalcInputNum');
                    HotKeys.remove('DEL', '_simpleCalcInputDel');
                    HotKeys.remove('INTRO', '_simpleCalcInputIntro');
                    HotKeys.remove('ESC', '_simpleCalcEsc');
                });
            },
            template: '\
                <div class="modal-dialog modal-sm">\
                    <div class="modal-content">\
                        <div class="modal-header">\
                            <button type="button" class="close" data-dismiss="modal">\
                                <span aria-hidden="true">&times;</span>\
                                <span class="sr-only">Close</span>\
                            </button>\
                            <h4 class="modal-title">{{title}}</h4>\
                        </div>\
                        <div class="modal-body wrapper-lg">\
                            <div class="row m-b-xs i-2x">\
                                <div class="col-xs-12 text-right">\
                                    {{label}}\
                                </div>\
                            </div>\
                            <div class="row m-b m-t">\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(1)">1</button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(2)">2</button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(3)">3</button>\
                                </div>\
                            </div>\
                            <div class="row m-b">\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(4)">4</button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(5)">5</button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(6)">6</button>\
                                </div>\
                            </div>\
                            <div class="row m-b">\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(7)">7</button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(8)">8</button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(9)">9</button>\
                                </div>\
                            </div>\
                            <div class="row m-b">\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="clear()">C</button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(0)">0</button>\
                                </div>\
                                <div class="col-xs-4">\
                                    <button class="btn btn-default btn-block btn-lg" ng-click="write(\'.\')">.</button>\
                                </div>\
                            </div>\
                            <div class="row m-b">\
                                <div class="col-xs-12">\
                                    <button class="btn btn-primary btn-block btn-lg" data-dismiss="modal" ng-click="ok()">Aceptar</button>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                </div>\
            '
        };
    }
]);