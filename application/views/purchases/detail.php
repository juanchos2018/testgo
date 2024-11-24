<section class="wrapper">
    <form class="m-b-lg">
        <div class="row">
            <div class="col-sm-3 col-md-2">
                <div class="form-group">
                    <label>Código</label>
                    <input type="text" class="form-control" disabled ng-model="code">
                </div>
            </div>

            <div class="col-sm-9 col-md-7">
                <div class="form-group">
                    <label>Descripción</label>
                    <input type="text" class="form-control" ng-model="description" disabled>
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label>Empresa</label>
                    <erp-company-chooser class="form-control" ng-model="company" disabled data-show-empty="false"></erp-company-chooser>
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <label>Proveedor</label>
                    <erp-supplier-chooser data-model="supplierId" disabled="true" data-placeholder="- Seleccione -" data-add-button="false"></erp-supplier-chooser>
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label>Fecha de registro</label>
                    <input type="text" ng-model="registerDate" class="form-control text-center" disabled>
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label>Inicio de entrega</label>
                    <input type="text" ng-model="startDate" class="form-control text-center" disabled>
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label>Fin de entrega</label>
                    <input type="text" ng-model="endDate" class="form-control text-center" disabled>
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label>Activo</label>
                    <div>
                        <label class="switch m-b-none disabled">
                            <input type="checkbox" ng-model="active" disabled>
                            <span></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
	</form>

	<h4>
        Productos
        <small ng-if="data.length" ng-bind="'(' + data.length + ')'"></small>
    </h4>

    <div class="row">
        <div class="col-lg-12 text-right m-b">
            <button type="button" class="btn btn-default" ng-disabled="downloading" ng-click="downloadData()">Descargar</button>
        </div>
    </div>

    <div class="row" ng-if="data.length">
        <div class="col-lg-12">
            <riot-table>
    			<div class="row">
    				<div class="col-lg-12">
                        <div class="fixed-table-responsive panel panel-default">
        					<table class="table table-striped table-bordered">
        						<thead>
        							<tr>
        								<th width="70px">Nro.</th>
        								<th width="150px">Código</th>
        								<th width="100px">Talla</th>
        								<th width="100px">Cantidad</th>
        								<th width="100px">Existencia</th>
        								<th width="150px">Costo en factura</th>
        								<th width="150px">Costo</th>
                                        <th width="150px">PVP</th>
                                        <th width="150px">P Oferta</th>
                                        <th width="300px">Descripción</th>
                                        <th width="300px">Codigo de Barras</th>
        								<th width="150px">Línea</th>
        								<th width="150px">Género</th>
        								<th width="150px">Edad</th>
        								<th width="150px">Deporte</th>
        								<th width="150px">Marca</th>
        								<th width="150px">Tipo</th>
        								<th width="150px">Régimen</th>
        							</tr>
        						</thead>
        						<tbody>
        							<tr each="{ row, index in data }">
        								<td class="text-center v-middle">{ parent.num(index) }</td>
        								<td class="v-middle">
                                            { row.CODIGO }
                                        </td>
        								<td class="v-middle text-center">
                                            <strong>{ row.TALLA || 0 }</strong>
                                        </td>
        								<td class="v-middle text-center">
                                            <span class="text-primary">{ row['CANT.'] || 0 }</span>
                                        </td>
        								<td class="v-middle text-center">
                                            <span if="{ !row.has_stock }">&mdash;</span>
                                            <span if="{ row.has_stock }">{ row.STOCK }</span>
                                        </td>
        								<td class="v-middle">
                                            <div if="{ !row.product_detail_id }" class="text-center">&mdash;</div>
                                            <div if="{ row.product_detail_id }" class="input-group">
                                                <span class="input-group-addon">S/</span>
                                                <input type="text" readonly class="form-control text-right" value="{ row.COSTO_FACTURA.toFixed(2) }">
                                            </div>
                                        </td>
        								<td class="v-middle">
                                            <div if="{ !row.product_detail_id }" class="text-center">&mdash;</div>
                                            <div if="{ row.product_detail_id }" class="input-group">
                                                <span class="input-group-addon">S/</span>
                                                <input type="text" readonly class="form-control text-right" value="{ row.COSTO.toFixed(2) }">
                                            </div>
                                        </td>
                                        <td class="v-middle">
                                            <div if="{ !row.product_detail_id }" class="text-center">&mdash;</div>
                                            <div if="{ row.product_detail_id }" class="input-group">
                                                <span class="input-group-addon">S/</span>
                                                <input type="text" readonly class="form-control text-right" value="{ row.PVP.toFixed(2) }">
                                            </div>
                                        </td>
                                        <td class="v-middle">
                                            <div if="{ !row.product_detail_id }" class="text-center">&mdash;</div>
                                            <div if="{ row.product_detail_id }" class="input-group">
                                                <span class="input-group-addon">S/</span>
                                                <input type="text" readonly class="form-control text-right" value="{ row.POFERTA.toFixed(2) }">
                                            </div>
                                        </td>
                                        <td class="v-middle">
                                            <span if="{ !row.DESCRIPCION }">&mdash;</span>
                                            <span if="{ row.DESCRIPCION }">{ row.DESCRIPCION }</span>
                                        </td>
                                        <td class="v-middle">
                                            <span if="{ !row.CODIGO_DE_BARRA }">&mdash;</span>
                                            <span if="{ row.CODIGO_DE_BARRA }">{ row.CODIGO_DE_BARRA }</span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ !row.LINEA }">&mdash;</span>
                                            <span if="{ row.LINEA }">{ row.LINEA }</span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ !row.GENERO }">&mdash;</span>
                                            <span if="{ row.GENERO }">{ row.GENERO }</span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ !row.EDAD }">&mdash;</span>
                                            <span if="{ row.EDAD }">{ row.EDAD }</span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ !row.DEPORTE }">&mdash;</span>
                                            <span if="{ row.DEPORTE }">{ row.DEPORTE }</span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ !row.MARCA }">&mdash;</span>
                                            <span if="{ row.MARCA }">{ row.MARCA }</span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ !row.TIPO }">&mdash;</span>
                                            <span if="{ row.TIPO }">{ row.TIPO }</span>
                                        </td>
        								<td class="v-middle">
                                            { row.REGIMEN }
                                        </td>
        							</tr>
        							<tr if="{ !data.length }">
        								<td colspan="14">No se encontraron registros</td>
        							</tr>
        						</tbody>
        					</table>
                        </div>
    				</div>
    			</div>
    			<div class="row">
    				<div class="col-md-4 m-b">
    					<searchbox input_class="form-control" placeholder="Filtrar..."></searchbox>
    				</div>
                    <div class="col-md-8 m-b">
    					<paginator button_class="btn btn-sm btn-default" active_button_class="btn btn-sm btn-primary"></paginator>
    				</div>
    			</div>
    		</riot-table>
        </div>
    </div>

    <div class="row m-t">
		<div class="col-lg-12 text-center" style="clear:both">
            <a href="#/purchases" class="btn btn-default">Cancelar</a>
            <a href="#/purchases/edit/{{ id }}" class="btn btn-default">Editar</a>
            <a href="#" class="btn btn-danger" ng-click="delete()">Eliminar</a>
        </div>
    </div>
</section>

<script>
    angularScope(function ($scope) {
		$scope.setDetail(<?php echo json_encode($detail); ?>);
    });
</script>
