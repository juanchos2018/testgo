<section class="scrollable wrapper">
	<form class="form-horizontal" ng-submit="save()" autocomplete="off">
        <div class="form-group required">
            <label class="col-sm-3 control-label">Punto de venta</label>
            <div class="col-sm-3">
                <select class="form-control m-b-xs" ng-model="currentSalePoint" erp-focus ng-options="sp.id as sp.description for sp in salePoints" required>
					<option value="">- Seleccione -</option>
				</select>
            </div>
        </div>

        <div class="form-group" ng-if="currentSalePoint && salePoint.last_closing_cash">
            <label class="col-sm-3 control-label">Último cierre</label>
            <div class="col-sm-8">
                <p class="form-control-static m-b-sm">
                	{{ salePoint.last_closing_cash | pgDate | elapsed }}
                </p>
            </div>
        </div>

        <div class="form-group required" ng-if="currentSalePoint">
            <label class="col-sm-3 control-label">Monto inicial en caja</label>
            <div class="col-sm-2">
                <div class="input-group m-b-sm">
					<span class="input-group-addon">S/</span>
					<input type="text" class="form-control text-right" ng-readonly="salePoint.count_after_closing" ng-model="salePoint.initial_amount" pattern="\d+\.?\d*" required>
				</div>
            </div>
            <div class="col-sm-1 hidden-xs" ng-if="salePoint.count_after_closing">
            	<span class="fa fa-question-circle text-primary" title="Ha realizado {{ salePoint.count_after_closing }} venta{{ salePoint.count_after_closing > 1 ? 's' : '' }} desde el último cierre" style="font-size:1.2em; margin-top: 8px; cursor: pointer"></span>
            </div>
        </div>

        <div class="form-group required">
            <label class="col-lg-3 control-label">Tipos de cambio</label>
            <div class="col-lg-8">
                <div class="table-responsive">
	                <table class="table table-bordered table-hover bg-white">
	                    <thead>
	                        <tr>
	                            <th class="text-center">Moneda</th>
	                            <th class="text-center">Unidad</th>
	                            <th class="text-center">Valor</th>
	                            <th class="text-center">Actualizado</th>
	                        </tr>
	                    </thead>
	                    <tbody>
	                    	<tr ng-repeat="record in exchangeRates">
	                    		<td class="v-middle">
	                    			<span ng-if="record.money_abbrev === 'USD'">Dólar americano</span>
	                    			<span ng-if="record.money_abbrev === 'CLP'">Peso chileno</span>
	                    		</td>
	                    		<td class="text-center" style="width: 150px; min-width: 150px">
		                    		<div class="input-group">
		                                <input type="text" class="form-control" disabled ng-value="record.unit">
		                                <span class="input-group-addon">
		                                	{{ record.money_abbrev }}
		                                </span>
		                            </div>
	                    		</td>
	                    		<td class="text-center" style="width: 150px; min-width: 150px">
		                    		<div class="input-group">
		                                <span class="input-group-addon">S/</span>
		                                <input type="text" class="form-control text-right" ng-model="record.purchase_value" pattern="\d+\.?\d*" required>
		                            </div>
	                    		</td>
	                    		<td class="v-middle">
	                    			{{ record.updated_at | pgDate | elapsed }}
	                    		</td>
	                    	</tr>
	                    </tbody>
	                </table>
	            </div>
            </div>
        </div>

        <div class="form-group">
			<div class="col-sm-4 col-sm-offset-3">
				<button type="submit" class="btn btn-primary" ng-disabled="!currentSalePoint">Guardar</button>
				<a href="#/sales/point" ng-if="oldSalePoint" class="btn btn-default">Ir a caja</a>
			</div>
		</div>
	</form>
</section>

<script>
	angularScope(function ($scope) {
		$scope.oldSalePoint = window.localStorage.currentSalePoint || '';
		$scope.currentSalePoint = $scope.oldSalePoint;
		$scope.salePoints = <?php echo json_encode($sale_points); ?>.map(function (row) {
			row.initial_amount = parseFloat(row.initial_amount || 0).toFixed(2);
			row.count_after_closing = parseInt(row.count_after_closing);

			return row;
		});
		$scope.exchangeRates = <?php echo json_encode($exchange_rates); ?>;
	});
</script>