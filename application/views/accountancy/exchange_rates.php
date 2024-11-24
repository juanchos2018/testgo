<section class="scrollable wrapper">
	<div class="row">

        <div class="col-sm-12">
            <div class="table-responsive">
                <table class="table table-bordered table-hover bg-white">
                    <thead>
                        <tr>
                            <th class="text-center">Moneda</th>
                            <th class="text-center">Unidad</th>
                            <th class="text-center">Valor de compra</th>
                            <th class="text-center">Valor de venta</th>
                            <th class="text-center">Actualizado</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                    	<tr ng-repeat="record in records">
                    		<td class="v-middle">
                    			<span ng-if="record.money_abbrev === 'USD'">Dólar americano</span>
                    			<span ng-if="record.money_abbrev === 'CLP'">Peso chileno</span>
                    		</td>
                    		<td class="text-center" style="width: 180px; min-width: 150px">
	                    		<div class="input-group">
	                                <input type="text" class="form-control" readonly ng-value="record.unit">
	                                <span class="input-group-addon">
	                                	{{ record.money_abbrev }}
	                                </span>
	                            </div>
                    		</td>
                    		<td class="text-center" style="width: 180px; min-width: 150px">
	                    		<div class="input-group">
	                                <input type="text" name="purchase" class="form-control" ng-value="record.purchase_value" readonly>
	                                <span class="input-group-addon">PEN</span>
	                            </div>
                    		</td>
                    		<td class="text-center" style="width: 180px; min-width: 150px">
	                    		<div class="input-group">
	                                <input type="text" name="sale" class="form-control" ng-value="record.sale_value" readonly>
	                                <span class="input-group-addon">PEN</span>
	                            </div>
                    		</td>
                    		<td class="v-middle">
                    			{{ record.updated_at | pgDate | elapsed }}
                    		</td>
                    		<td class="v-middle text-center" style="width: 150px">
                    			<a ng-href="#/accountancy/edit_exchange_rate/{{ record.money_abbrev }}">
                    				Editar
                    			</a>
                    		</td>
                    	</tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<script>
	angularScope(function ($scope) {
		$scope.records = <?php echo json_encode($records); ?>;
	});
</script>