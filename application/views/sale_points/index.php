<section class="scrollable wrapper">
	<div class="row">

        <div class="col-sm-12">
            <a href="#/sale_points/add" class="btn btn-primary">
                <i class="fa fa-plus text"></i>
                <span class="text">&nbsp;Agregar</span>
            </a>
        </div>
        <div class="col-sm-12">
            <riot-table>
                <div class="row">
                    <div class="col-lg-offset-9 col-lg-3">
                        <searchbox input_class="form-control" placeholder="Filtrar..."></searchbox>
                    </div>
                </div>
                <div class="row m-t">
                    <div class="col-lg-12">
                        <div class="table-responsive">
                            <table class="table table-bordered table-hover bg-white">
                                <thead>
                                    <tr>
                                        <th class="text-center">N°</th>
                                        <th class="text-center">Punto de venta</th>
                                        <th class="text-center">Ticketeras</th>
                                        <th class="text-center">Activo</th>
                                        <th class="text-center" colspan="2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr each="{ row, index in data }">
                                        <td width="60px" class="text-center v-middle">{ index + 1 }</td>
                                        <td class="v-middle">{ row.description }</td>
                                        <td class="v-middle">{ row.printers || '-' }</td>
                                        <td width="150px" class="text-center v-middle">
                                            <label class="switch m-b-none" onclick="{ parent.opts.message }">
                                                <input type="checkbox" if="{ row.printers.length }" checked="{ row.active == 't' && row.printers.length }" onchange="{ parent.opts.activate }">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td width="120px" class="text-center v-middle">
                                            <a href="#/sale_points/edit/{ row.id }">Editar</a>
                                        </td>
                                        <td width="120px" class="text-center v-middle">
                                            <a href="#" onclick="{ parent.opts.delete }">Eliminar</a>
                                        </td>
                                    </tr>
                                    <tr if="{ !data.length }">
                                        <td class="text-center" colspan="6">
                                            No se encontraron registros
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                       </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        { total } registros
                    </div>
                    <div class="col-lg-6">
                        <paginator button_class="btn btn-sm btn-default" active_button_class="btn btn-sm btn-primary"></paginator>
                    </div>
                </div>
            </riot-table>
        </div>

    </div>
</section>

<script>
    angularScope(function ($scope, $rootScope) {
        $scope.salePoints = <?php echo json_encode($records); ?>;

        var onactivate = function (e) {
            var item = e.item.row || e.item;
            
            item.active = (e.target.checked ? 't' : 'f');
            
            e.target.disabled = 'disabled';

            $.post(siteUrl('sale_points/activate'), { id: item.id, active: item.active }).fail(function () {
                e.target.checked = !e.target.checked;
                item.active = (e.target.checked ? 't' : 'f');
            }).always(function () {
                e.target.removeAttribute('disabled');
            });
        };

        var onmessage = function (e) {
            var item = e.item.row || e.item;

            if (!item.printers) { // No tiene ninguna ticketeras
                bootbox.alert({
                    title: 'No se encontraron ticketeras vinculadas',
                    message: 'Para poder activar este punto de venta, debe editar el registro y asignar al menos una ticketera.'
                });
            } else {
                return true;
            }
        };

        var ondelete = function (e) {
            var self = this;
            var item = e.item.row || e.item;

            bootbox.confirm({
                title: '¿Está seguro?',
                message: 'Está a punto de eliminar "' + item.description + '", esta acción no podrá deshacerse y podría afectar a otros registros vinculados.',
                buttons: {
                    cancel: {
                        label: 'Cancelar',
                        className: 'btn-default'
                    },
                    confirm: {
                        label: 'Continuar',
                        className: 'btn-danger'
                    }
                },
                callback: function (yes) {
                    if (yes) {
                        $.post(siteUrl('sale_points/delete'), { id: item.id }, function (data) {
                            var data = self.data;

                            data.splice(data.indexOf(item), 1);

                            self.unmount();

                            riot.mount('riot-table', {
                                'data': data,
                                'activate': onactivate,
                                'delete': ondelete,
                                'message': onmessage
                            });

                            $rootScope.$apply(function () {
                                $rootScope.Session.setMessage('Se eliminó el registro correctamente', 'success', true);
                            });
                        }).fail(function (err) {
                            $rootScope.$apply(function () {
                                $rootScope.Session.setMessage(err.statusText, 'danger', true);
                            });
                        });
                    }
                }
            });
        };

        riot.mount('riot-table', {
            'data': $scope.salePoints,
            'activate': onactivate,
            'delete': ondelete,
            'message': onmessage
        });
    });
</script>
