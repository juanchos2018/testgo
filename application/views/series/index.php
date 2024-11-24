<section class="scrollable wrapper">
	<div class="row">

        <div class="col-sm-12">
            <a href="#/series/add" class="btn btn-primary">
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
                                        <th class="text-center">Empresa</th>
                                        <th class="text-center">Voucher</th>
                                        <th class="text-center">Régimen</th>
                                        <th class="text-center">N° de serie</th>
                                        <th class="text-center">N° correlativo</th>
                                        <th class="text-center">Subdiario</th>
                                        <th class="text-center" colspan="2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr each="{ row, index in data }">
                                        <td width="60ṕx" class="text-center v-middle">{ index + 1 }</td>
                                        <td class="v-middle">{ row.company }</td>
                                        <td class="v-middle">{ row.voucher }</td>
                                        <td class="v-middle text-center">
											<span if="{ row.voucher === 'BOLETA' || row.voucher === 'FACTURA' }">{ row.regime }</span>
											<span if="{ row.voucher !== 'BOLETA' &amp;&amp; row.voucher !== 'FACTURA' }">&mdash;</span>
										</td>
                                        <td class="v-middle text-center">{ row.serie.zeros(4) }</td>
                                        <td class="v-middle text-center">{ row.serial_number.zeros(7) }</td>
                                        <td class="v-middle text-center">
                                            <a href="#" onclick="{ parent.opts.subsidiary }">
                                                { row.subsidiary_journal || '- No definido -' }
                                            </a>
                                        </td>
                                        <td width="120ṕx" class="text-center v-middle">
                                            <a href="#/series/edit/{ row.id }">Editar</a>
                                        </td>
                                        <td width="120ṕx" class="text-center v-middle">
                                            <a href="#" onclick="{ parent.opts.delete }">Eliminar</a>
                                        </td>
                                    </tr>
                                    <tr if="{ !data.length }">
                                        <td class="text-center" colspan="8">
                                            No se encontraron registros
                                        <td>
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
        $scope.series = <?php echo json_encode($records); ?>;

        var ondelete = function (e) {
            var self = this;
            var item = e.item.row || e.item;

            if (item.voucher === 'TICKET' && item.sale_point_name) { // Vinculado a una ticketera/punto de venta
                bootbox.alert({
                    title: 'No se puede eliminar',
                    message: 'El número de serie que desea eliminar está vinculado al punto de venta ' + item.sale_point_name + '.',
                    buttons: {
                        ok: {
                            label: 'Aceptar',
                            className: 'btn-primary'
                        }
                    }
                });
            } else {
                bootbox.confirm({
                    title: '¿Está seguro?',
                    message: 'Está a punto de eliminar un registro, esta acción no podrá deshacerse.',
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
                            $.post(siteUrl('series/delete'), { id: item.id }, function () {
                                var data = self.data;

                                data.splice(data.indexOf(item), 1);

                                self.unmount();

                                riot.mount('riot-table', {
                                    'data': data,
                                    'subsidiary': onsubdiary,
                                    'delete': ondelete
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
            }
        };

        var onsubdiary = function (e) {
            var self = this;
            var target = e.target;
            var item = e.item.row || e.item;

            var dialog = bootbox.prompt({
                title: 'Nuevo valor para subdiario',
                value: item.subsidiary_journal,
                size: 'small',
                show: false,
                buttons: {
                    cancel: {
                        label: 'Cancelar',
                        className: 'btn-default'
                    },
                    confirm: {
                        label: 'Aceptar',
                        className: 'btn-primary'
                    }
                },
                callback: function (result) {
                    if (result !== null) { // Si no se presionó CANCELAR
                        if (!result.length || /^\d{1,2}$/ .test(result)) {
                            $.post(siteUrl('series/update_subsidiary'), {
                                id: item.id,
                                subsidiary: result
                            }, function () {
                                item.subsidiary_journal = result;
                                self.update(); // <-- OJO: revisar si esto funciona correctamente cuando existen varios registros (con paginación)

                                $rootScope.$apply(function () {
                                   $rootScope.Session.setMessage('Se editó el subdiario correctamente', 'success', true);
                                });
                            }).fail(function (err) {
                                $rootScope.$apply(function () {
                                    $rootScope.Session.setMessage(err.statusText, 'danger', true);
                                });
                            });;
                        } else {
                            $rootScope.$apply(function () {
                                $rootScope.Session.setMessage('El valor ingresado no tiene un formato válido para subdiario', 'danger', true);
                            });
                        }
                    }
                }
            });

            dialog.on('shown.bs.modal', function (e) {
                e.target.querySelector('input[type="text"]').select();
            });

            dialog.modal('show');
        };

        var riotTable = riot.mount('riot-table', {
            'data': $scope.series,
            'subsidiary': onsubdiary,
            'delete': ondelete
        });
    });
</script>
