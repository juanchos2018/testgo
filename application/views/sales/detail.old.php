<section class="scrollable wrapper">
	<div class="row">
        <ul class="breadcrumb">
            <li><i class="fa fa-shopping-cart"></i> Ventas</li>
            <li><a href="#/sales/operations">Operaciones</a></li>
            <li class="active">
				Detalle de venta
			</li>
        </ul>

        <section class="panel panel-default">
            <header class="panel-heading">
                <span>
                    <span class="text-muted">
                        Registrado por: <?php echo $sale->cashier; ?>
                    </span>
                </span>
                <span class="pull-right">
                    <span class="text-muted">
                        Fecha: <?php echo date('d/m/Y h:i A', strtotime($sale->sale_date)); ?>
                    </span>
                </span>
            </header>
            <div class="panel-body">
                <form ng-submit="submit()" ng-init="refunded.customer_id = '<?php echo $sale->customer_id; ?>'; refunded.refund_origin_id = '<?php echo $sale->id; ?>';">
					<?php if (!empty($sale->refunded)): ?>
					<div class="row m-b">
						<div class="col-lg-12">
							<div class="alert alert-warning alert-block">
								<?php
									$refunded_parts = explode(',', $sale->refunded);

									if ($sale->voucher !== 'NOTA DE CREDITO'):
								?>
								<p>Algunos productos han sido devueltos en
									<a href="#/sales/detail/<?=current($refunded_parts)?>" data-tooltip data-placement="top" data-title="Ver detalle">
										Nota de Crédito N° <?=erp_number_format(next($refunded_parts), next($refunded_parts))?>
									</a>
								</p>
								<?php
									else:
								?>
								<p>Nota de crédito vinculada a
									<a href="#/sales/detail/<?=current($refunded_parts)?>" data-tooltip data-placement="top" data-title="Ver detalle">
										<?=next($refunded_parts)?> N° <?=erp_number_format(next($refunded_parts), next($refunded_parts))?>
									</a>
								</p>
								<?php
									endif;
								?>
							</div>
						</div>
					</div>
					<?php endif; ?>

                    <div class="row">
                        <div class="col-lg-5">
                            <div class="input-group m-b">
                                <span class="input-group-btn">
                                    <button class="btn btn-default" type="button" disabled>Cliente</button>
                                </span>
                                <input type="text" class="form-control" disabled value="<?php echo $sale->customer; ?>" />
                            </div>
                        </div>

                        <div class="col-lg-5">
                            <div class="input-group m-b">
                                <span class="input-group-btn">
                                    <button class="btn btn-default" type="button" disabled>Vendedor</button>
                                </span>
                                <input type="text" class="form-control" disabled value="<?php echo $sale->saleman; ?>" />
                            </div>
                        </div>

                        <div class="col-lg-2">
                            <h4 class="text-right">
                                <span ng-class="total() > 0 ? 'text-success' : 'text-danger'">
                                    {{total() | currency : 'S/ ' : 2}}
                                </span>
                            </h4>
                        </div>
                    </div>

                    <div class="row">
                        <hr class="divider m-b-none m-t-none" />

                        <h4 class="text-center m-b-sm m-t-sm text-primary"><?php echo $sale->voucher; ?> N° <?php echo erp_number_format($sale->serie, $sale->serial_number); ?></h4>

                        <hr class="divider m-b m-t-none" />
                    </div>

                    <div class="row">
                        <div class="col-lg-12">
                            <div class="table-responsive" ng-if="sale.details.length">
                                <table class="table b-t b-light sales-point-table">
                                    <thead>
                                        <tr>
										<?php if (empty($sale->refunded)): ?>
                                            <th width="20">&nbsp;</th>
										<?php endif; ?>
                                            <th>Cód.</th>
                                            <th>Descripción</th>
                                            <th>Talla</th>
                                            <th>Cant.</th>
                                            <th>P.U.</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr ng-repeat="sd in sale.details" ng-init="initDetail(sd)">
                                            <?php if (empty($sale->refunded)): ?>
											<td class="text-center">
                                                <label class="checkbox m-n i-checks">
                                                    <input type="checkbox" style="width: 0; height: 0; position: absolute" name="sale-detail-radio" ng-model="sd.selected" ng-click="selectDetail($event, sd.id)" />
                                                    <i></i>
                                                </label>
                                            </td>
											<?php endif; ?>
                                            <td>{{sd.code}}</td>
                                            <td>
                                                <span ng-if="sd.regime === 'ZOFRA'">D.S. {{sd.output_statement}}<br /></span>
                                                {{sd.product}}
                                            </td>
                                            <td>{{sd.size}}</td>
                                            <td>
                                            <?php if (empty($sale->refunded)): ?>
												<input type="number" ng-disabled="!sd.selected" class="form-control" style="width: 70px" ng-model="getDetailSelected(sd.id, sd).quantity" min="1" max="{{sd.quantity}}" />
											<?php else: ?>
												{{sd.quantity}}
											<?php endif; ?>
											</td>
                                            <td class="text-right">{{sd.price | currency : 'S/ ' : 2}}</td>
                                            <td class="text-right">{{sd.price * getDetailSelected(sd.id, sd).quantity | currency : 'S/ ' : 2}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
							<div class="alert alert-danger alert-block" ng-if="!sale.details.length">
								<button type="button" class="close" data-dismiss="alert">&times;</button>
								<p>No se encontraron detalles para esta venta</p>
							</div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-lg-12 text-center">
							<?php if (empty($sale->refunded)): ?>
                            <button type="submit" class="btn btn-danger" ng-disabled="!sale.selection.length" ng-if="sale.details.length">
								Devolver
								<span ng-if="sale.selection.length">
									({{selectTotal() | currency : 'S/ ' : 2}})
								</span>
							</button>
							<?php endif; ?>
							<a class="btn btn-default" href="#" ng-if="sale.details.length" ng-click="print()">Imprimir</a>
                            <a class="btn btn-default" href="#/sales/operations" ng-bind="sale.details.length ? 'Cancelar' : 'Volver'">Cancelar</a>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    </div>
</section>

<div class="modal fade" id="ticket-modal" data-modal-autofocus=".btn-primary">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header hidden-print">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">Nota de Crédito</h4>
            </div>
            <div class="modal-body wrapper-lg">
                <div class="row">
                    <div class="col-sm-12">
						<erp-voucher-preview
							ng-model="sale.selection"
							data-voucher="NOTA DE CREDITO"
							data-printer="voucherDetail.serialPrinter"
							data-serie="voucherDetail.serie"
							data-origin="{voucher: '<?=$sale->voucher?>', serie: <?=$sale->serie?>, serial_number: <?=$sale->serial_number?>}"
							data-total="selectTotal()"
						></erp-voucher-preview>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" ng-click="saveAndPrint()" data-dismiss="modal">Guardar e imprimir</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div>

<iframe src="about:blank" id="refund-printer" class="hidden-content-"></iframe>
$sale: {{<?=json_encode($sale)?> | json}}<br />
sale.selection: {{sale.selection | json}}<br />
voucherDetail: {{voucherDetail | json}}<br />
sale.info: {{sale.info | json}}<br />
regime: {{regime | json}}<br />
<script>
    angularScope(function ($scope) {
        $scope.sale.details = <?php echo json_encode($details); ?>.extendEach({selected: false});

        $scope.sale.info.customer.type = '<?php echo $sale->customer_type; ?>';
        $scope.sale.info.customer.name = '<?php echo $sale->customer; ?>';
        $scope.sale.info.customer.document = '<?php echo $sale->customer_doc; ?>';
        $scope.sale.info.customer.address = '<?php echo $sale->customer_address; ?>';
        $scope.sale.info.id = '<?php echo $sale->id; ?>';
        $scope.sale.info.serie = '<?=erp_number_format($sale->serie, $sale->serial_number)?>';
        $scope.sale.info.voucher = '<?=$sale->voucher?>';
        $scope.sale.info.date = Date.parse('<?=$sale->sale_date?>'.split(' ').join('T'));
        $scope.sale.info.totalCash = <?=strval($sale->total_cash_amount)?>;
        $scope.sale.info.cash = <?=$sale->cash_amount?>;
        $scope.sale.info.card = <?=strval($sale->credit_card_amount)?>;
        $scope.sale.info.origin.voucher = '<?php echo $sale->origin_voucher; ?>';
        $scope.sale.info.origin.serie = '<?php echo erp_number_format($sale->origin_serie, $sale->origin_serial); ?>';

        $scope.regime = <?=json_encode($regime)?>;

        $scope.voucherDetail.company = <?php echo json_encode($refund_company); ?>;
        $scope.voucherDetail.serialPrinter = <?php echo json_encode($refund_printer); ?>;
        $scope.voucherDetail.serie = <?php echo json_encode(current($refund_serie)); ?>;
        $scope.voucherDetail.branch = <?=json_encode($branch)?>;
    });
</script>
