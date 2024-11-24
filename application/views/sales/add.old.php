<section class="scrollable wrapper" id="sale-point-container">
	<div class="row hidden-print">

        <section class="panel panel-default">
            <div class="panel-body" style="min-height: 170px;">
            	<div class="row">
					<div class="col-sm-8 m-b m-t-sm">
						<div class="form-horizontal">
							<div class="form-group m-b-none">
	                          <label class="col-lg-2 control-label">Régimen</label>
	                          <div class="col-lg-10">
	                            <erp-select 
									model="regime"
									data="[{id: 'General', text: 'General'}, {id: 'ZOFRA', text: 'Zofra'}]"
									data-on-change="changedRegime(newVal, oldVal)"
									data-disabled="saleDetails.length">
								</erp-select>
	                          </div>
	                        </div>
						</div>
					</div>
					<div class="col-sm-4 m-b m-t-sm">
						<div class="row-fluid" id="serie-container">
							<div class="col-sm-4">
								<erp-select 
									model="voucher"
									data="[{id: 'BOLETA', text: 'Boleta'}, {id: 'FACTURA', text: 'Factura'}]"
									data-on-change="resetSerie()">
								</erp-select>
							</div>
							<div class="col-sm-3 p-r-none">
								<erp-serie-input
									target="serie.serie"
									data-zeros="3"
									data-class="form-control text-right"
									data-on-change="changedSerie(newVal, oldVal)">
								</erp-serie-input>
								<!--input type="text" required class="form-control text-right" ng-model="serie.serie" /-->
							</div>
							<div class="col-sm-5">
								<erp-serie-input
									target="serie.number"
									data-zeros="7"
									data-class="form-control text-right"
									data-on-change="changedSerial(newVal, oldVal)">
								</erp-serie-input>
								<!--input type="text" required class="form-control text-right" ng-model="serie.number" /-->
							</div>
						</div>
					</div>
				</div>

				<div class="row m-b">
					<hr class="divider m-b-none m-t-none" />
				</div>

				<div class="row">
		       		<div class="col-lg-5">
                        <div class="input-group m-b">
							<span class="input-group-btn">
								<button class="btn btn-default" type="button" data-modal="#search-customers-modal">Cliente</button>
								<div class="input-group-btn">
                            </div>
							</span>
							<input type="text" class="form-control" readonly="" ng-model="customer"/>
							<span class="input-group-btn">
								<button class="btn btn-default" type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Nuevo Cliente" data-modal="#new-customer-modal">
									<i class="fa fa-plus text"></i>
								</button>
							</span>
                        </div>
					</div>

					<div class="col-lg-5">
						<erp-saleman-chooser
							data-list="saleman.list"
							ng-model="saleman.selected"
						></erp-saleman-chooser>
					</div>

					<div class="col-lg-2">
						<h4 class="text-right">
							<span ng-class="total() > 0 ? 'text-success' : (total() < 0 ? 'text-danger' : 'text-muted')">
								{{total() | currency : 'S/ ' : 2}}
							</span>
						</h4>
					</div>
				</div>

				<div class="row">
					<hr class="divider m-b m-t-none" />
				</div>

				<div class="row m-b">
					<div class="col-lg-12">
						<p class="pull-left">
							<!--button type="button" class="btn btn-default" disabled>Crédito</button-->
							<button type="button" ng-disabled="inputState !== 'waiting'" ng-class="!sale.coupon_id ? 'btn btn-default' : 'btn btn-default active'" ng-click="setCoupon(!sale.coupon_id)">
								<i class="fa fa-check" ng-if="sale.coupon_id" />
								Cupón
							</button>
						</p>
						<p class="pull-right">
							<button type="button" class="btn btn-success btn-rounded" data-modal="#payment-calc-modal" ng-disabled="!saleDetails.length || !serie.serie || !serie.number || total() < 0">
								Pagar
							</button>
						</p>
					</div>
				</div>

				<div class="row">
			        <div class="col-lg-8">
			            <div class="table-responsive">
				        	<table class="table b-t b-light sales-point-table">
				        		<thead>
				        			<tr>
				        				<th width="20">&nbsp;</th>
				        				<th>Cód.</th>
				        				<th>Descripción</th>
				        				<th>Cant.</th>
				        				<th>P.U.</th>
				        				<th>Subtotal</th>
				        			</tr>
				        		</thead>
				        		<tbody>
				        			<tr ng-repeat="detail in saleDetails" ng-click="selectDetail($event, $index)" ng-class="selected === $index ? 'selected-row' : ''">
				        				<td class="text-center">
						                    <label class="checkbox m-n i-checks">
						                        <input type="radio" style="width: 0; height: 0; position: absolute" name="sale-detail-radio" ng-value="detail.id" ng-checked="selected === $index" />
						                        <i></i>
						                    </label>
						                </td>
						                <td>{{detail.code}}</td>
						                <td>
						                	<span ng-if="detail.regime === 'ZOFRA'">D.S. {{detail.output_statement}}<br /></span>
						                	{{detail.description}}
						                </td>
						                <td><input type="number" class="form-control" style="width: 70px" ng-model="detail.qty" min="1" max="{{detail.stock}}" /></td>
						                <td class="text-right">{{getPrice(detail) | currency : 'S/ ' : 2}}</td>
						                <td class="text-right">{{detail.qty * getPrice(detail) | currency : 'S/ ' : 2}}</td>
				        			</tr>
				        			<tr ng-if="sale.coupon_id">
						                <td>&nbsp;</td>
						                <td>{{coupon.code}}</td>
						                <td colspan="3">CUPÓN DE DESCUENTO</td>
						                <td class="text-right">{{-coupon.amount | currency : 'S/ ' : 2}}</td>
				        			</tr>
				        			<tr ng-click="selectDetail($event)" ng-class="selected === '' ? 'selected-row' : ''">
				        				<td class="text-center">
						                    <label class="checkbox m-n i-checks">
						                        <input type="radio" style="width: 0; height: 0; position: absolute"  name="sale-detail-radio" value="" ng-checked="selected === ''" />
						                        <i></i>
						                    </label>
						                </td>
				        				<td colspan="5">
				        					<form ng-submit="searchBarcode()">
				        						<div class="input-group">
				        							<input type="text" class="form-control" required ng-model="barcode" id="sale-point-input" ng-disabled="inputState !== 'waiting'" />
													<span class="input-group-btn">
														<button class="btn btn-default" type="button" id="search-product-button" data-toggle="tooltip" data-placement="bottom" data-title="Búsqueda manual (F3)" data-modal="#search-product-modal" ng-disabled="inputState !== 'waiting'">
															<i class="icon-search-1"></i>
														</button>
													</span>
												</div>
				        					</form>
				        				</td>
				        			</tr>

				        		</tbody>
				        	</table>
				        </div>
			        </div>

			        <div class="col-lg-4">
			          <section class="panel panel-default sales-point-panel" id="product-details">
			          	<header class="panel-heading" ng-bind="selected !== '' ? saleDetails[selected].description : (inputState === 'waiting' ? 'Esperando lectura' : 'Procesando...')"></header>
			            <div class="panel-body">
			            	<div class="m-b-sm" ng-if="selected === '' && inputState === 'waiting'">
			            		<p>
			            			Utilice el lector de código de barras para ingresar un producto.
			            		</p>
			            		<p class="text-center">
			            			<img src="<?php echo base_url('public/images/barcode_scanner.png'); ?>" alt="Lector" />
			            		</p>
			            	</div>
			            	<div class="m-b-sm" ng-if="selected === '' && inputState === 'processing'">
			            		<p class="text-center padder-v">
			            			<img src="<?php echo base_url('public/images/ajax-loader.gif'); ?>" alt="Lector" />
			            		</p>
			            	</div>
			            	<div class="m-b-none" ng-if="selected !== ''">
			            		<div class="row">
			            			<div class="col-xs-8">
					            		<form class="form-horizontal" role="form">
					            			<div class="form-group">
												<label class="col-sm-5 control-label text-success">Talla</label>
												<div class="col-sm-7">
													<p class="form-control-static">
														{{saleDetails[selected].size}}
													</p>
												</div>
											</div>
					            			<div class="form-group">
												<label class="col-sm-5 control-label text-success">Marca</label>
												<div class="col-sm-7">
													<p class="form-control-static">{{saleDetails[selected].brand}}</p>
												</div>
											</div>
					            			<div class="form-group">
												<label class="col-sm-5 control-label text-success">Stock</label>
												<div class="col-sm-7">
													<p class="form-control-static">{{saleDetails[selected].stock - saleDetails[selected].qty}}</p>
												</div>
											</div>
					            			<div class="form-group">
												<label class="col-sm-5 control-label text-success">Régimen</label>
												<div class="col-sm-7">
													<p class="form-control-static">{{saleDetails[selected].regime}}</p>
												</div>
											</div>
					            			<div class="form-group">
												<label class="col-sm-5 control-label text-success">Empresa</label>
												<div class="col-sm-7">
													<p class="form-control-static">{{saleDetails[selected].company_name}}</p>
												</div>
											</div>
					            		</form>
			            			</div>
			            			<div class="col-xs-4">
			            				<div class="row">
			            					<div class="col-xs-12 text-center">
			            						&nbsp;
			            					</div>
			            				</div>
			            			</div>
			            		</div>
			            		<div class="row m-t">
			            			<div class="col-xs-6">
			            				<button type="button" class="btn btn-danger btn-block" ng-click="removeSaleDetail(saleDetails[selected].id)">
			            					Eliminar
			            				</button>
			            			</div>
			            			<div class="col-xs-6">
			            				<button type="button" class="btn btn-default btn-block">
			            					Cambiar precio
			            				</button>
			            			</div>
			            		</div>
			            	</div>
			            </div>
			          </section>

			        </div>
				</div>
			</div>
		</section>
	</div>
