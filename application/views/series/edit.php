<section class="scrollable wrapper">

    <form class="form-horizontal" ng-submit="submit()" autocomplete="off">
        <div class="col-sm-6">
            <div class="form-group required">
                <label class="col-sm-4 control-label">Empresa</label>
                <div class="col-sm-5">
                    <select class="form-control" ng-readonly="record.voucher === 'TICKET'" ng-model="record.company_id" ng-options="c.id as c.text for c in companies" required>
                        <option value="">- Seleccione -</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="col-sm-6">
            <div class="form-group required">
                <label class="col-sm-4 control-label">Tipo de voucher</label>
                <div class="col-sm-5">
                    <select ng-if="record.voucher !== 'TICKET'" class="form-control" ng-model="record.voucher" ng-options="v as v for v in vouchers" required>
                        <option value="">- Seleccione -</option>
                    </select>
                    <input ng-if="record.voucher === 'TICKET'" class="form-control" readonly value="TICKET">
                </div>
            </div>
        </div>

        <div class="col-sm-6">
            <div class="form-group required">
                <label class="col-sm-4 control-label">N° de serie</label>
                <div class="col-sm-3">
                    <input class="form-control text-right" type="number" min="1" ng-model="record.serie" required>
                </div>
            </div>
        </div>

        <div class="col-sm-6">
            <div class="form-group required">
                <label class="col-sm-4 control-label">N° correlativo</label>
                <div class="col-sm-3">
                    <input class="form-control text-right" type="number" min="1" ng-model="record.serial_number" required>
                </div>
            </div>
        </div>

        <div class="col-sm-6">
            <div class="form-group">
                <label class="col-sm-4 control-label">Subdiario</label>
                <div class="col-sm-3">
                    <input class="form-control" ng-model="record.subsidiary_journal">
                </div>
            </div>
        </div>

        <div class="col-sm-6" ng-if="record.voucher === 'BOLETA' || record.voucher === 'FACTURA'">
            <div class="form-group required">
                <label class="col-sm-4 control-label">Régimen</label>
                <div class="col-sm-4">
                    <erp-regime-chooser
                        class="form-control"
                        ng-model="record.regime"
                        ng-required="record.voucher === 'BOLETA' || record.voucher === 'FACTURA'"
                    ></erp-regime-chooser>
                </div>
            </div>
        </div>

        <div class="col-sm-6" ng-if="record.voucher === 'NOTA DE CREDITO'">
            <div class="form-group">
                <div class="col-lg-8 col-sm-offset-4">
                    <div class="checkbox i-checks">
                        <label>
                            <input type="checkbox" ng-model="record.byTicketPrinter"><i></i> Emitido por ticketera
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-lg-12 text-center m-t">
            <a href="#/series" class="btn btn-default">Cancelar</a>
            <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
    </form>
</section>

<script>
    angularScope(function ($scope) {
        $scope.companies = <?php echo json_encode($companies); ?>;
        $scope.record = <?php echo json_encode($record); ?>;

        $scope.record.serie = parseInt($scope.record.serie);
        $scope.record.serial_number = parseInt($scope.record.serial_number);
        $scope.record.byTicketPrinter = ($scope.record.by_ticket_printer == 't');

        if ($scope.record.voucher === 'TICKET') {
            $scope.showTicketMessage();
        }
    });
</script>
