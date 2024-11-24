<section class="wrapper">
    <form class="m-b-lg" ng-submit="finish()" autocomplete="off" id="edit-purchase-order">
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
                    <input type="text" class="form-control" ng-model="description" ng-readonly="saving">
                </div>
            </div>

            <div class="col-md-3">
                <div class="form-group">
                    <label>Empresa</label>
                    <erp-company-chooser class="form-control" ng-model="company" ng-readonly="saving" data-show-empty="false" ng-change="changeCompany()"></erp-company-chooser>
                </div>
            </div>

            <div class="col-md-4">
                <div class="form-group">
                    <label>Proveedor</label>
                    <erp-supplier-chooser data-model="supplierId" disabled="saving" data-placeholder="- Seleccione -" data-add-button="false"></erp-supplier-chooser>
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label>Fecha de pago</label>
                    <input type="text" date-picker data-model="paymentDate" class="form-control text-center" ng-disabled="saving">
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label>Inicio de entrega</label>
                    <input type="text" date-picker data-model="startDate" class="form-control text-center" ng-disabled="saving">
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label>Fin de entrega</label>
                    <input type="text" date-picker data-model="endDate" class="form-control text-center" ng-disabled="saving">
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label>Activo</label>
                    <div>
                        <label class="switch m-b-none" ng-class="{'disabled': saving}">
                            <input type="checkbox" ng-model="active" ng-disabled="saving">
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
        <div class="col-lg-9">
            <erp-file-picker
                data-model="file"
                accept=".xlsx"
                data-label="Seleccionar archivo"
                data-on-change="changeFile"
                data-show-input="false"
                data-disabled="saving"
            ></erp-file-picker>
        </div>
        <div class="col-lg-3 text-right m-b"  ng-if="stage === 'data'">
            <button type="button" class="btn btn-default" ng-disabled="downloading" ng-click="downloadData()">Descargar</button>
        </div>
    </div>

    <div class="row" ng-if="stage === 'input' && !saving">
		<div class="col-lg-12" ng-if="sheets.length">
			<p>Hoja</p>

			<div class="col-lg-3 m-l-n">
				<select
                    ng-model="sheetSelected"
                    ng-options="sheet.text as sheet.text for sheet in sheets"
                    ng-change="$parent.changeSheet(sheetSelected)"
                    class="form-control m-b"
                    required
                >
					<option value="">- Seleccione -</option>
				</select>
			</div>
		</div>
    </div>

    <div class="row" ng-if="stage === 'loading'">
        <div class="col-lg-12 text-center">
            <div class="inline">
                <div easy-pie-chart loop="true" data-percent="0" data-line-width="10" data-track-color="#eee" data-bar-color="#1ccc88" data-scale-color="#fff" data-size="188" data-line-cap='butt'>
                    <div>
                        <span class="h3 step">Cargando</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="row" ng-if="stage === 'data'">
        <div class="col-lg-12">
            <riot-table>
    			<div class="row">
    				<div class="col-lg-12">
                        <div class="fixed-table-responsive panel panel-default">
        					<table class="table table-striped table-bordered">
        						<thead>
        							<tr>
        								<th width="60px">&nbsp;</th>
        								<th width="70px">Nro.</th>
        								<th width="150px">Código</th>
        								<th width="100px">Cantidad</th>
        								<th width="100px">Existencia</th>
        								<th width="150px">Costo en factura</th>
        								<th width="150px">Costo</th>
                                        <th width="300px">Descripción</th>
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
        								<td class="text-center v-middle">
                                            <a href="#" title="Remover" onclick="{ parent.opts.deleteItem }">
                                                <i class="glyphicon glyphicon-remove text-danger"></i>
                                            </a>
                                        </td>
        								<td class="text-center v-middle">{ /*parent.num(index)*/ row.product_detail_id }</td>
        								<td class="v-middle">
                                            <span class="{ text-danger: !row.product_id }">{ row.CODIGO }</span>
                                        </td>
        								<td class="v-middle text-center">
                                            <input type="number" min="1" class="form-control text-center" value="{ row['CANT.'] || 0 }" oninput="{ parent.opts.setQty }">
                                        </td>
        								<td class="v-middle text-center">
                                            <span if="{ !row.has_stock }">&mdash;</span>
                                            <a href="#" if="{ row.has_stock }" onclick="{ parent.opts.showStock }" class="text-u-l text-primary" title="Ver existencias">{ row.STOCK }</a>
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
                                            <span if="{ row.product_id }" class="text-muted">{ row.DESCRIPCION }</span>
                                            <input if="{ !row.product_id }" type="text" class="form-control" value="{ row.DESCRIPCION }" oninput="{ parent.opts.setDescription }">
                                        </td>
                                        <td class="v-middle">
                                            <span if="{ row.product_id }" class="text-muted">{ row.LINEA }</span>
                                            <span if="{ !row.product_id }">
                                                <a href="#" if="{ parent.opts.categories.indexOf(row.LINEA) < 0 }" onclick="{ parent.opts.editCategory }" class="text-u-l text-danger" title="Editar línea no registrada">
                                                    { row.LINEA }
                                                </a>
                                                <span if="{ parent.opts.categories.indexOf(row.LINEA) >= 0 }">
                                                    { row.LINEA }
                                                </span>
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ row.product_id }" class="text-muted">{ row.GENERO }</span>
                                            <span if="{ !row.product_id }">
                                                <a href="#" if="{ parent.opts.genders.indexOf(row.GENERO) < 0 }" onclick="{ parent.opts.editGender }" class="text-u-l text-danger" title="Editar género no registrado">
                                                    { row.GENERO }
                                                </a>
                                                <span if="{ parent.opts.genders.indexOf(row.GENERO) >= 0 }">
                                                    { row.GENERO }
                                                </span>
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ row.product_id }" class="text-muted">{ row.EDAD }</span>
                                            <span if="{ !row.product_id }">
                                                <a href="#" if="{ parent.opts.ages.indexOf(row.EDAD) < 0 }" onclick="{ parent.opts.editAge }" class="text-u-l text-danger" title="Editar edad no registrada">
                                                    { row.EDAD }
                                                </a>
                                                <span if="{ parent.opts.ages.indexOf(row.EDAD) >= 0 }">
                                                    { row.EDAD }
                                                </span>
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ row.product_id }" class="text-muted">{ row.DEPORTE }</span>
                                            <span if="{ !row.product_id }">
                                                <a href="#" if="{ parent.opts.uses.indexOf(row.DEPORTE) < 0 }" onclick="{ parent.opts.editUse }" class="text-u-l text-danger" title="Editar deporte no registrado">
                                                    { row.DEPORTE }
                                                </a>
                                                <span if="{ parent.opts.uses.indexOf(row.DEPORTE) >= 0 }">
                                                    { row.DEPORTE }
                                                </span>
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ row.product_id }" class="text-muted">{ row.MARCA }</span>
                                            <span if="{ !row.product_id }">
                                                <a href="#" if="{ parent.opts.brands.indexOf(row.MARCA) < 0 }" onclick="{ parent.opts.editBrand }" class="text-u-l text-danger" title="Editar marca no registrada">
                                                    { row.MARCA }
                                                </a>
                                                <span if="{ parent.opts.brands.indexOf(row.MARCA) >= 0 }">
                                                    { row.MARCA }
                                                </span>
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ row.product_id }" class="text-muted">{ row.TIPO }</span>
                                            <span if="{ !row.product_id }">
                                                <a href="#" if="{ parent.opts.subcategories.indexOf(row.TIPO) < 0 }" onclick="{ parent.opts.editSubcategory }" class="text-u-l text-danger" title="Editar tipo no registrado">
                                                    { row.TIPO }
                                                </a>
                                                <span if="{ parent.opts.subcategories.indexOf(row.TIPO) >= 0 }">
                                                    { row.TIPO }
                                                </span>
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <span if="{ row.product_id }" class="text-muted">{ row.REGIMEN }</span>
                                            <span if="{ !row.product_id }">{ row.REGIMEN }</span>
                                        </td>
        							</tr>
        							<tr if="{ !data.length }">
        								<td colspan="15">No se encontraron registros</td>
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
            <a href="#/purchase-orders" class="btn btn-default">Cancelar</a>
        	<button class="btn btn-primary" type="submit" form="edit-purchase-order" ng-disabled="stage !== 'data' || saving">
        	    Guardar
        	</button>
        </div>
    </div>
</section>

<script>
    angularScope(function ($scope) {
        $scope.setSingleTable('categories', '<?php echo $categories; ?>');
		$scope.setSingleTable('genders', '<?php echo $genders; ?>');
		$scope.setSingleTable('ages', '<?php echo $ages; ?>');
		$scope.setSingleTable('uses', '<?php echo $uses; ?>');
		$scope.setSingleTable('brands', '<?php echo $brands; ?>');
		$scope.setSingleTable('subcategories', '<?php echo $subcategories; ?>');

		$scope.setDetail(<?php echo json_encode($detail); ?>);
    });
</script>
