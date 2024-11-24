<section class="scrollable wrapper">
	<div class="row">

        <div class="col-sm-12">
            <a href="#/campaigns/add" class="btn btn-primary">
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
                                        <th width="60px" class="text-center">N°</th>
                                        <th width="100px" class="text-center">Código</th>
                                        <th class="text-center">Descripción</th>
                                        <th class="text-center">Validez</th>
                                        <th width="130px" class="text-center">Activo</th>
                                        <th class="text-center" if="{ data.length }" colspan="3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr each="{ row, index in data }">
                                        <td width="60px" class="text-center v-middle">{ index + 1 }</td>
                                        <td width="100px" class="v-middle">{ 'CMP' + row.id.zeros(3) }</td>
                                        <td class="v-middle">{ row.description }</td>
                                        <td class="v-middle">{
                                            row.end_date ?
                                                moment(row.start_date).format('DD/MM/YYYY') + ' — ' + moment(row.end_date).format('DD/MM/YYYY')
                                            :
                                                'Desde ' + moment(row.start_date).format('DD/MM/YYYY')
                                        }</td>
                                        <td width="130px" class="text-center v-middle">
                                            <label class="switch m-b-none" onclick="{ parent.opts.message }">
                                                <input type="checkbox" if="{ !row.end_date || (row.start_date.toDate() <= new Date() && row.end_date.toDate() >= new Date()) }" checked="{ row.active == 't' && (!row.end_date || (row.start_date.toDate() < new Date() && row.end_date.toDate() >= new Date())) }" onchange="{ parent.opts.activate }">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td width="80px" class="text-center v-middle">
                                            <a href="#/campaigns/{ row.id }">Ver</a>
                                        </td>
                                        <td width="120px" class="text-center v-middle">
                                            <a href="#/campaigns/edit/{ row.id }">Editar</a>
                                        </td>
                                        <td width="120px" class="text-center v-middle">
                                            <a href="#" onclick="{ parent.opts.delete }">Eliminar</a>
                                        </td>
                                    </tr>
                                    <tr if="{ !data.length }">
                                        <td class="text-center" colspan="5">
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
        $scope.records = <?php echo json_encode($records); ?>;

        var onactivate = function (e) {
            var item = e.item.row || e.item;

            item.active = (e.target.checked ? 't' : 'f');

            e.target.disabled = 'disabled';

            $.post(siteUrl('campaigns/activate'), { id: item.id, active: item.active }).done(function (data) {
                if ('error' in data) {
                    e.target.checked = !e.target.checked;
                    item.active = (e.target.checked ? 't' : 'f');
                }
            }).always(function () {
                e.target.removeAttribute('disabled');
            });
        };

        var onmessage = function (e) {
            var row = e.item.row || e.item;

            if (!row.end_date || (row.start_date.toDate() < new Date() && row.end_date.toDate() >= new Date())) { // Las fechas están vigentes
                return true;
            } else {
                bootbox.alert({
                    title: 'El rango de fechas ha caducado',
                    message: 'Para poder activar esta campaña actualice las fechas de vigencia.'
                });
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
                        $.post(siteUrl('campaigns/delete'), { id: item.id }, function (res) {
                            if ('ok' in res) {
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
                            } else {
                                $rootScope.$apply(function () {
                                    $rootScope.Session.setMessage(res.error || 'Ocurrió un error', 'danger', true);
                                });
                            }
                        });
                    }
                }
            });
        };

        riot.mount('riot-table', {
            'data': $scope.records,
            'activate': onactivate,
            'delete': ondelete,
            'message': onmessage
        });
    });
</script>
