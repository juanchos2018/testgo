<section class="scrollable wrapper">

    <form ng-submit="submit()" id="record-sunat-table">
        <div class="row">
            <div class="col-lg-2">
                <div class="form-group">
                    <label class="required">Tabla N°</label>
                    <input type="number" required class="form-control text-center" ng-model="id" ng-readonly="action === 'detail'">
                </div>
            </div>
            <div class="col-lg-10">
                <div class="form-group">
                    <label class="required">Descripción</label>
                    <input type="text" class="form-control" required ng-model="description" ng-readonly="action === 'detail'">
                </div>
            </div>
        </div>
    </form>

    <div class="row">
        <div class="col-lg-12">
            <riot-table>
                <h4>Elementos <small>({ total })</small></h4>

                <form class="hidden" id="elements-sunat-table" onsubmit="{ opts.add }" if="{ opts.action !== 'detail' }"></form>

                <div class="table-responsive panel panel-default">
                    <table class="table">
                        <thead>
                            <tr>
                                <th width="100px">Código</th>
                                <th>Descripción</th>
                                <th width="100px" if="{ opts.action !== 'detail' }">&nbsp;</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr if="{ opts.action !== 'detail' }">
                                <td>
                                    <input type="text" maxlength="3" class="form-control text-center" required form="elements-sunat-table" pattern="\d+" name="code" autocomplete="off">
                                </td>
                                <td>
                                    <input type="text" class="form-control" required form="elements-sunat-table" name="description" autocomplete="off">
                                </td>
                                <td class="text-center">
                                    <button type="submit" class="btn btn-success" form="elements-sunat-table">Agregar</button>
                                </td>
                            </tr>
                            <tr each="{ row in data }">
                                <td class="text-center">{ row.code }</td>
                                <td>{ row.description }</td>
                                <td class="text-center" if="{ parent.opts.action !== 'detail' }">
                                    <a href="#" onclick="{ parent.opts.remove }">Eliminar</a>
                                </td>
                            </tr>
                            <tr if="{ !data.length }">
                                <td class="text-center" colspan="3">
                                    No se encontraron registros
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <searchbox input_class="form-control m-b" placeholder="Filtrar..."></searchbox>
                    </div>
                    <div class="col-lg-8">
                        <paginator button_class="btn btn-sm btn-default" active_button_class="btn btn-sm btn-primary"></paginator>
                    </div>
                </div>

            </riot-table>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 text-right m-t">
            <div class="form-group m-t">
                <a href="#/sunat_tables" class="btn btn-default" ng-bind="action === 'detail' ? 'Volver' : 'Cancelar'"></a>
                <button type="submit" class="btn btn-primary" form="record-sunat-table" ng-disabled="!data.length" ng-if="action !== 'detail'">
                    Guardar
                </button>
            </div>
        </div>
    </div>

</section>

<script>
    angularScope(['$scope', '$filter', '$window', 'Page', function ($scope, $filter, $window, Page) {
        var $ = $window.jQuery;
        
        <?php if ($action === 'add'): ?>
        $scope.data = [];
        $scope.id = '';
        $scope.description = '';
        <?php else: ?>
        $scope.originalId = <?php echo $data->id; ?>;
        $scope.data = <?php echo $data->items; ?>;
        $scope.id = $scope.originalId;
        $scope.description = '<?php echo $data->description; ?>';
        <?php endif; ?>

        $scope.codes = <?php echo $codes; ?>;
        $scope.action = '<?php echo $action; ?>';

        switch ($scope.action) {
            case 'edit':
                Page.title('Editar tabla SUNAT');
                break;
            case 'detail':
                Page.title('Detalle de tabla SUNAT');
                break;
            default:
                Page.title('Nueva tabla SUNAT');
        }

        if ($scope.action !== 'detail') {
            $('[ng-model="id"]').focus();
        }

        $window.riot.mount('riot-table', {
            'data': $scope.data,
            'action': $scope.action,
            add: function (e) {
                var self = this;

                var itemFound = $scope.data.find(function (item) {
                    return item.code === self.code.value;
                });

                if (itemFound) {
                    $window.bootbox.alert({
                        size: 'small',
                        title: 'Código repetido',
                        message: 'Ya existe un registro con código "' + self.code.value + '".',
                        buttons: {
                            ok: {
                                label: 'Aceptar',
                                className: 'btn btn-danger'
                            }
                        },
                        callback: function () {
                            self.code.focus();
                        }
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.data.push({ code: self.code.value, description: self.description.value });
                        $scope.data = $filter('orderBy')($scope.data, 'code');
                    });

                    self.code.value = '';
                    self.description.value = '';
                    self.code.focus();

                    self.original = $scope.data;

                    self.update({ data: [] });
                }

            },
            remove: function (e) {
                var self = this.parent;
                
                $window.bootbox.confirm({
                    size: 'small',
                    title: '¿Está seguro?',
                    message: 'Está a punto de eliminar el registro "' + e.item.row.code + '".',
                    buttons: {
                        cancel: {
                            label: 'Cancelar',
                            className: 'btn btn-default'
                        },
                        confirm: {
                            label: 'Continuar',
                            className: 'btn btn-danger'
                        }
                    },
                    callback: function (yes) {
                        if (yes) {
                            $scope.$apply(function () {
                                $scope.data.splice($scope.data.indexOf(e.item.row), 1);
                                $scope.data = $filter('orderBy')($scope.data, 'code');
                            });

                            self.original = $scope.data;
                            
                            self.update({ data: [] });
                        }
                    }
                });                
            }
        })
    }]);
</script>
