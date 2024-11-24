window.angular.module('ERP').controller('TestingMigrationCtrl', [
    '$scope', '$window', '$timeout', 'Page', 'Ajax', 'FileHandler', '$parse',
    function ($scope, $window, $timeout, Page, Ajax, FileHandler, $parse) {
        Page.title('Migración');

        $scope.csv = '';
        $scope.separatorOpts = [
            {value: ',', text: 'Coma'},
            {value: ';', text: 'Punto y coma'}
        ];
        $scope.separator = ';';
        $scope.query = '';
        $scope.result = '';
        $scope.hasHeaders = true;
        $scope.quotes = true;

        $scope.headers = [];
        $scope.data = [];
        $scope.editor = null;

        $scope.stateOpts = {
            'ORIGEN_DE_DATOS': 0,
            'GENERAR_CONSULTA': 1
        };
        $scope.state = $scope.stateOpts.ORIGEN_DE_DATOS;

        $scope.loadData = function () {
            $scope.headers.length = 0;
            $scope.data.length = 0;

            var parts = $scope.csv.split("\n");

            function sanitize(part) {
                return part.split($scope.separator).map(function (e) {
                    if ($scope.quotes) {
                        return e.trim().replace(/'/g, "''").replace(/\\/g, "");
                    } else {
                        return e.trim();
                    }
                });
            }

            if ($scope.hasHeaders) {
                if (!parts.length) {
                    return;
                }

                sanitize(parts[0]).forEach(function (item, index) {
                    item = item.trim();

                    if (item.length) {
                        var count = 1;
                        var newItem = item;

                        while ($scope.headers.indexOf(newItem) >= 0) {
                            count++;
                            newItem = item + count;
                        }

                        $scope.headers.push(newItem);
                    } else {
                        $scope.headers.push(index.toString()); // Si no tiene encabezado, se agrega su índice
                        // Si se ingresa un número como encabezado, se podrían producir duplicidades
                    }
                });
            } else {
                if (parts.length) {
                    sanitize(parts[0]).forEach(function (item, index) {
                        $scope.headers.push(index.toString());
                    });
                }
            }

            for (var i = ($scope.hasHeaders ? 1 : 0); i < parts.length; i++) {
                if (parts[i].length > 0) {
                    var row = {};

                    sanitize(parts[i]).forEach(function (item, index) {
                        row[$scope.headers[index]] = row[index.toString()] = item;
                    });

                    $scope.data.push(row);
                }
            }
        };

        $scope.generate = function () {
            var parts = $scope.csv.split("\n");
            var context = {
                data: []
            };
            
            $scope.result = '';

            if ($scope.query.length) {
                for (var i = ($scope.hasHeaders ? 1 : 0); i < parts.length; i++) {
                    if (parts[i].length > 0) {
                        context.data.length = 0;
                        context.data = parts[i].replace(/"/g, '').split($scope.separator).map(function (e) {
                            if ($scope.quotes) {
                                e = e.replace(/'/g, "''");
                            }

                            return e.trim();
                        });

                        var dataFn = $parse($scope.query);
                        $scope.result += dataFn(context) + "\n";
                    }
                }
            }
        };

        $scope.download = function () {
            FileHandler.download(new Blob(["\ufeff", $scope.result], {type : 'text/x-sql'}), 'table.sql');
        };

        $scope.next = function () {
            $scope.state = $scope.stateOpts.GENERAR_CONSULTA;
            $scope.loadData();

            if (!$scope.editor) {
                $window.riot.mount('riot-table', {
                    data: $scope.data,
                    hasHeaders: $scope.hasHeaders,
                    headers: $scope.headers
                });

                $timeout(function () {
                    $scope.editor = $window.CodeMirror.fromTextArea(document.querySelector('[ng-view] textarea'), {
                        mode: 'text/x-sql',
                        lineNumbers: true,
                        autofocus: true,
                        matchBrackets: true,
                        theme: 'monokai'
                    });
                });
            }


            console.log('headers', $scope.headers);
            console.log('data', $scope.data);
        };

        $scope.previous = function () {
            $scope.state = $scope.stateOpts.ORIGEN_DE_DATOS;
        };

        $scope.finish = function () {
            var sql = $scope.editor.getValue(' ').replace(/  +/g, ' ');

            $scope.result = '';

            $scope.data.forEach(function (row) {
                $scope.result += sql.replace(/\$\{([^\}`]*)\}/g, function (match, expr) {
                    return (function () {
                        return eval(expr);
                    }).call(row);
                }) + "\n";
            });

            var modal = $window.bootbox.dialog({
                title: 'Consulta generada',
                message: '<textarea readonly class="form-control" style="width: 100%; min-height: 300px">' + $scope.result + '</textarea>',
                onEscape: true,
                backdrop: true,
                size: 'large',
                show: false,
                buttons: {
                    close: {
                        label: 'Cerrar',
                        className: 'btn btn-default'
                    },
                    copy: {
                        label: 'Copiar a portapapeles',
                        className: 'btn btn-default',
                        callback: function () {
                            modal.find('textarea').select();

                            document.execCommand('copy');

                            return false;
                        }
                    },
                    download: {
                        label: 'Descargar',
                        className: 'btn btn-primary',
                        callback: function () {
                            $scope.download();

                            return false;
                        }
                    }
                }
            });

            modal.modal('show');
        };

        $scope.saveAs = function () {
            var sql = $scope.editor.getValue();

            FileHandler.download(new Blob(["\ufeff", sql], {type : 'text/x-sql'}), 'query.sql');
        };

        $timeout(function () {
            $('input[type="file"]').change(function (e) {
                var file = this.files[0];

                if (/\.csv$/gi .test(file.name)) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $scope.csv = e.target.result;
                        $scope.$apply();
                    };
                    reader.readAsText(file);
                } else {
                    alert('No es un formato CSV');
                }
            });
        });
    }
]);
