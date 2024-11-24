<section class="wrapper">
    <form class="m-b-lg" ng-submit="finish()" autocomplete="off" id="new-purchase">
        <div class="row">
             <div class="col-sm-3 col-md-2">
                <div class="form-group">
                    <label>Código</label>
                    <input type="text" class="form-control" readonly ng-model="code">
                </div>
            </div>
            <div class="col-md-5">
                <div class="form-group">
                    <label>Pedido</label>
                    <select select2="purchaseOrderSelect2" ng-model="purchaseOrder" class="form-control">
						<option value=""></option>
					</select>
                </div>
            </div>

            <div class="col-sm-6 col-md-2">
                <div class="form-group">
                    <label ng-class="{ required: !purchaseOrder }">Empresa</label>
                    <erp-company-chooser
                        class="form-control"
                        required
                        ng-model="company"
                        ng-disabled="purchaseOrder || saving"
                        data-show-empty="false"
                        data-select-first
                        ng-change="changeCompany()"
                    ></erp-company-chooser>
                </div>
            </div>

            <div class="col-sm-6 col-md-3">
                <div class="form-group">
                    <label ng-class="{ required: !purchaseOrder }">Proveedor</label>
                    <erp-supplier-chooser
                        required="true"
                        data-model="supplierId"
                        disabled="purchaseOrder || saving"
                        data-placeholder="- Seleccione -"
                    ></erp-supplier-chooser>
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label class="required">Fecha de ingreso</label>
                    <input type="text" date-picker data-model="inputDate" class="form-control text-center" ng-disabled="saving">
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label class="required">Moneda en factura</label>
                    <select ng-model="currency" class="form-control" ng-disabled="data.length || saving">
                        <option value="PEN">Soles</option>
                        <option value="USD">Dólares americanos</option>
                    </select>
                </div>
            </div>

            <div class="col-md-2 col-md-offset-6">
                <div class="form-group">
                    <label>Total de compra</label>
                    <div class="input-group m-b">
                        <span class="input-group-addon">{{ currency === 'USD' ? '$' : 'S/' }}</span>
                        <input type="text" class="form-control text-right" readonly ng-value="getPurchaseTotal() | number : 2">
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
        <div class="col-lg-12">
            <erp-file-picker
            data-model="file"
            accept=".xlsx"
            data-label="Seleccionar archivo"
            data-on-change="changeFile"
            data-show-input="false"
            ></erp-file-picker>
        </div>
    </div>

	<div class="row" ng-if="stage === 'input'">
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

    <div class="row" ng-if="stage === 'data'" data-stage="data">
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
        								<th width="120px">Talla</th>
        								<th width="100px">Cantidad</th>
        								<th width="150px">C.U. en factura</th>
        								<th width="150px">Gasto unitario</th>
        								<th width="150px">Costo</th>
        								<th width="150px">Precio al público</th>
        								<th width="150px">Precio de oferta</th>
        								<th width="150px">Factura</th>
        								<th width="150px">Fecha de factura</th>
                                        <th width="300px">Descripción</th>
                                        <th width="180px">Cód. de barras</th>
                                        <th width="150px">Régimen</th>
        								<th width="180px">D. Salida</th>
        								<th width="150px">Línea</th>
        								<th width="150px">Género</th>
        								<th width="150px">Edad</th>
        								<th width="150px">Deporte</th>
        								<th width="150px">Marca</th>
        								<th width="150px">Tipo</th>
        							</tr>
        						</thead>
        						<tbody>
        							<tr each="{ row, index in data }">
        								<td class="text-center v-middle">
                                            { parent.num(index) }
                                        </td>
        								<td class="v-middle">
                                            <span class="{ text-danger: !row.product_id }">
                                                { row.CODIGO }
                                            </span>
                                        </td>
                                        <td class="v-middle">
                                            { row.TALLA }
                                        </td>
        								<td class="v-middle">
                                            <input
                                                type="number"
                                                min="1"
                                                class="form-control text-center"
                                                value="{ row['CANT.'] || 0 }"
                                                readonly
                                            >
                                        </td>
                                        <td class="v-middle text-right">
                                            <div class="input-group m-b">
                                                <span class="input-group-addon">
                                                    { parent.opts.getCurrencyAlias() }
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control text-right"
                                                    value="{ row['C.U. EN FACTURA'] || 0 }"
                                                    readonly
                                                >
                                            </div>
                                        </td>
                                        <td class="v-middle text-right">
                                            <div class="input-group m-b">
                                                <span class="input-group-addon">
                                                    { parent.opts.getCurrencyAlias() }
                                                </span>
                                                <input
                                                    type="text"
                                                    class="form-control text-right"
                                                    value="{ row['GASTO UNITARIO'] || 0 }"
                                                    readonly
                                                >
                                            </div>
                                        </td>
                                        <td class="v-middle">
                                           <div class="input-group m-b">
                                               <span class="input-group-addon">{ parent.opts.getCurrencyAlias() }</span>
                                               <input
                                                    type="text"
                                                    readonly
                                                    class="form-control text-right"
                                                    value="{ row.COSTO }"
                                                >
                                           </div>
                                        </td>
                                        <td class="v-middle">
                                           <div class="input-group m-b">
                                               <span class="input-group-addon">S/</span>
                                               <input
                                                    type="text"
                                                    readonly
                                                    class="form-control text-right"
                                                    value="{ row.PVP }"
                                                >
                                           </div>
                                        </td>
                                        <td class="v-middle">
                                           <div class="input-group m-b">
                                               <span class="input-group-addon">S/</span>
                                               <input
                                                    type="text"
                                                    readonly
                                                    class="form-control text-right"
                                                    value="{ row['P. OFERTA'] }"
                                                >
                                           </div>
                                        </td>
                                        <td class="v-middle text-center">
                                            N° { row['N° FACTURA'] }
                                        </td>
                                        <td class="v-middle text-center">
                                            { row['FECHA DE FACTURA'] }
                                        </td>
                                        <td class="v-middle">
                                            { row.DESCRIPCION }
                                        </td>
                                        <td class="v-middle">
                                            { row['COD. DE BARRAS'] }
                                        </td>
        								<td class="v-middle">
                                            { row.REGIMEN }
                                        </td>
                                        <td class="v-middle">
                                            { row['D. SALIDA'] }
                                        </td>
        								<td class="v-middle text-muted">
                                            { row.LINEA }
                                        </td>
        								<td class="v-middle text-muted">
                                            { row.GENERO }
                                        </td>
        								<td class="v-middle text-muted">
                                            { row.EDAD }
                                        </td>
        								<td class="v-middle text-muted">
                                            { row.DEPORTE }
                                        </td>
        								<td class="v-middle text-muted">
                                            { row.MARCA }
                                        </td>
        								<td class="v-middle text-muted">
                                            { row.TIPO }
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
        	<button class="btn btn-primary" type="submit" ng-disabled="stage !== 'data'" form="new-purchase">
        	    Guardar
        	</button>
        </div>
    </div>
</section>

<script>
	/* global angularScope */

	angularScope(['$scope', function ($scope) {
        $scope.setCode('<?php echo $next_id; ?>');
		$scope.purchaseOrderSelect2.data = <?php echo json_encode($purchase_orders); ?>;
	}]);
</script>
