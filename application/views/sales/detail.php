<form ng-submit="edit()">
    <section class="scrollable wrapper">
        <div class="row text-center m-b-md">
            <h3 class="m-t-none" ng-bind="(sale.voucher.indexOf('NOTA DE CREDITO') >= 0 ? 'Nota de Crédito' : sale.voucher | capitalize) + ' N° ' + (sale.serie | lpad : 4) + '-' + (sale.serial_number | lpad : 7)">
            </h3>
            <h4 ng-if="sale.sale_point_id" ng-bind=" 'Emitido' + ' en ' + sale.sale_point">
            </h4>
        </div>

        <div class="row">
            <div ng-class="{ 'col-lg-6': sale.voucher.indexOf('BOLETA') >= 0, 'col-lg-9': sale.voucher.indexOf('BOLETA') < 0 }">
                <div class="input-group m-b">
                    <span class="input-group-btn">
                        <button class="btn btn-default" disabled>
                            Cliente
                        </button>
                    </span>
                    <input type="text" class="form-control" ng-model="sale.customer" readonly tabindex="-1">
                    <span class="input-group-btn" ng-if="sale.verified === 't'">
                        <button disabled class="btn btn-success" type="button" data-tooltip title="Cliente con descuento">
                            <i class="fa fa-check"></i>
                        </button>
                    </span>
                </div>
            </div>

            <div class="col-lg-3">
                <div class="input-group m-b">
                    <span class="input-group-addon">Fecha</span>
                    <input type="text" class="form-control text-center" ng-value="sale.sale_date | pgDate | date : 'dd/MM/yyyy'" readonly tabindex="-1">
                </div>
            </div>

            <div class="col-lg-3">
                <div class="input-group m-b">
                    <span class="input-group-addon">Hora</span>
                    <input type="text" class="form-control text-center" ng-value="sale.sale_date | pgDate | date : 'HH:mm:ss'" readonly tabindex="-1">
                    <span class="input-group-addon">hrs.</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-6">
                <div class="input-group m-b">
                    <span class="input-group-addon">Registrado por</span>
                    <input type="text" class="form-control" ng-model="sale.cashier" readonly tabindex="-1">
                </div>
            </div>

            <div class="col-lg-6">
                <div class="input-group m-b">
                    <span class="input-group-btn">
                        <button class="btn btn-default" disabled>
                            Vendedor
                        </button>
                    </span>
                    <input type="text" class="form-control" ng-value="sale.salesman_id ? (sale.salesman_id | lpad : 4) + ' - ' + sale.saleman : ''" readonly tabindex="-1">
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <h4>Detalle de venta</h4>
                <div class="table-responsive panel panel-default">
                    <table class="table b-t b-light sales-point-table" ng-class="{ 'table-hover': (formState === formStates.DETALLE) }">
                        <thead ng-if="sale.sale_details.length">
                            <tr>
                                <th>Cód.</th>
                                <th>Descripción</th>
                                <th>Talla</th>
                                <th>Régimen</th>
                                <th>Empresa</th>
                                <th>Cant.</th>
                                <th ng-if="sale.refunded_sale_details.length">Dev.</th>
                                <th>P.U.</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="detail in sale.sale_details">
                                <td>{{detail.code}}</td>
                                <td>
                                    <span ng-if="detail.regime === 'ZOFRA'">D.S. {{detail.output_statement}}<br /></span>
                                    {{detail.product}}
                                </td>
                                <td>{{ detail.size }}</td>
                                <td>{{ detail.regime }}</td>
                                <td>{{ $parent.sale.company }}</td>
                                <td class="text-center">
                                    {{ detail.quantity }}
                                </td>
                                <td class="text-center" ng-class="{ 'text-danger' : detail.refunded_quantity }" ng-if="sale.refunded_sale_details.length">
                                    {{ detail.refunded_quantity || '-' }}
                                </td>
                                <td class="text-right">
                                    {{ detail.price | currency : 'S/ ' : 2 }}
                                </td>
                                <td class="text-right">
                                    {{ subTotal(detail) | currency : 'S/ ' : 2 }}
                                </td>
                            </tr>
                        </tbody>
                        <tfoot ng-if="sale.sale_details.length">
                            <tr>
                                <td class="text-right" colspan="7">
                                    <strong>TOTAL</strong>
                                </td>
                                <td class="text-right">
                                    <span ng-class="{ 'text-danger': total() < 0, 'text-primary': total() }">
                                        {{ sale.total_amount | currency : 'S/ ' : 2 }}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        <div class="row m-b m-t-none">
            <div class="col-sm-6 text-left">
                <a href="#/sales/operations" class="btn btn-default btn-block-xs m-t-sm">
                    Volver
                </a>
                <!-- <a href="#" ng-click="print()" class="btn btn-default btn-block-xs m-t-sm" ng-if="sale.voucher === 'TICKET' || sale.voucher === 'TICKET NOTA DE CREDITO'"> -->
                <a href="#" ng-click="print()" class="btn btn-default btn-block-xs m-t-sm">
                    Imprimir
                </a>
                <!-- <a href="#" ng-click="edit()" class="btn btn-default btn-block-xs m-t-sm" ng-if="sale.voucher === 'BOLETA' || sale.voucher === 'FACTURA' || sale.voucher === 'NOTA DE CREDITO'"> -->
                <a href="#" ng-click="edit()" class="btn btn-default btn-block-xs m-t-sm">
                    Editar
                </a>
            </div>
            <div class="col-sm-6 text-right">
                <a href="#" ng-if="sale.voucher.indexOf('NOTA DE CREDITO') < 0 && sale.refund_count" ng-click="showRefunds()" class="btn btn-default btn-block-xs m-t-sm">
                    Ver devoluciones ({{ sale.refund_count }})
                </a>
                <!-- OJO: falta verificar si ya se devolvieron todos los productos -->
                <button ng-click="refund()" href="#" ng-if="sale.voucher !== 'NOTA DE CREDITO' && sale.voucher !== 'TICKET NOTA DE CREDITO'" type="button" class="btn btn-default btn-block-xs m-t-sm" ng-disabled="!sale.sale_details.length || (sale.refund_count && !countAvailableForRefund())">
                    Hacer devolución
                </button>
                <a href="#" ng-click="invalidate()" class="btn btn-danger btn-block-xs m-t-sm">
                    Anular
                </a>
            </div>
        </div>
    </section>
</form>

<!--pre>{{ countAvailableForRefund() | json }}</pre>
<pre>{{ sale.refunded_sale_details | json }}</pre>
<pre>{{ sale.sale_details | json }}</pre-->

<script>
    angularScope(function ($scope) {
        $scope.salePoints = <?php echo json_encode($sale_points); ?>;

        //$scope.exchangeRates = <-?php echo json_encode($exchange_rates); ?->;
        $scope.cardTypes = <?php echo json_encode($card_types); ?>;
        $scope.taxes = <?php echo json_encode($taxes); ?>;
        $scope.serie = <?php echo json_encode($serie); ?>;

        $scope.sale = <?php echo json_encode($sale); ?>;
        $scope.sale.sale_details = <?php echo json_encode($sale_details); ?>;
        $scope.sale.credit_cards = <?php echo json_encode($sale_cards); ?>;
        $scope.sale.refunded_sale_details = <?php echo json_encode($refunded_sale_details); ?>;

        $scope.initCurrentSalePoint();
    });
</script>
