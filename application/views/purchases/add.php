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
                        data-show-empty="true"
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
                    <label class="required">Utilidad</label>
                    <div class="input-group m-b">
                        <input type="number" ng-model="utility" min="0" max="100" class="form-control text-center" ng-disabled="saving">
                        <span class="input-group-addon">%</span>
                    </div>
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

            <div class="col-md-2">
                <div class="form-group">
                    <label class="required">Gastos</label>
                    <div class="input-group m-b">
                        <input type="text" ng-model="expenses" class="form-control text-right">
                        <span class="input-group-addon" ng-bind="currency"></span>
                    </div>
                </div>
            </div>

            <div class="col-md-2" ng-if="currency === 'USD'">
                <div class="form-group">
                    <label class="required">Tipo de cambio</label>
                    <div class="input-group m-b">
                        <span class="input-group-addon">S/</span>
                        <input type="text" erp-number-input data-model="$parent.exchangeRate" class="form-control text-right" ng-disabled="saving">
                    </div>
                </div>
            </div>

            <div class="col-md-2" ng-class="{ 'col-md-offset-2': currency === 'PEN' }">
                <div class="form-group">
                    <label>Total de compra</label>
                    <div class="input-group m-b">
                        <span class="input-group-addon">{{ currency === 'USD' ? '$' : 'S/' }}</span>
                        <input type="text" class="form-control text-right" readonly ng-value="getPurchaseTotal() | number : 2">
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="checkbox i-checks">
                    <label>
                        <input type="checkbox" ng-model="calculatePrices">
                        <i></i>
                        Calcular automáticamente los precios
                    </label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12">
                <div class="checkbox i-checks">
                    <label>
                        <input type="checkbox" ng-model="consigned">
                        <i></i>
                        Es una compra consignada
                    </label>
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
            ></erp-file-picker>
        </div>
        <div class="col-lg-3 text-right" ng-if="stage === 'data'">
            <button type="button" class="btn btn-default" ng-disabled="downloading" ng-click="downloadData()">Descargar</button>
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
        								<th width="60px">&nbsp;</th>
        								<th width="70px">Nro.</th>
        								<th width="150px">Código</th>
        								<th width="120px">Talla</th>
        								<th width="100px">Cantidad</th>
        								<th width="150px">C.U. en factura</th>
        								<th width="150px">Gasto unitario</th>
                                        <th width="100px">Existencia</th>
        								<th width="150px">Costo anterior</th>
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
                                            <a href="#" title="Remover" onclick="{ parent.opts.deleteItem }">
                                                <i class="glyphicon glyphicon-remove text-danger"></i>
                                            </a>
                                        </td>
        								<td class="text-center v-middle">
                                            { parent.num(index) }
                                        </td>
        								<td class="v-middle">
                                            <span class="{ text-danger: !row.product_id }">
                                                { row.CODIGO }
                                            </span>
                                        </td>
                                        <td class="v-middle">
                                            <span if="{ row.product_barcode_id }" class="text-muted">
                                                { row.TALLA }
                                            </span>
                                            <span if="{ !row.product_barcode_id }">
                                                <a href="#" if="{ parent.opts.sizes.indexOf(row.TALLA) < 0 }" onclick="{ parent.opts.editSize }" class="text-u-l text-danger" title="Editar talla no registrada">
                                                    { row.TALLA }
                                                </a>
                                                <span if="{ parent.opts.sizes.indexOf(row.TALLA) >= 0 }">
                                                    { row.TALLA }
                                                </span>
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <input
                                                type="number"
                                                min="1"
                                                class="form-control text-center"
                                                value="{ row['CANT.'] || 0 }"
                                                oninput="{ parent.opts.setQty }"
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
                                                    oninput="{ parent.opts.setInvoiceCost }"
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
                                                    value="{ parent.opts.getUnitExpenditure().toFixed(2) }"
                                                    readonly
                                                >
                                            </div>
                                        </td>
                                        <td class="v-middle text-center">
                                            <span if="{ !row.stock_id }">&mdash;</span>
                                            <span if="{ row.stock_id }">{ row.STOCK }</span>
                                        </td>
                                        <td class="v-middle">
                                           <div if="{ !row.product_detail_id }" class="text-center">
                                               &mdash;
                                           </div>
                                           <div if="{ row.product_detail_id }" class="input-group m-b">
                                               <span class="input-group-addon">{ row.MONEDA_COSTO }</span>
                                               <input
                                                    type="text"
                                                    readonly
                                                    class="form-control text-right"
                                                    value="{ row.COSTO.toFixed(2) }"
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
                                                    value="{ parent.opts.getCost(this).toFixed(2) }"
                                                >
                                           </div>
                                        </td>
                                        <td class="v-middle">
                                           <div class="input-group m-b">
                                               <span class="input-group-addon">S/</span>
                                               <input
                                                    type="text"
                                                    readonly="{ parent.opts.calculatePrices }"
                                                    class="form-control text-right"
                                                    value="{ parent.opts.getPrice(this).toFixed(2) }"
                                                    onblur="{ parent.opts.setPrice }"
                                                >
                                           </div>
                                        </td>
                                        <td class="v-middle">
                                           <div class="input-group m-b">
                                               <span class="input-group-addon">S/</span>
                                               <input
                                                    type="text"
                                                    readonly="{ parent.opts.calculatePrices }"
                                                    class="form-control text-right"
                                                    value="{ parent.opts.getOfferPrice(this).toFixed(2) }"
                                                    onblur="{ parent.opts.setOfferPrice }"
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
                                            <span if="{ row.product_id }">
                                                { row.DESCRIPCION }
                                            </span>
                                            <input
                                                if="{ !row.product_id }"
                                                type="text"
                                                class="form-control"
                                                value="{ row.DESCRIPCION }"
                                                oninput="{ parent.opts.setDescription }"
                                            >
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
        								<td class="v-middle">
                                            <a href="#" if="{ row.LINEA.length &amp;&amp; parent.opts.categories.indexOf(row.LINEA.toUpperCase()) < 0 }" onclick="{ parent.opts.editCategory }" class="text-u-l text-danger" title="Editar línea no registrada">
                                                { row.LINEA }
                                            </a>
                                            <span if="{ !row.LINEA.length || parent.opts.categories.indexOf(row.LINEA.toUpperCase()) >= 0 }">
                                                { row.LINEA }
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <a href="#" if="{ row.GENERO.length &amp;&amp; parent.opts.genders.indexOf(row.GENERO.toUpperCase()) < 0 }" onclick="{ parent.opts.editGender }" class="text-u-l text-danger" title="Editar género no registrado">
                                                { row.GENERO }
                                            </a>
                                            <span if="{ !row.GENERO.length || parent.opts.genders.indexOf(row.GENERO.toUpperCase()) >= 0 }">
                                                { row.GENERO }
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <a href="#" if="{ row.EDAD.length &amp;&amp; parent.opts.ages.indexOf(row.EDAD.toUpperCase()) < 0 }" onclick="{ parent.opts.editAge }" class="text-u-l text-danger" title="Editar edad no registrada">
                                                { row.EDAD }
                                            </a>
                                            <span if="{ !row.EDAD.length || parent.opts.ages.indexOf(row.EDAD.toUpperCase()) >= 0 }">
                                                { row.EDAD }
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <a href="#" if="{ row.DEPORTE.length &amp;&amp; parent.opts.uses.indexOf(row.DEPORTE.toUpperCase()) < 0 }" onclick="{ parent.opts.editUse }" class="text-u-l text-danger" title="Editar deporte no registrado">
                                                { row.DEPORTE }
                                            </a>
                                            <span if="{ !row.DEPORTE.length || parent.opts.uses.indexOf(row.DEPORTE.toUpperCase()) >= 0 }">
                                                { row.DEPORTE }
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <a href="#" if="{ row.MARCA.length &amp;&amp; parent.opts.brands.indexOf(row.MARCA.toUpperCase()) < 0 }" onclick="{ parent.opts.editBrand }" class="text-u-l text-danger" title="Editar marca no registrada">
                                                { row.MARCA }
                                            </a>
                                            <span if="{ !row.MARCA.length || parent.opts.brands.indexOf(row.MARCA.toUpperCase()) >= 0 }">
                                                { row.MARCA }
                                            </span>
                                        </td>
        								<td class="v-middle">
                                            <a href="#" if="{ row.TIPO.length &amp;&amp; parent.opts.subcategories.indexOf(row.TIPO.toUpperCase()) < 0 }" onclick="{ parent.opts.editSubcategory }" class="text-u-l text-danger" title="Editar tipo no registrado">
                                                { row.TIPO }
                                            </a>
                                            <span if="{ !row.TIPO.length || parent.opts.subcategories.indexOf(row.TIPO.toUpperCase()) >= 0 }">
                                                { row.TIPO }
                                            </span>
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

		$scope.setSingleTable('categories', '<?php echo $categories; ?>');
		$scope.setSingleTable('genders', '<?php echo $genders; ?>');
		$scope.setSingleTable('ages', '<?php echo $ages; ?>');
		$scope.setSingleTable('uses', '<?php echo $uses; ?>');
		$scope.setSingleTable('brands', '<?php echo $brands; ?>');
		$scope.setSingleTable('subcategories', '<?php echo $subcategories; ?>');
		$scope.setSingleTable('sizes', '<?php echo $sizes; ?>');
	}]);
</script>