</section>

<iframe id="ticket-form" name="ticket-form" class="hidden-content"></iframe>

<div class="modal fade" id="search-customers-modal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
      	<div class="modal-header">
		  <button type="button" class="close" data-dismiss="modal">
		      <span aria-hidden="true">&times;</span>
		      <span class="sr-only">Cerrar</span>
		  </button>
		  <h4 class="modal-title">Buscar cliente</h4>
		</div>

        <div class="modal-body">
        	<section class="panel panel-default">
	            <header class="panel-heading bg-light">
	              <ul class="nav nav-tabs nav-justified">
	                <li class="active"><a href="#person-customer-tab" data-no-link data-toggle="tab">Persona Natural</a></li>
	                <li><a href="#company-customer-tab" data-no-link data-toggle="tab">Persona Jurídica</a></li>
	              </ul>
	            </header>
	            <div class="panel-body">
	              <div class="tab-content">
	                <div class="tab-pane active" id="person-customer-tab">
	                	<div class="row sales-point-customer-list">
				          	<div class="col-sm-12">
				              	<?php
									echo erp_datatable(
										site_url('customers/people_list_for_sale'),
										array(
											'ajax' => TRUE,
											'labels' => array('ID', 'DNI', 'Nombres','Apellidos','Codigo Tarjeta 2'),
											'DOM' => "<'row'<'col-sm-6'f><'col-sm-6'p>r>t",
											'lang' => array(
												'search' => ''
											),
											'hide_id' => TRUE
										)
									);
								?>
				            </div>
				        </div>
	                </div>
	                <div class="tab-pane" id="company-customer-tab">
	                	<div class="row sales-point-customer-list">
				          	<div class="col-sm-12">
				              	<?php
									echo erp_datatable(
										site_url('customers/company_list_for_sale'),
										array(
											'ajax' => TRUE,
											'labels' => array('ID', 'RUC', 'Razón Social'),
											'DOM' => "<'row'<'col-sm-6'f><'col-sm-6'p>r>t",
											'lang' => array(
												'search' => ''
											),
											'hide_id' => TRUE
										)
									);
								?>
				            </div>
				        </div>
	                </div>
	              </div>
	            </div>
	        </section>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>

