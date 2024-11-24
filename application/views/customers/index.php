<!-- <section class="scrollable wrapper hidden-print">
	<div class="row">

   		<div class="col-lg-7">
            <erp-customer-chooser
            	data-query-uri="customers/get_for_sale_by"
            	ng-model="customer"
                data-voucher-type="TICKET"
            ></erp-customer-chooser>
		</div>

	</div>
</div> -->
<section class="scrollable wrapper">
	<div class="row">

        <div class="col-sm-12">
            <a href="#/customers/add" class="btn btn-primary">
                <i class="fa fa-plus text"></i>
                <span class="text">&nbsp;Agregar</span>
            </a>
        </div>
        <div class="col-sm-12">
            <riot-table>
                <div class="row">
                    <div class="col-lg-3">
                      <!--   <filter key="type">
                            <select class="form-control">
                                <option value="">- Todos -</option>
                                <option value="PERSONA">Sólo personas</option>
                                <option value="EMPRESA">Sólo empresas</option>
                            </select>
                        </filter> -->
                    </div>
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
                                        <th class="text-center">DNI/RUC/RUT</th>
                                        <th class="text-center">Nombres</th>
                                        <th class="text-center">Tarjeta LFA</th>
                                        <th class="text-center">Activo</th>
                                        <th class="text-center" colspan="2">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr each="{ row, index in data }">
                                        <td width="60ṕx" class="text-center v-middle">{ parent.num(index) }</td>
                                        <td class="v-middle">{ row.id_number }</td>
                                        <td class="v-middle">{ row.full_name || '-' }</td>
                                        <td class="v-middle">{ row.barcode_inticard || '-' }</td>
                                        <td width="150px" class="text-center v-middle">
                                            <label class="switch m-b-none">
                                                <input type="checkbox"  checked="{ row.active == 't' }" onchange="{ parent.opts.activate }">
                                                <span></span>
                                            </label>
                                        </td>
                                        <td width="120px" class="text-center v-middle">
                                            <a href="#/customers/edit/{ row.id }">Editar</a>
                                        </td>
                                        <td width="120px" class="text-center v-middle">
                                            <a href="#" onclick="{ parent.opts.delete }">Eliminar</a>
                                        </td>
                                    </tr>
                                    <tr if="{ !data.length }">
                                        <td class="text-center" colspan="7">
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
	angularScope(['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {
       /* $scope.submitted = false;
        $scope.voucherType = $scope.voucherType || 'TICKET';
        
        $scope.originalLabel = '';

        $scope.id           = $scope.id         || '';
        $scope.full_name    = $scope.full_name  || '';
        $scope.id_number    = $scope.id_number  || '';
        $scope.type         = $scope.type       || '';
        $scope.address      = $scope.address    || '';
        $scope.verified     = $scope.verified   || '';
    */  
    
        /*
        $scope.find = function () {
            if ( !$scope.submitted && $scope.ngModel.full_name !== $scope.originalLabel ) {
                if ( $scope.ngModel.full_name.length ) {
                    var match = /\d+/ .exec($scope.ngModel.full_name);

                    if ( match && match.length ) {
                        var query = match[0];
                        
                        $scope.submitted = true;

                        Ajax.get(queryUrl + '/' + encodeURIComponent(query)).then(function (res) {
                            var data = res.data;

                            $scope.setValue(data);
                            $scope.submitted = false;
                        }, function () {
                            // OJO PIOJO: si se pasó un nro. de documento se podría lanzar el formulario para registrar cliente
                            $scope.clear();
                            $scope.submitted = false;
                        });
                    } else {
                        $scope.clear();
                    }
                } else {
                    $scope.clear();
                }
            }
        };*/
		var onactivate = function (e) {
            var item = e.item.row || e.item;
            
            item.active = (e.target.checked ? 't' : 'f');
            
            e.target.disabled = 'disabled';

            $.post(siteUrl('customers/activate'), { id: item.id, active: item.active }).fail(function () {
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
                message: 'Está a punto de eliminar "' + item.full_name + '", esta acción no podrá deshacerse y podría afectar a otros registros vinculados.',
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
                        $.post(siteUrl('customers/delete'), { id: item.id }, function (data) {
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
// 			'data': $scope.customers,
            'data': $window.siteUrl('customers/get_list'),
			'activate': onactivate,
			'delete': ondelete
		});
	}]);
</script>