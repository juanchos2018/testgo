<section class="scrollable wrapper">
	<div class="row">
        <div class="col-sm-12">
            <riot-table>
                <div class="row">
					<div class="col-sm-9">
			            <a href="#/purchases/add" class="btn btn-primary">
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
                                        <th width="80px" class="text-center">Código</th>
                                        <th width="80px" class="text-center">Pedido</th>
                                        <th width="250px" class="text-center">Proveedor</th>
                                        <th width="80px" class="text-center">Empresa</th>
                                        <th width="80px" class="text-center">Fecha</th>
                                        <th width="220px" class="text-center">Fecha Reg.</th>
										<th width="70px" class="text-center">Cant de Articulos</th>
										<th width="80px" class="text-center">Costo</th>
                                        <th width="80px" class="text-center">Valor</th>
                                        <th width="270px" class="text-center">Facturas</th>
                                        <!-- <th class="text-center" if="{ data.length }" colspan="2">Acciones</th> -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr each="{ row, index in data }">
                                        <td width="60px" class="text-center v-middle">{ index + 1 }</td>
                                        <td width="80px" class="v-middle">
											<a href="#/purchases/detail/{ row.id }">{ row.code }</a>
										</td>
                                        <td width="80px" class="v-middle">
                                            <a href="#/purchase-orders/detail/{ row.purchase_order_id }">{ row.purchase_order }</a>
                                        </td>
                                        <td class="v-middle">{ row.supplier }</td>
										<td width="80px" class="v-middle">{ row.company }</td>
                                        <td width="80px" class="v-middle">{ moment(row.date).format('DD/MM/YY') }</td>
                                        <td width="220px" class="v-middle">{ moment(row.registered_at).format('Do MMMM YYYY, h:mm:ss a') }</td>
										<td width="70px" class="text-center v-middle">{ row.quantity }</td>
										<td width="80px" class="text-right v-middle">{ parseFloat(row.total_cost).toFixed(2)  }</td>
                                        <td width="80px" class="text-right v-middle">{ row.total_value}</td>
                                        <td width="270px" class="text-right v-middle overflow-show">{ row.invoices }</td>
                                        <!-- <td width="90px" class="text-center v-middle">
                                            <a href="#/purchases/edit/{ row.id }">Editar</a>
                                        </td>
                                        <td width="90px" class="text-center v-middle">
                                            <a href="#" onclick="{ parent.opts.delete }">Eliminar</a>
                                        </td> -->
                                    </tr>
                                    <tr if="{ !data.length }">
                                        <td class="text-center" colspan="8">
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
	                message: 'Está a punto de eliminar "' + item.code + '", esta acción no podrá deshacerse y podría afectar a otros registros vinculados.',
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
	                        $.post(siteUrl('purchases/delete'), { id: item.id }, function (res) {
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
