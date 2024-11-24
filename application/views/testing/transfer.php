<section class="wrapper">
    <form class="m-b-lg" ng-submit="finish()" autocomplete="off" id="new-transfer">
        <div class="row">
             <div class="col-sm-3 col-md-2">
                <div class="form-group">
                    <label>Código</label>
                    <input type="text" class="form-control" readonly ng-model="code">
                </div>
            </div>
            
            <div class="col-sm-6 col-md-2">
                <div class="form-group">

                    <label ng-class="{ required: !purchaseOrder }">Origen</label>
                    <erp-company-chooser
                        class="form-control"
                        required
                        readonly
                        ng-model="companyOrigin"
                        ng-disabled="!superAdmin || saving"
                        data-show-empty="true"
                        data-select-first
                        ng-change="changeCompany()"
                    ></erp-company-chooser>

                    <label class="required">Sucursal</label>
                    <erp-branch-chooser
                        class="form-control"
                        required
                        readonly
                        ng-model="branchOrigin"
                        ng-disabled="!superAdmin || saving"
                        data-show-empty="true"
                        data-select-first
                        ng-change="changeCompany()"
                    ></erp-branch-chooser>
                </div>
            </div>

            <div class="col-sm-6 col-md-2">
                <div class="form-group">
                    <label class="required">Destino</label>
                    <erp-company-chooser
                        class="form-control"
                        required
                        ng-model="companyTarget"
                        ng-disabled="purchaseOrder || saving"
                        data-show-empty="true"
                        data-select-first
                        ng-change="changeCompany()"
                    ></erp-company-chooser>
                    <label ng-class="{ required: !purchaseOrder }">Sucursal</label>
                    <erp-branch-chooser
                        class="form-control"
                        required
                        ng-model="branchTarget"
                        ng-disabled="!companyTarget || saving"
                        data-show-empty="true"
                        data-select-first
                        ng-change="changeCompany()"
                    ></erp-branch-chooser>
                </div>
            </div>

            <div class="col-md-2">
                <div class="form-group">
                    <label class="required">Fecha de traslado</label>
                    <input type="text" date-picker data-model="transferDate" class="form-control text-center" ng-disabled="saving">
                </div>
            </div>

            <div class="col-sm-6 col-md-3">
                <div class="form-group">
                    <label class="required">Motivo</label>
                    <erp-shuttle-reasons-chooser
                        required="true"
                        data-model="shuttleReasonId"
                        disabled="saving"
                        data-placeholder="- Seleccione -"
                    ></erp-shuttle-reasons-chooser>
                </div>
            </div>

            <div class="col-md-2 col-md-offset-9">
                <div class="form-group">
                    <label>Total Articulos</label>
                    <div class="input-group m-b">
                        <input type="text" class="form-control text-right" readonly ng-value="getTransferQty() | number">
                        <span class="input-group-addon">Unid.</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <div class="checkbox i-checks">
                    <label>
                        <input type="checkbox" ng-model="confirmed">
                        <i></i>
                        Es una traslado confirmado
                    </label>
                </div>
            </div>
        </div>
    </form>

    <h4>
        Detalle Transferencia
       
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
        								<th width="120px">Código</th>
        								<th width="80px">Talla</th>
        								<th width="100px">Cantidad</th>
        							    <th width="80px">Stock Origen</th>
                                        <th width="80px">Stock Destino</th>
        								<th width="150px">Guia Remisión</th>
        								<th width="120px">Fecha de guia</th>
                                        <th width="300px">Descripción</th>
                                        <th width="180px">Cód. de barras</th>
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
        								<td class="v-middle ">
                                            <input 
                                            type="number"
                                            min="1" max="{ row.STOCK_O }"
                                            class="form-control text-center"
                                            value="{ row['CANT.'] || 0 }"
                                            oninput="{ parent.opts.setQty }"
                                            >
                                        </td>
                                        <td class="v-middle text-center">
                                            <span if="{ !row.stock_origin_id }">&mdash;</span>
                                            <span if="{ row.stock_origin_id }">{ row.STOCK_O }</span>
                                        </td>
                                        <td class="v-middle text-center">
                                            <span if="{ !row.stock_target_id }">&mdash;</span>
                                            <span if="{ row.stock_target_id }">{ row.STOCK_T }</span>
                                        </td>
                                        <td class="v-middle text-center">
                                            N° { row['N° GUIA'] }
                                        </td>
                                        <td class="v-middle text-center">
                                            { row['FECHA DE GUIA'] }
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
            <a href="#/transfers" class="btn btn-default">Cancelar</a>
        	<button class="btn btn-primary" type="submit" form="new-transfer">
        	    Guardar
        	</button>
        </div>
    </div>
</section>

<script>
	/* global angularScope */

	angularScope(['$scope', function ($scope) {
        $scope.setCode('<?php echo $next_id; ?>');
        $scope.setSingleTable('sizes', '<?php echo $sizes; ?>');
	}]);
</script>
