<section class="scrollable wrapper">
	<div class="row">
        <div class="col-sm-12">
            <riot-table>
                <div class="row">
					<div class="col-sm-9">
			            <a href="#/transfers/add" class="btn btn-primary">
			                <i class="fa fa-plus text"></i>
			                <span class="text">&nbsp;Agregar</span>
			            </a>
			        </div>
                    <div class="col-lg-3">
                        <searchbox input_class="form-control" placeholder="Filtrar..."></searchbox>
                    </div>
                </div>
                <div class="row m-t">
                    <div class="col-lg-12">
                        <div class="fixed-table-responsive">
                            <table class="table table-bordered table-hover bg-white">
                                <thead>
                                    <tr>
                                        <th width="60px" class="text-cente v-middle">N°</th>
                                        <th width="100px" class="text-center v-middle">Código</th>
                                        <th width="90px" class="text-center">Fecha Traslado</th>
                                        <th class="text-center v-middle">Origen</th>
                                        <th class="text-center v-middle">Destino</th>
										<th width="180px" class="text-center v-middle">Motivo</th>
										<th width="80px" class="text-center v-middle">Cant.</th>
										<th width="70px" class="text-center v-middle">Creado Por</th>
                                        <th width="100px" class="text-center v-middle">Estado</th>
                                        <th width="400px" class="text-center v-middle">Guías</th>
                                        <!-- <th class="text-center" if="{ data.length }" colspan="2">Acciones</th> -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr each="{ row, index in data }">
                                        <td width="60px" class="text-center v-middle">{ index + 1 }</td>
                                        <td width="100px" class="v-middle">
											<a href="#/transfers/detail/{ row.id }">{ row.code }</a>
										</td>
                                        <td class="v-middle">{ moment(row.transfer_date).format('DD/MM/YY') }</td>
                                        <td class="v-middle">{ row.company_origin + ' - ' + row.branch_origin }</td>
                                        <td class="v-middle">{ row.company_target + ' - ' + row.branch_target }</td>
										<td width="180px" class="v-middle">{ row.reason }</td>
                                       	<td width="80px" class="text-center v-middle"><span class="badge bg-success">{ row.total_qty }</span></td>
										<td class="v-middle">{ row.registered_by }</td>
                                        <td class="v-middle">{ row.state }</td>
                                        <td class="v-middle overflow-show">{ row.guides }</td>
                                       <!--  <td width="70px" class="text-center v-middle">
                                            <a href="#/transfers/edit/{ row.id }">Editar</a>
                                        </td>
                                        <td width="70px" class="text-center v-middle">
                                            <a href="#" onclick="{ parent.opts.delete }">Eliminar</a>
                                        </td> -->
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
    angularScope(['$scope', '$rootScope', '$location', function ($scope, $rootScope, $location) {
        $scope.records = <?php echo json_encode($records); ?>;

        riot.mount('riot-table', {
            data: $scope.records,
			onupdate: function () {
				$(this.root).find('[data-placement]').tooltip();
			},
			delete: function (e) {
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
	                        $.post(siteUrl('transfers/delete'), { id: item.id }, function (res) {
	                            if ('ok' in res) {
	                                $rootScope.$apply(function () {
										$scope.records.splice($scope.records.indexOf(item), 1);

										self.parent.update({
											data: $scope.records
										});

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
			}
        });
    }]);
</script>
