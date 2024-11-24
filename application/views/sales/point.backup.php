<section class="scrollable wrapper hidden-print" id="sale-point-container">
	<div class="row">

   		<div class="col-lg-7">
            <erp-customer-chooser
            	ng-model="customer"
                data-voucher-type="TICKET"
            ></erp-customer-chooser>
		</div>

		<div class="col-lg-5">
            <erp-saleman-chooser
            	data-list="saleman.list"
            	ng-model="saleman.selected"
            ></erp-saleman-chooser>
		</div>

	</div>

	<div class="row">
		<div class="col-lg-12">
			<p>Serie: {{ serie | json }}</p>
			<p>Serial Ticketera: {{ salePrinter | json }}</p>
		</div>
	</div>

	<div class="row">
        <div class="col-lg-12">
        	<h4>Detalle de venta</h4>
            <div class="table-responsive panel panel-default">
	        	<table class="table b-t b-light sales-point-table table-hover">
	        		<thead ng-if="saleDetails.length">
	        			<tr>
	        				<th>Cód.</th>
	        				<th>Descripción</th>
	        				<th>Talla</th>
	        				<th>Régimen</th>
	        				<th>Empresa</th>
	        				<th>Cant.</th>
	        				<th>P.U.</th>
	        				<th>Subtotal</th>
	        				<th width="20">&nbsp;</th>
	        			</tr>
	        		</thead>
	        		<tbody>
	        			<tr ng-repeat="detail in saleDetails">
			                <td>{{detail.code}}</td>
			                <td>
			                	<span ng-if="detail.regime === 'ZOFRA'">D.S. {{detail.output_statement}}<br /></span>
			                	{{detail.description}}
			                </td>
			                <td>{{ getSize(detail.size_id) }}</td>
			                <td>{{ detail.regime }}</td>
			                <td>{{ detail.company_name }}</td>
			                <td><input type="number" class="form-control" style="width: 70px" ng-model="detail.qty" min="1" max="{{detail.stock}}" /></td>
			                <td class="text-right">{{getPrice(detail) | currency : 'S/ ' : 2}}</td>
			                <td class="text-right">{{detail.qty * getPrice(detail) | currency : 'S/ ' : 2}}</td>
			                <td class="text-center">
			                	<a href="#" ng-click="removeSaleDetail(detail.id)" class="text-danger" title="Remover" data-tooltip>
			                		<i class="fa fa-times" />
			                	</a>
			                </td>
	        			</tr>
	        			<tr ng-if="sale.coupon_id">
			                <td>{{coupon.code}}</td>
			                <td colspan="6">CUPÓN DE DESCUENTO</td>
			                <td class="text-right">{{-coupon.amount | currency : 'S/ ' : 2}}</td>
			                <td>&nbsp;</td>
	        			</tr>
	        			<tr>
	        				<td colspan="10">
	        					<form ng-submit="searchBarcode()">
	        						<div class="input-group">
	        							<input type="text" class="form-control" required ng-model="barcode" id="sale-point-input" ng-disabled="inputState !== 'waiting'" placeholder="Escanee código de barras" />
										<span class="input-group-btn">
											<button class="btn btn-default" type="button" id="search-product-button" ng-disabled="inputState !== 'waiting'">
												<i class="icon-search-1"></i>
												Buscar
											</button>
										</span>
									</div>
	        					</form>
	        				</td>
	        			</tr>
	        		</tbody>
	        		<tfoot ng-if="saleDetails.length">
	        			<tr>
	        				<td class="text-right" colspan="7">
	        					<strong>TOTAL</strong>
	        				</td>
	        				<td class="text-right">
	        					<span ng-class="{'text-danger': (total() < 0)}">{{total() | currency : 'S/ ' : 2}}</span>
	        				</td>
	        				<td>&nbsp;</td>
	        			</tr>
        			</tfoot>
	        	</table>
	        </div>
        </div>

	</div>
    
    <div class="row m-b">
        <div class="col-sm-6 text-right">
			<button type="button" ng-disabled="inputState !== 'waiting'" ng-class="!sale.coupon_id ? 'btn btn-default' : 'btn btn-default active'" ng-click="setCoupon(!sale.coupon_id)">
				<i class="fa fa-check" ng-if="sale.coupon_id" />
				Cupón
			</button>
		</div>
		<div class="col-sm-6 text-left">
            <button type="button" class="btn btn-primary" data-modal="#payment-calc-modal" ng-disabled="!saleDetails.length || total() < 0">
                Pagar
            </button>
		</div>
	</div>

</section>

<iframe id="ticket-0" name="ticket-0" class="2hidden-content"></iframe>
<iframe id="ticket-1" name="ticket-1" class="2hidden-content"></iframe>
<iframe id="ticket-2" name="ticket-2" class="2hidden-content"></iframe>
<iframe id="ticket-3" name="ticket-3" class="2hidden-content"></iframe>

<iframe id="cierre-caja" name="cierre-caja" class="2hidden-content"></iframe>

<div class="modal fade" id="coupon-calc-modal" erp-simple-calc data-title="Cupón" ng-model="coupon.code"></div>

<div class="modal fade" id="payment-calc-modal" erp-payment-calc data-title="Pagar" ng-model="payments" data-total="total()" data-cards='<?php echo erp_escape(json_encode($card_types)); ?>'></div>

<div class="modal fade" id="ticket-modal">
	<div class="modal-dialog" ng-class="{ 'modal-sm': totalVouchers() === 1, 'modal-lg': totalVouchers() === 3, 'modal-xlg' : totalVouchers() > 3 }">
		<div class="modal-content">
			<div class="modal-header hidden-print">
				<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
				<h4 class="modal-title">Ticket<span ng-show="totalVouchers() > 1">s</span> de Venta</h4>
			</div>
			<div class="modal-body wrapper-lg">
				<div ng-if="!loadingTicket" name="tickets" style="display: table; width: 100%; table-layout: fixed">
				</div>
				<div class="row text-center" ng-if="loadingTicket">
					<img src="<?php echo base_url('public/images/ajax-loader-bg.gif'); ?>" alt="Cargando..." class="ticket-loading" />
				</div>
			</div>
			<div class="modal-footer hidden-print" ng-if="!loadingTicket">
        		<button type="button" class="btn btn-primary" ng-click="print()" data-dismiss="modal">Guardar e imprimir</button>
				<button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
			</div>
		</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div>

<script>
	angularScope(function ($scope) {
		$scope.saleman.list = <?php echo json_encode($employees); ?>.extendEach({selected: false});
		//$scope.saleCompany = <-?php echo json_encode($sale_company); ?->;
		$scope.salePrinter = <?php echo json_encode($sale_printer); ?>;
		$scope.serie = <?php echo json_encode($serie); ?>;
		$scope.sizes = <?php echo json_encode($sizes); ?>;
		$scope.regime = <?php echo json_encode($regime); ?>;
	});
</script>
