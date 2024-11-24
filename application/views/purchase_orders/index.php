<section class="scrollable wrapper">
	<div class="row">
        <div class="col-sm-12">
            <riot-table>
                <div class="row">
					<div class="col-sm-9">
			            <a href="#/purchase-orders/add" class="btn btn-primary">
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
                                        <th width="60px" class="text-center">N°</th>
                                        <th width="120px" class="text-center">Código</th>
                                        <th width="220px" class="text-center">Descripción</th>
										<th width="220px" class="text-center">Proveedor</th>
										<th width="100px" class="text-center">Empresa</th>
										<th width="120px" class="text-center">Llegada</th>
                                        <th width="120px" class="text-center">Activo</th>
                                        <th class="text-center" if="{ data.length }" colspan="2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr each="{ row, index in data }">
                                        <td width="60px" class="text-center v-middle">{ index + 1 }</td>
                                        <td width="120px" class="v-middle">
											<a href="#/purchase-orders/detail/{ row.id }">{ row.code }</a>
										</td>
                                        <td class="v-middle">{ row.description }</td>
										<td width="220px" class="v-middle">{ row.supplier }</td>
										<td width="100px" class="v-middle">{ row.company }</td>
										<td width="120px" class="v-middle">
											<div class="progress progress-sm progress-striped m-b-none" title="{ row.arrived_quantity }/{ row.quantity }" data-placement="top">
                          						<div class="{ progress-bar: true, bg-danger: row.arrived_quantity/row.quantity < 0.5, bg-success: row.arrived_quantity/row.quantity >= 0.5 }" style="width: { Math.min(row.arrived_quantity/row.quantity || 0, 1) * 100 }%"></div>
											</div>
										</td>
                                        <td width="120px" class="text-center v-middle">
											<riot-active-switch value="{ row.active }" target="purchase_orders" reference="{ row.id }">
											</riot-active-switch>
                                        </td>
                                        <td width="40px" class="text-center v-middle">
                                            <a href="#/purchase-orders/edit/{ row.id }">Editar</a>
                                        </td>
                                        <td width="40px" class="text-center v-middle">
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
	                        $.post(siteUrl('purchase_orders/delete'), { id: item.id }, function (res) {
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
