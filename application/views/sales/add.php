<section class="scrollable wrapper" ng-init="companies = Settings.companiesOfBranch(Auth.value('userBranch'))" style="min-height: 300px">
    <form ng-submit="showForm()" autocomplete="off">
    	<div class="row" ng-class="{ 'b-b b-light': formState !== formStates.OPCIONES }">
    		<div class="col-sm-6 col-lg-3" ng-class="{ 'col-lg-offset-1': config.type !== Sales.NOTA_DE_CREDITO }">
    			<div class="form-group required">
					<label class="control-label">Tipo</label>
					<select ng-model="config.type" ng-options="t.value as t.text for t in typeOpts" class="form-control" required ng-disabled="isLoading || formState !== formStates.OPCIONES">
						<option value="">- Seleccione -</option>
					</select>
				</div>
    		</div>
    		<div class="col-sm-6 col-lg-3">
    			<div class="form-group required">
					<label class="control-label">Empresa</label>
					<select ng-model="config.company" ng-options="c.company_id as c.company_name for c in companies" required class="form-control" ng-disabled="isLoading || formState !== formStates.OPCIONES">
						<option value="">- Seleccione -</option>
					</select>
				</div>
    		</div>
    		<div class="col-sm-6 col-lg-2" ng-if="config.type !== Sales.NOTA_DE_CREDITO">
    			<div class="form-group required">
					<label class="control-label">Régimen</label>
					<select class="form-control" ng-model="config.regime" ng-required="config.type !== Sales.NOTA_DE_CREDITO" ng-disabled="isLoading || formState !== formStates.OPCIONES">
						<option value="">- Seleccione -</option>
						<option value="General">General</option>
						<option value="ZOFRA">Zofra</option>
					</select>
				</div>
    		</div>
    		<div class="col-sm-6 col-lg-4" ng-if="config.type === Sales.NOTA_DE_CREDITO">
    			<div class="form-group required">
					<label class="control-label">Referencia</label>
					<div class="input-group m-b">
						<div class="input-group-btn">
							<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" ng-disabled="isLoading || formState !== formStates.OPCIONES">
								{{ config.reference.type.capitalize() }}
								<span class="caret"></span>
							</button>
                            <ul class="dropdown-menu">
								<li ng-class="{ active: config.reference.type === 'TICKET' }">
									<a href="#" ng-click="config.reference.type = 'TICKET'">
										Ticket
									</a>
								</li>
								<li ng-class="{ active: config.reference.type === 'BOLETA' }">
									<a href="#" ng-click="config.reference.type = 'BOLETA'">
										Boleta
									</a>
								</li>
								<li ng-class="{ active: config.reference.type === 'FACTURA' }">
									<a href="#" ng-click="config.reference.type = 'FACTURA'">
										Factura
									</a>
								</li>
                            </ul>
						</div>
						<input ng-model="config.reference.serie" erp-serie-input ng-required="config.type === Sales.NOTA_DE_CREDITO" type="text" class="form-control" ng-disabled="isLoading || formState !== formStates.OPCIONES">
					</div>
				</div>
    		</div>
    		<div class="col-sm-12 col-lg-2 text-center">
    			<div class="form-group">
					<label class="">&nbsp;</label>
					<button type="submit" class="btn btn-default" ng-class="{ 'btn-block': Page.isDesktop() }" ng-disabled="isLoading" ng-if="formState === formStates.OPCIONES">Aceptar</button>
					<button type="button" class="btn btn-default" ng-class="{ 'btn-block': Page.isDesktop() }" ng-click="hideForm()" ng-if="formState !== formStates.OPCIONES">Editar</button>
				</div>
    		</div>
    	</div>

    	<div class="row" ng-if="isLoading">
    		<div class="col-lg-12 text-center m-t-lg">
        		<img src="<?php echo base_url('public/images/ajax-loader-bg.gif'); ?>" alt="Cargando...">
        	</div>
    	</div>
    </form>

    <div ng-if="formState !== formStates.OPCIONES">
	    <form id="add-form" ng-submit="config.type === Sales.NOTA_DE_CREDITO ? saveRefund() : payOrFinish()" class="form-inline text-center m-t" autocomplete="off">
			<div class="form-group">
				<label class="v-middle">
					<h4 ng-bind="Sales.getVoucherString(config.type).capitalize() + ' N° '"></h4>
				</label>
				<input
                    ng-model="record.serie"
                    erp-serie-input data-zeros="4"
                    type="text"
                    class="form-control text-right"
                    style="width: 60px"
                    required
                    ng-disabled="formState !== formStates.ENTRADA"
                    data-toggle="tooltip" data-placement="bottom"
                >
				<label class="v-middle">
					<h4>-</h4>
				</label>
				<input
                    ng-model="record.serial_number"
                    erp-serie-input data-zeros="7"
                    type="text"
                    class="form-control text-right"
                    style="width: 120px"
                    required
                    ng-disabled="formState !== formStates.ENTRADA"
                    data-toggle="tooltip" data-placement="bottom"
                >
			</div>
		</form>

	    <div class="m-t" ng-if="config.type !== Sales.NOTA_DE_CREDITO">
	    	<div class="row">
				<div class="col-lg-3">
	                <div class="input-group m-b">
	                    <span class="input-group-addon">Fecha</span>
	                    <input type="text" class="form-control text-center" date-picker data-model="record.sale_date" required form="add-form" ng-disabled="formState !== formStates.ENTRADA">
	                </div>
	            </div>
	    		<div class="col-lg-9">
		            <erp-customer-chooser
		            	ng-model="customer"
		                data-voucher-type="{{ Sales.getVoucherString(config.type) }}"
		                disabled="formState !== formStates.ENTRADA"
		            ></erp-customer-chooser>
				</div>
				<div class="col-lg-7">
		            <erp-saleman-chooser
		            	data-list="saleman.list"
		            	ng-model="saleman.selected"
		                disabled="formState !== formStates.ENTRADA"
		            ></erp-saleman-chooser>
				</div>
				<div class="col-lg-5">
	                <div class="input-group m-b">
	                    <span class="input-group-addon">Punto de venta</span>
	                    <select ng-model="record.sale_point_id" ng-options="sp.id as sp.description for sp in salePoints" class="form-control" ng-disabled="formState !== formStates.ENTRADA">
	                    	<option value="">- Ninguno -</option>
	                    </select>
	                </div>
				</div>
	    	</div>

	    	<div class="row m-b m-t-sm">
				<div class="col-xs-6 text-left">
		            <a href="#" class="btn btn-default" ng-click="clearOrCancel()" tabindex="-1">
		                {{ formState === formStates.ENTRADA ? 'Borrar todo' : 'Cancelar' }}
		            </a>
				</div>
				<div class="col-xs-6 text-right">
		            <button ng-disabled="!saleDetails.length || total() <= 0" form="add-form" type="submit" name="submit" class="btn btn-primary">
		                {{ formState === formStates.ENTRADA ? 'Cobranza' : 'Finalizar' }}
		            </button>
				</div>
			</div>

			<div class="row">
		        <div class="col-lg-12">
		        	<h4>Detalle de venta</h4>
		            <div class="table-responsive panel panel-default">
			        	<table class="table b-t b-light sales-point-table" ng-class="{ 'table-hover': (formState === formStates.ENTRADA) }">
			        		<thead ng-if="saleDetails.length > 0">
			        			<tr>
			        				<th width="90px">Cód.</th>
			        				<th>Descripción</th>
			        				<th width="120px">Talla</th>
			        				<th width="90px">Cant.</th>
			        				<th width="160px">P.U.</th>
			        				<th width="100px">Subtotal</th>
			        				<th width="15px">&nbsp;</th>
			        			</tr>
			        		</thead>
			        		<tbody>
			        			<tr ng-repeat="detail in saleDetails" ng-init="detail.unit_price = unitPrice(detail).toFixed(2)">
					                <td width="90px">{{detail.code}}</td>
					                <td>
					                	<span ng-if="detail.regime === 'ZOFRA'">D.S. {{detail.output_statement}}<br /></span>
					                	{{detail.description}}
					                </td>
					                <td width="120px">{{ detail.size }}</td>
					                <td width="90px" class="text-center">
					                	<input
					                		type="number"
					                		ng-disabled="formState !== formStates.ENTRADA"
					                		class="form-control no-spin text-center" style="width: 70px"
					                		ng-model="detail.qty"
					                		min="1"
					                		ng-keydown="detailKeyPressed($event, detail)"
					                		ng-blur="detailBlur($event, detail)"
											required
					                	/>
					                </td>
					                <td class="text-right" width="160px">
					                	<div class="input-group">
                          					<span class="input-group-addon">S/</span>
					                		<input type="text" ng-model="detail.unit_price" class="form-control text-right" ng-disabled="formState !== formStates.ENTRADA" required>
					                	</div>
					                </td>
					                <td class="text-right" width="100px">
					                	{{subTotal(detail) | currency : 'S/ ' : 2}}
					                </td>
					                <td class="text-center" ng-if="formState === formStates.ENTRADA" width="15px">
					                	<a href="#" ng-click="removeDetail($index)" class="text-danger" title="Remover" data-tooltip>
					                		<i class="fa fa-times" />
					                	</a>
					                </td>
			        			</tr>
			        			<tr>
			        				<td colspan="7">
			        					<erp-sale-detail-chooser
			        						ng-model="saleDetails"
			        						customer-verified="customer.verified"
			        						disabled="formState !== formStates.ENTRADA"
			        						company="config.company"
			        						regime="config.regime"
			        						ignore-stock="true"
			        					></erp-sale-detail-chooser>
			        				</td>
			        			</tr>
			        		</tbody>
			        		<tfoot ng-if="saleDetails.length">
			        			<tr>
			        				<td class="text-right" colspan="5">
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
					success-label="Guardar"
					onsuccess="save"
				></erp-payment>
			</span>
	    </div>

	    <div class="m-t" ng-if="config.type === Sales.NOTA_DE_CREDITO">
	    	<div class="row">
				<div class="col-lg-3">
	                <div class="input-group m-b">
	                    <span class="input-group-addon">Fecha</span>
	                    <input type="text" class="form- text-center" date-picker data-model="record.sale_date" required form="add-form" ng-disabled="formState !== formStates.ENTRADA">
	                </div>
	            </div>
	    		<div class="col-lg-6">
		            <div class="input-group m-b">
	                    <span class="input-group-btn">
	                        <button class="btn btn-default" disabled>
	                            Cliente
	                        </button>
	                    </span>
	                    <input type="text" class="form-control" ng-model="refunded.customer" readonly tabindex="-1">
	                    <span class="input-group-btn" ng-if="refunded.verified === 't'">
	                        <button disabled class="btn btn-success" type="button" data-tooltip title="Cliente con descuento">
	                            <i class="fa fa-check"></i>
	                        </button>
	                    </span>
	                </div>
				</div>
				<div class="col-lg-3">
					<div class="input-group m-b">
	                    <span class="input-group-addon">Régimen</span>
	                    <input type="text" class="form-control" ng-value="refunded.regime" readonly tabindex="-1">
	                </div>
				</div>
				<div class="col-lg-4">
	                <div class="input-group m-b">
	                    <span class="input-group-addon">Punto de venta</span>
	                    <select ng-model="record.sale_point_id" ng-options="sp.id as sp.description for sp in salePoints" class="form-control" ng-disabled="formState !== formStates.ENTRADA">
	                    	<option value="">- Ninguno -</option>
	                    </select>
	                </div>
				</div>
				<div class="col-lg-3">
	                <div class="input-group m-b">
	                    <span class="input-group-addon">Motivo</span>
	                    <select ng-model="record.refund_reason_id" ng-options="rr.id as rr.description for rr in refundReasons" class="form-control" ng-disabled="formState !== formStates.ENTRADA">
	                    </select>
	                </div>
				</div>
				<div class="col-lg-5" ng-if="record.refund_reason_id === '5'" ng-required="record.refund_reason_id === '5'">
	                <input type="text" class="form-control" title="Motivo" ng-required="record.refund_reason_id === '5'" form="add-form" ng-disabled="formState !== formStates.ENTRADA" ng-model="record.other_refund_reason">
				</div>
	    	</div>

	    	<div class="row">
	            <div class="col-lg-12">
	                <h4>Productos a devolver</h4>
	                <div class="table-responsive panel panel-default">
	                    <table class="table b-t b-light sales-point-table table-hover">
	                        <thead ng-if="refunded.sale_details.length">
	                            <tr>
	                            	<th width="70px" class="text-center">&nbsp;</th>
	                                <th width="100px">Cód.</th>
	                                <th>Descripción</th>
	                                <th width="150px">Talla</th>
	                                <th width="100px">Cant.</th>
	                                <th width="120px">P.U.</th>
	                                <th width="120px">Subtotal</th>
	                            </tr>
	                        </thead>
	                        <tbody>
	                            <tr ng-repeat="detail in refunded.sale_details" ng-click="$parent.clickRefundDetail($event, detail, $parent.refundedDetails[$index])">
	                            	<td class="v-middle text-center">
										<div class="checkbox i-checks m-t-none m-b-none">
											<label>
												<input type="checkbox" ng-model="detail.checked" ng-change="$parent.changeRefundCheck(detail, $parent.refundedDetails[$index])" ng-disabled="!$parent.getMaxQtyForRefund(detail) || $parent.formState !== $parent.formStates.ENTRADA"><i></i>
											</label>
										</div>
									</td>
	                                <td>{{detail.code}}</td>
	                                <td>
	                                    <span ng-if="detail.regime === 'ZOFRA'">D.S. {{detail.output_statement}}<br /></span>
	                                    {{detail.product}}
	                                </td>
	                                <td>{{ detail.size }}</td>
	                                <td class="text-center">
	                                	<input type="number" ng-model="$parent.refundedDetails[$index].quantity" min="1" max="{{ $parent.getMaxQtyForRefund(detail) }}" class="form-control text-center" ng-disabled="!detail.checked || $parent.formState !== $parent.formStates.ENTRADA">
	                                </td>
	                                <td class="text-right">
	                                    {{ detail.price | currency : 'S/ ' : 2 }}
	                                </td>
	                                <td class="text-right">
	                                    {{ $parent.subTotalRefunded($index) | currency : 'S/ ' : 2 }}
	                                </td>
	                            </tr>
	                        </tbody>
	                        <tfoot ng-if="refunded.sale_details.length">
	                            <tr>
	                                <td class="text-right" colspan="6">
	                                    <strong>TOTAL</strong>
	                                </td>
	                                <td class="text-right">
	                                    <span ng-class="{ 'text-danger': total() < 0, 'text-primary': total() }">
	                                        {{ totalRefunded() | currency : 'S/ ' : 2 }}
	                                    </span>
	                                </td>
	                            </tr>
	                        </tfoot>
	                    </table>
	                </div>
	            </div>
	        </div>

	        <div class="row m-b m-t-none">
	            <div class="col-lg-12 text-center">
	                <button type="submit" form="add-form" class="btn btn-default m-t-sm btn-success" ng-disabled="!totalRefunded() || formState === formStates.GUARDANDO">
	                    Guardar
	                </button>
	            </div>
	        </div>
	    </div>
	</div>
</section>

<!--h3>salePoints</h3>
<pre>{{ salePoints | json }}</pre>

<h3>saleman</h3>
<pre>{{ saleman | json }}</pre>

<h3>refundedDetails</h3>
<pre>{{ refundedDetails | json }}</pre>

<h3>refunded</h3>
<pre>{{ refunded | json }}</pre>

<h3>saleDetails</h3>
<pre>{{ saleDetails | json }}</pre>

<h3>record</h3>
<pre>{{ record | json }}</pre>

<h3>config</h3>
<pre>{{ config | json }}</pre>

<h3>payments</h3>
<pre>{{ payments | json }}</pre-->

<script>
	angularScope(function ($scope) {
		$scope.saleman.list = <?php echo json_encode($employees); ?>;
		$scope.salePoints = <?php echo json_encode($sale_points); ?>;

		$scope.exchangeRates = <?php echo json_encode($exchange_rates); ?>;
		$scope.refundReasons = <?php echo json_encode($refund_reasons); ?>;
		$scope.cardTypes = <?php echo json_encode($card_types); ?>;
		$scope.taxes = <?php echo json_encode($taxes); ?>;

		$scope.initCurrentSalePoint(); // Necesario para obtener el punto de venta actual (si lo hubiera)
	});
</script>
