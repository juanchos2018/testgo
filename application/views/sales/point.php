<section class="scrollable wrapper" ng-if="salePointState === salePointStates.SIN_REGISTROS">
	<div class="row">
		<div class="col-lg-12 text-center">
			<a class="btn btn-default" href="#/sale_points">
				Ir a puntos de venta
			</a>
		</div>
	</div>
</section>

<section class="scrollable wrapper" ng-if="salePointState === salePointStates.NO_ENCONTRADO">
	<div class="row">
		<div class="col-lg-12">
			<form class="form-horizontal" ng-submit="setCurrentSalePoint()">
                <div class="form-group required">
                	<label class="col-lg-4 control-label">
                  		Punto de venta
                  	</label>
					<div class="col-lg-3">
						<select class="form-control" ng-model="$parent.currentSalePoint" ng-options="sp.id as sp.description for sp in salePoints" required>
							<option value="">- Seleccione -</option>
						</select>
					</div>
                </div>

                <div class="form-group m-t-lg">
					<div class="col-lg-offset-4 col-lg-8">
						<button type="submit" class="btn btn-success">
							Continuar
						</button>
					</div>
				</div>
            </form>
		</div>
	</div>
</section>

<form ng-submit="payOrFinish()" class="m-b-lg">
	<section class="scrollable wrapper" ng-if="salePointState === salePointStates.LISTO">
		<div class="row">
	   		<div class="col-lg-7">
			   <!--data-voucher-type="{{ Sales.getVoucherString(config.type) }}" wryt-->
	            <erp-customer-chooser
	            	ng-model="customer"
	                autofocus="true"
	                disabled="formState !== formStates.ENTRADA"
	            ></erp-customer-chooser>
			</div>

			<div class="col-lg-5">
	            <erp-saleman-chooser
	            	data-list="saleman.list"
	            	ng-model="saleman.selected"
	                disabled="formState !== formStates.ENTRADA"
	            ></erp-saleman-chooser>
			</div>

		</div>
	    
	    <div class="row m-b m-t-sm">
			<div class="col-xs-4 text-left">
				<select ng-model="config.type" ng-options="t.value as t.text for t in typeOpts" class="form-control" required>
					<option value="">- Seleccione -</option>
				</select>
			</div>
			<div class="col-xs-4 text-left">
	            <a href="#" class="btn btn-default" ng-click="clearOrCancel()" tabindex="-1">
	                {{ formState === formStates.ENTRADA ? 'Borrar todo' : 'Cancelar' }}
	            </a>
			</div>
			<div class="col-xs-4 text-right">
	            <button ng-disabled="!saleDetails.length || total() <= 0" type="submit" name="submit" class="btn btn-primary">
	                {{ formState === formStates.ENTRADA ? 'Cobrar' : 'Finalizar' }}
	            </button>
			</div>
		</div>

		<div class="row">
	        <div class="col-lg-12">
	        	<h4>Detalle de venta</h4>
	            <div class="table-responsive panel panel-default">
		        	<table class="table b-t b-light sales-point-table" ng-class="{ 'table-hover': (formState === formStates.ENTRADA) }">
		        		<thead ng-if="hasDetailsWithoutPacks()">
		        			<tr>
		        				<th width="90px">Cód.</th>
		        				<th>Descripción</th>
		        				<th>Talla</th>
		        				<th>Régimen</th>
		        				<th>Empresa</th>
		        				<th width="90px">Cant.</th>
		        				<th width="100px">P.U.</th>
		        				<th width="100px">Subtotal</th>
		        				<th width="15px">&nbsp;</th>
		        			</tr>
		        		</thead>
		        		<tbody>
		        			<tr ng-repeat="detail in saleDetails" ng-if="!detail.pack_list_id">
				                <td width="90px">{{detail.code}}</td>
				                <td>
				                	<span ng-if="detail.regime === 'ZOFRA'">D.S. {{detail.output_statement}}<br /></span>
				                	{{detail.description}}
				                </td>
				                <td>{{ detail.size }}</td>
				                <td>{{ detail.regime }}</td>
				                <td>{{ detail.company_name }}</td>
				                <td width="90px" class="text-center">
				                	<input
				                		type="number"
				                		ng-disabled="formState !== formStates.ENTRADA"
				                		class="form-control no-spin text-center" style="width: 70px"
				                		ng-model="detail.qty"
				                		min="1" max="{{detail.stock}}"
				                		ng-keydown="detailKeyPressed($event, detail)"
				                		ng-blur="detailBlur($event, detail)"
										required
				                	/>
				                </td>
				                <td class="text-right" width="100px">
				                	{{unitPrice(detail) | currency : 'S/ ' : 2}}
				                </td>
				                <td class="text-right" width="100px">
				                	{{subTotal(detail) | currency : 'S/ ' : 2}}
				                </td>
				                <td class="text-center" ng-if="formState === formStates.ENTRADA" width="15px">
				                	<a href="#" ng-click="removeDetail($index)" class="text-danger" title="Eliminar" data-tooltip>
				                		<i class="fa fa-times" />
				                	</a>
				                </td>
		        			</tr>
		        			<tr ng-repeat-start="pack in packs">
		        				<th colspan="9" class="text-center text-u-c">
		        					{{ pack.description }}
		        				</th>
		        			</tr>
							<tr ng-repeat-end ng-repeat="packDetail in pack.details">
		        				<td width="90px" ng-bind="packDetail.code"></td>
		        				<td>
				                	<span ng-if="packDetail.regime === 'ZOFRA'">D.S. {{packDetail.output_statement}}<br /></span>
				                	{{packDetail.description}}
				                </td>
								<td ng-bind="packDetail.size"></td>
				                <td ng-bind="packDetail.regime"></td>
				                <td ng-bind="packDetail.company_name"></td>
								<td width="90px" class="text-center" ng-bind="packDetail.qty"></td>

				                <td class="text-right" width="100px" ng-if="!$index" rowspan="{{ $parent.pack.details.length }}">
				                	&nbsp;
				                </td>
				                <td class="text-right" width="100px" ng-if="!$index" rowspan="{{ $parent.pack.details.length }}">
				                	{{ $parent.pack.price | currency : 'S/ ' : 2 }}
				                </td>
				                <td class="text-center" ng-if="formState === formStates.ENTRADA && !$index" width="15px" rowspan="{{ $parent.pack.details.length }}">
				                	<a href="#" ng-click="removePack($parent.$parent.$index)" title="Eliminar" data-tooltip class="text-danger">
				                		<i class="fa fa-times" />
				                	</a>
				                </td>
		        			</tr>
		        			<tr>
		        				<td colspan="10">
		        					<erp-sale-detail-chooser
		        						ng-model="saleDetails"
										search-in-packs="searchInPacks"
		        						customer-verified="customer.verified"
		        						disabled="formState !== formStates.ENTRADA"
		        					></erp-sale-detail-chooser>
		        				</td>
		        			</tr>
		        		</tbody>
		        		<tfoot ng-if="saleDetails.length">
		        			<tr>
		        				<td class="text-right" colspan="7">
		        					<strong>TOTAL</strong>
		        				</td>
		        				<td class="text-right">
		        					<span ng-class="{ 'text-danger': total() < 0, 'text-primary': total() }">
		        						{{ total() | currency : 'S/ ' : 2 }}
		        					</span>
		        				</td>
		        				<td>&nbsp;</td>
		        			</tr>
	        			</tfoot>
		        	</table>
		        </div>
	        </div>

		</div>

		<span ng-if="formState === formStates.PAGO"><!-- Botón invisible para acelerar el modal de pago -->
			<erp-payment
				customer-verified="customer.verified"
				taxes="taxes"
				exchange-rates="exchangeRates"
				cards="cardTypes"
				details="saleDetails"
				ng-model="payments"
				onsuccess="saveAndPrint"
			></erp-payment>
		</span>
	</section>
