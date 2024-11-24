window.angular.module('ERP').directive('erpAvatar', [
    '$window', '$log',
    function ($window, $log) {
        var $ = $window.jQuery;
        var file = $('<input type="file" accept="image/*" />');
        var buttons = '';
        var maxSize = 0;

        // For dragging
        var coord = 0;
        var position = 0;
        var minPosition = 0;
        var orientation = null;

        for (var i = 0; i < 15; i++) {
            buttons += '\
                <label class="erp-avatar m-b-none m-r" style="cursor: pointer">\
                    <input type="radio" ng-model="mode" ng-value="' + (i + 1) + '" ng-change="change()" />\
                    <span class="thumb avatar pull-left" style="width: auto">\
                        <div class="img" style="background-image: url(' + $window.baseUrl('public/images/avatar/sprite.png') + '); background-repeat: none; background-position: -' + (i * 60) + 'px 0; height:60px; min-width:60px"></div>\
                    </span>\
                </label>\
            ';
        }

        return {
            restrict: 'E',
            scope: {
                avatar: '=',
                mode: '=',
                file: '=',
                default: '@?'
            },
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
                $scope.selected = $scope.default || 'predefined';

    //            $scope.erpAvatar = '1';

                $scope.chooseImage = function () {
                    file.trigger('click');
                };

                $scope.setOption = function (value) {
                    if ($scope.selected !== value) {
                        if (value === 'predefined') {
                            $scope.selected = 'predefined';
                            $scope.mode = 1;
                            $scope.file = '';
                            $scope.change();
                        } else { // customized
        //                    $scope.selected = 'customized';
                            $scope.chooseImage();
                        }
                    }
                };

                $scope.change = function () {
                    if (parseInt($scope.mode)) {
                        $scope.avatar = 'images/avatar/' + $scope.mode + '.png';
                        $scope.file = '';
                    } else {
                        $scope.avatar = 'images/users/';
                    }
                };

                $scope.$watch('mode', function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        if (newVal > 0) {
                            $scope.selected = 'predefined';
                        } else {
                            $scope.selected = 'customized';
                        }
                    }
                });

                $scope.$watch('avatar', function (newVal, oldVal) {
                    if (newVal != oldVal) {
                        $element.find('.avatar-preview').
                            attr('src', 'public/' + newVal).
                            css({width: '', height: ''});
                    }
                });
            }],
            link: function (scope, element, attrs, ctrl) {
                var $image = $(element).find('.avatar-preview');
                var canvas = document.createElement('CANVAS');

                canvas.width = 128;
                canvas.height = 128;

                var _mousemove = function (e) {
                    var newPosition, positionAttr;

                    if (orientation === 'landscape') {
                        newPosition = position + (e.clientX - coord);
                        positionAttr = 'left';
                    } else if (orientation === 'portrait') {
                        newPosition = position + (e.clientY - coord);
                        positionAttr = 'top';
                    }

                    if (newPosition <= 0 && newPosition >= minPosition) {
                        $image.css(positionAttr, newPosition + 'px');
                    }
                };

                var _mouseup = function (e) {
                    _draw();

                    $(document).off('mousemove', _mousemove);
                    $(document).off('mouseup', _mouseup);

                    $(document.body).removeClass('avatar-preview-grabbing');
                    $image.removeClass('avatar-preview-grabbing');
                };

                var _draw = function () {
                    var crop = {top: 0, left: 0, size: 122};
                    var ctx = canvas.getContext('2d');
                    var ratio, size;

                    if (orientation === 'landscape') {
                        ratio = maxSize/crop.size;
                        crop.size = maxSize;
                        crop.left = -$image.position().left * ratio;
                    } else if (orientation === 'portrait') {
                        ratio = maxSize/crop.size;
                        crop.size = maxSize;
                        crop.top = -$image.position().top * ratio;
                    }


                    ctx.drawImage($image.get(0), crop.left, crop.top, crop.size, crop.size, 0, 0, 128, 128);
                    canvas.toBlob(function (blob) {
                        scope.file = blob;
                        scope.$apply();
                    }, 'image/png', 1);
                };

                file.change(function (e) {
                    var file = this.files[0];

                    if (/^image/ .test(file.type)) {
                        scope.selected = 'customized';
                        scope.mode = 0;
                        scope.change();

                        $(element).find('.avatar-preview').
                            attr('src', window.URL.createObjectURL(file)).
                            css({width: '', height: ''});

                        scope.$apply();
                    }
                });

                $image.get(0).onload = function () {
                    var imageWidth = $(this).width();
                    var imageHeight = $(this).height();

                    if (imageWidth && imageHeight) {
                        if (imageWidth > imageHeight) {
                            orientation = 'landscape';
                            maxSize = imageHeight;

                            $(this).css({width: '', top: 0});
                            $(this).css('height', '122px');
                            $(this).css('left', -parseInt(($(this).width() - 122)/2) + 'px');
                        } else {
                            orientation = 'portrait';
                            maxSize = imageWidth;

                            $(this).css({height: '', left: 0});
                            $(this).css('width', '122px');
                            $(this).css('top', -parseInt(($(this).height() - 122)/2) + 'px');
                        }

                        _draw();

                        window.URL.revokeObjectURL(this.src);
                    }
                };

                $image.mousedown(function (e) {
                    $(document.body).addClass('avatar-preview-grabbing');
                    $image.addClass('avatar-preview-grabbing');

                    if (orientation === 'landscape') {
                        coord = e.clientX;
                        position = $image.position().left;
                        minPosition = 122 - $image.width();
                    } else {
                        coord = e.clientY;
                        position = $image.position().top;
                        minPosition = 122 - $image.height();
                    }

                    $(document).on('mousemove', _mousemove);
                    $(document).on('mouseup', _mouseup);

                    e.preventDefault();
                });

    //            $(document).off('mousemove', _mousemove);

    //            $(document).off('mouseup', _mouseup);
    //            $(document).on('mouseup', _mouseup);

                scope.change();
            },
            template: '\
                <div class="btn-group">\
                    <button type="button" ng-class="selected === \'predefined\' ? \'btn btn-default active\' : \'btn btn-default\'" ng-click="setOption(\'predefined\')">Predefinido</button>\
                    <button type="button" ng-class="selected === \'customized\' ? \'btn btn-default active\' : \'btn btn-default\'" ng-click="setOption(\'customized\')">Personalizado</button>\
                </div>\
                <section class="panel panel-default m-b-none m-t">\
                    <div class="panel-body">\
                        <div ng-show="selected === \'predefined\'" class="tab-container">\
                            <div style="white-space: nowrap; overflow-x: auto">\
                                ' + buttons + '\
                            </div>\
                        </div>\
                        <div ng-show="selected === \'customized\'" class="tab-container text-center">\
                            <p class="pull-right">\
                                <button type="button" class="btn btn-default" ng-click="chooseImage()">Cambiar imagen</button>\
                            </p>\
                            <div class="thumb-lg avatar avatar-preview-container" style="border: 3px solid #177BBB">\
                              <img class="avatar-preview" style="top: 0; left: 0" />\
                            </div>\
                        </div>\
                    </div>\
                </section>\
            '
        };
    }
]);