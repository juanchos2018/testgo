<section class="scrollable wrapper">
	
	<form class="form-horizontal" ng-submit="update()" autocomplete="off">
		<div class="row">

			<div class="col-sm-6">
		        <div class="form-group">
		            <label class="col-sm-4 control-label">Moneda</label>
		            <div class="col-sm-8">
		                <p class="form-control-static" ng-if="record.money_abbrev === 'USD'">
		                	DOLAR AMERICANO
		                </p>
		                <p class="form-control-static" ng-if="record.money_abbrev === 'CLP'">
		                	PESO CHILENO
		                </p>
		            </div>
		        </div>
			</div>

			<div class="col-sm-6">
		        <div class="form-group">
		            <label class="col-sm-4 control-label">Actualizado en</label>
		            <div class="col-sm-8">
		                <p class="form-control-static">
		                	{{ record.updated_at | pgDate | date : 'dd-MMM-yyyy' }}
		                </p>
		            </div>
		        </div>
			</div>

			<div class="col-sm-6">
		        <div class="form-group">
		            <label class="col-sm-4 control-label">Unidad de cambio</label>
		            <div class="col-sm-4">
		                <div class="input-group">
                            <input type="text" class="form-control" ng-value="record.unit" readonly>
                            <span class="input-group-addon">{{ record.money_abbrev }}</span>
                        </div>
		            </div>
		        </div>
			</div>

		</div>

		<div class="row">

			<div class="col-sm-6">
		        <div class="form-group">
		            <label class="col-sm-4 control-label">Valor de compra</label>
		            <div class="col-sm-4">
		                <div class="input-group">
                            <input type="text" class="form-control" ng-model="record.purchase_value">
                            <span class="input-group-addon">PEN</span>
                        </div>
		            </div>
		        </div>
			</div>

			<div class="col-sm-6">
		        <div class="form-group">
		            <label class="col-sm-4 control-label">Valor de venta</label>
		            <div class="col-sm-4">
		                <div class="input-group">
                            <input type="text" class="form-control" ng-model="record.sale_value">
                            <span class="input-group-addon">PEN</span>
                        </div>
		            </div>
		        </div>
			</div>

		</div>
		
		<div class="row m-t">

			<div class="col-lg-12 text-center">
				<a href="#/accountancy/exchange_rates" class="btn btn-default">
					Cancelar
				</a>

				<button type="submit" class="btn btn-primary">
					Guardar
				</button>
			</div>

		</div>
    </form>

</section>

<script>
	angularScope(function ($scope) {
		$scope.record = <?php echo json_encode($record); ?>;
	});
</script>