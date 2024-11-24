<section class="scrollable wrapper">

    <form class="form-horizontal" ng-submit="submit()" autocomplete="off">
        <div class="form-group required">
            <label class="col-sm-2 control-label">Descripción</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" ng-model="record.description" maxlength="50" required />
            </div>
        </div>

        <div class="form-group">
            <label class="col-sm-2 control-label">Activo</label>
            <div class="col-sm-10">
                <label class="switch">
                    <input type="checkbox" ng-model="record.active">
                    <span></span>
                </label>
            </div>
        </div>

        <div class="form-group required">
            <label class="col-sm-2 control-label">Ticketeras</label>
        </div>

        <div class="form-group">
            <div class="col-sm-12">
                <div class="table-responsive">
                    <table class="table table-bordered bg-white">
                        <thead>
                            <tr>
                                <th rowspan="2" class="text-center v-middle">N°</th>
                                <th rowspan="2" class="text-center v-middle">Empresa</th>
                                <th class="text-center" colspan="2">Impresora ticketera</th>
                                <th class="text-center" colspan="2">Tickets generados</th>
                                <th rowspan="2">&nbsp;</th>
                            </tr>
                            <tr>
                                <th class="text-center" style="width: 180px">N° de serie</th>
                                <th class="text-center">Nombre</th>
                                <th class="text-center" style="width: 90px">Serie</th>
                                <th class="text-center" style="width: 180px">Correlativo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="printer in record.printers">
                                <td class="text-center v-middle">{{ $index + 1 }}</td>
                                <td class="v-middle">{{ printer.company_name }}</td>
                                <td class="v-middle">{{ printer.printer_serial }}</td>
                                <td class="v-middle">{{ printer.printer_name }}</td>
                                <td class="v-middle">{{ printer.ticket_serie | lpad : 4 }}</td>
                                <td class="v-middle">{{ printer.ticket_serial | lpad : 7 }}</td>
                                <td class="text-center v-middle">
                                    <a href="#" ng-click="removeTicketPrinter($index)">
                                        Remover
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-center v-middle">
                                    <span ng-show="companies.length">{{ record.printers.length + 1 }}</span>
                                </td>
                                <td class="v-middle">
                                    <select name="company_id" erp-trigger-click="button[name='add']" class="form-control" ng-options="c.id as c.text for c in companies | orderBy : 'text'" ng-model="newTicketPrinter.company_id" ng-disabled="!companies.length" ng-required="!record.printers.length">
                                        <option value="">-- Seleccione --</option>
                                    </select>
                                </td>
                                <td class="v-middle">
                                    <input type="text" erp-trigger-click="button[name='add']" name="printer_serial" class="form-control" ng-model="newTicketPrinter.printer_serial" ng-disabled="!companies.length" ng-required="!record.printers.length" />
                                </td>
                                <td class="v-middle">
                                    <input type="text" erp-trigger-click="button[name='add']" name="printer_name" class="form-control" ng-model="newTicketPrinter.printer_name" ng-disabled="!companies.length" ng-required="!record.printers.length" />
                                </td>
                                <td class="v-middle">
                                    <input type="text" erp-trigger-click="button[name='add']" name="ticket_serie" class="form-control" ng-model="newTicketPrinter.ticket_serie" ng-disabled="!companies.length" ng-required="!record.printers.length" />
                                </td>
                                <td class="v-middle">
                                    <input type="text" erp-trigger-click="button[name='add']" name="ticket_serial" class="form-control" ng-model="newTicketPrinter.ticket_serial" ng-disabled="!companies.length" ng-required="!record.printers.length" />
                                </td>
                                <td class="text-center v-middle">
                                    <button type="button" name="add" class="btn btn-success" ng-click="addTicketPrinter()" ng-show="companies.length">
                                        Agregar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="form-group">
            <div class="col-sm-6 col-sm-offset-2">
                <a href="#/sale_points" class="btn btn-default">Cancelar</a>
                <button type="submit" class="btn btn-primary">Guardar</button>
            </div>
        </div>

    </form>

</section>

<script>
    angularScope(function ($scope) {
        $scope.companies = <?php echo json_encode($companies); ?>;
    });
</script>