</form>

<?php if (count($available_campaigns) > 0): ?>
<?php foreach ($available_campaigns as $campaign): ?>
<div class="row wrapper" ng-if="campaignPacks.length > 0">
	<div class="col-lg-12">
		<section class="panel panel-info">
			<header class="panel-heading">
				<?php echo $campaign['description']; ?>
				<span class="pull-right">
					<?php echo date('d/m/Y', strtotime($campaign['start_date'])); ?>
					<?php if (!is_null($campaign['end_date'])): ?>
						&mdash; <?php echo date('d/m/Y', strtotime($campaign['end_date'])); ?>
					<?php endif; ?>
				</span>
			</header>
			<table class="table table-hover m-b-none">
				<thead>
					<tr>
						<th width="80px">N°</th>
						<th>Combo</th>
						<th width="120px">Precio</th>
					</tr>
				</thead>
				<tbody>
					<tr ng-repeat="pack in campaignPacks | filter: { campaign_id: <?php echo $campaign['id']; ?> } track by $index">
						<td ng-bind="$index + 1" class="text-center"></td>
						<td ng-bind="pack.description"></td>
						<td ng-bind="pack.price | currency : 'S/ ' : 2" class="text-right"></td>
					</tr>
				</tbody>
			</table>
		</section>
	</div>
</div>
<?php endforeach; ?>
<?php endif; ?>

<script>
	angularScope([
		'$scope', 'PgData',
		function ($scope, PgData) {
			$scope.saleman.list = <?php echo json_encode($employees); ?>;
			$scope.salePoints = <?php echo json_encode($sale_points); ?>;
			//$scope.availablePacks = new Map();
			
			<?php echo json_encode($available_packs); ?>.forEach(function (pack) {
				if ('pack_id' in pack && 'product_details' in pack) {
					pack.product_details = PgData.toArray(pack.product_details);
					pack.quantity = pack.quantity !== null ? parseInt(pack.quantity, 10) : null; // TEMPORAL: pack.quantity NO debe ser NULL
					pack.sale_details = [];

					pack.product_details.forEach(function (product_detail_id) {
						if ($scope.productsInPacks.has(product_detail_id)) {
							$scope.productsInPacks.get(product_detail_id).push(pack.pack_id);
						} else {
							$scope.productsInPacks.set(product_detail_id, [pack.pack_id]);
						}
					});
					
					if ($scope.availablePacks.has(pack.pack_id)) {
						$scope.availablePacks.get(pack.pack_id).push(pack);
					} else {
						$scope.availablePacks.set(pack.pack_id, [pack]);

						$scope.campaignPacks.push({
							description: pack.description,
							price: parseFloat(pack.price),
							campaign_id: parseInt(pack.campaign_id, 10)
						});
					}
				}
			});
			
			$scope.exchangeRates = <?php echo json_encode($exchange_rates); ?>;
			$scope.cardTypes = <?php echo json_encode($card_types); ?>;
			$scope.taxes = <?php echo json_encode($taxes); ?>;

			$scope.initCurrentSalePoint();
		}
	]);
</script>