<div class="modal fade" id="coupon-calc-modal" erp-simple-calc data-title="Cupón" ng-model="coupon.code"></div>

<div
	class="modal fade"
	id="payment-calc-modal"
	erp-payment-calc
	data-title="Pagar"
	data-finish-label="Guardar"
	ng-model="payments"
	data-total="total()"
	data-cards='<?php echo erp_escape(json_encode($card_types)); ?>'
></div>

<div class="modal fade" id="new-customer-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body wrapper-lg">
          <div class="row">
            <div class="col-sm-12">
              <h3 class="m-t-none m-b">Nuevo Cliente</h3>
              <form role="form" ng-submit="saveCustomer()">
                <div class="form-group">
                  <label>Tipo</label>
                  <select class="form-control">
                  	<option value="PERSONA" selected>Persona Natural</option>
                  	<option value="EMPRESA">Persona Jurídica</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Codigo Tarjeta</label>
                  <input type="text" class="form-control" ng-model="newCustomer.barcode_inticard">
                </div>
                <div class="form-group">
                  <label>DNI/RUC/RUT</label>
                  <input type="text" class="form-control" ng-model="newCustomer.id_number">
                </div>
                <div class="form-group">
                  <label>Nombres</label>
                  <input type="text" class="form-control" ng-model="newCustomer.name">
                  <label>Apellidos</label>
                  <input type="text" class="form-control" ng-model="newCustomer.last_name">
                </div>
                <div class="checkbox m-t-lg">
                  <button type="submit" class="btn btn-sm btn-success pull-right text-uc m-t-n-xs"><strong>Registrar</strong></button>
                </div>                
              </form>
            </div>
          </div>          
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>

<div class="modal fade" id="search-product-modal" data-modal-autofocus>
	<div class="modal-dialog modal-lg">
	<div class="modal-content">

	    <div class="modal-header">
	      <button type="button" class="close" data-dismiss="modal">&times;</button>
	      <h4 class="modal-title">Buscar producto</h4>
	    </div>

		<div class="modal-body wrapper-lg sales-point-product-list">
			<div class="row">
				<div class="col-sm-12">
					<?php
						echo erp_datatable(
							site_url('products/list_for_sale_by/regime/General'), // Está en régimen Gneral por defecto
							array(
								'ajax' => TRUE,
								'labels' => array('ID', 'Código', 'Descripción','Talla', 'Stock'),
								'DOM' => "<'row'<'col-sm-12'f>r>t<'row'<'col-sm-12'p>>",
								'lang' => array(
									'search' => ''
								),
								'hide_id' => TRUE
							)
						);
					?>
				</div>
			</div>
		</div>
	</div><!-- /.modal-content -->
	</div><!-- /.modal-dialog -->
</div>

<script>
	angularScope(function ($scope) {
		$scope.saleman.list = <?php echo json_encode($employees); ?>.extendEach({selected: false});
		$scope.regimes = <?php echo json_encode($regimes); ?>;
		$scope.serie.list_boleta = <?php echo json_encode($series_boleta); ?>;
		$scope.serie.list_factura = <?php echo json_encode($series_factura); ?>;

		$scope.salemen = $scope.saleman.list;
	});
</script>
