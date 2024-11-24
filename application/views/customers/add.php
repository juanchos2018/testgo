<!-- <section class="scrollable wrapper">

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
                                <td class="v-middle">{{ printer.ticket_serie | lpad : 3 }}</td>
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
 -->

<section class="scrollable wrapper">
    <div class="alert alert-danger alert-dismissible" role="alert" ng-if="saveMessage.length > 0">
        <button type="button" class="close" ng-click="clearSaveMessage()" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        {{ saveMessage }}
    </div>
    <form ng-submit="save()">
        <div class="row" ng-if="record.type === 'PERSONA'">
            <div class="col-lg-2">
                <div class="form-group">
                    <label>Tipo</label>
                    <select class="form-control" ng-model="record.type" ng-change="returnFocus()">
                        <option value="PERSONA">Persona</option>
                        <option value="EMPRESA">Empresa</option>
                    </select>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label>Nombres <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" ng-required="record.type === 'PERSONA'" ng-model="record.name" erp-focus>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label>Apellidos</label>
                    <input type="text" class="form-control" ng-model="record.last_name">
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label>F. nacimiento <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" date-picker data-model="record.born_date" ng-required="record.type === 'PERSONA'" pattern="^\d{2}\/\d{2}\/\d{4}$">
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>DNI o documento <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" ng-required="record.type === 'PERSONA'" ng-model="record.id_number">
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>Sexo <sup class="text-danger">*</sup></label>
                    <select class="form-control" ng-required="record.type === 'PERSONA'" ng-model="record.gender">
                        <option value="">-- Seleccione --</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                    </select>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label>Dirección</label>
                    <input type="text" class="form-control" ng-model="record.address">
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>Departamento o ciudad</label>
                    <input type="text" class="form-control" ng-model="record.city" list="cities-list">
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>País</label>
                    <input type="text" class="form-control" ng-model="record.country" list="countries-list">
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="text" class="form-control" ng-model="record.phone_number">
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>Celular</label>
                    <input type="text" class="form-control" ng-model="record.mobile_phone_number">
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label>Correo electrónico</label>
                    <input type="email" class="form-control" ng-model="record.email">
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label>Facebook</label>
                    <div class="input-group">
                        <span class="input-group-addon">facebook.com/</span>
                        <input type="text" class="form-control" ng-model="record.facebook">
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label>Centro de trabajo</label>
                    <input type="text" class="form-control" ng-model="record.workplace">
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label>Página web</label>
                    <input type="text" class="form-control" ng-model="record.web">
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label>Correl. interno</label>
                    <input type="text" class="form-control" ng-model="record.barcode_card2" maxlength="5" pattern="\d+">
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label>Correl. LFA</label>
                    <input type="text" class="form-control" ng-model="record.nro_inticard" ng-disabled="saveCorrelLoading" pattern="\d+">
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label>N° tarjeta LFA</label>
                    <input type="text" class="form-control" ng-model="record.barcode_inticard" maxlength="13" pattern="\d+">
                </div>
            </div>
            <div class="col-lg-12 m-b-sm">
                <div class="checkbox i-checks">
                    <label>
                        <input type="checkbox" ng-model="hasPartner" ng-change="changeHavingPartner(hasPartner)">
                        <i></i> Establecer asociado
                    </label>
                </div>
            </div>
            <div ng-show="hasPartner" class="col-lg-12 slidedown-anim">
                <div class="row" name="having-partner-row">
                    <div class="col-lg-3">
                        <div class="form-group required">
                            <label class="control-label">DNI</label>
                            <input type="text" class="form-control" ng-model="record.partner.id_number" maxlength="8" pattern="\d{8}" ng-required="hasPartner">
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group required">
                            <label class="control-label">Nombres y apellidos</label>
                            <input type="text" class="form-control" ng-model="record.partner.full_name" ng-required="hasPartner">
                        </div>
                    </div>
                    <div class="col-lg-3">
                        <div class="form-group">
                            <label class="control-label">Relación</label>
                            <input type="text" class="form-control" ng-model="record.partner.relationship">
                        </div>
                    </div>
                </div>
            </div>
                                        
        </div>
        <div class="row" ng-if="record.type === 'EMPRESA'">
            <div class="col-lg-2">
                <div class="form-group">
                    <label>Tipo</label>
                    <select class="form-control" ng-model="record.type" ng-change="returnFocus()">
                        <option value="PERSONA">Persona</option>
                        <option value="EMPRESA">Empresa</option>
                    </select>
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>RUC <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" ng-required="record.type === 'EMPRESA'" ng-model="record.id_number" maxlength="11" pattern="\d{11}">
                </div>
            </div>
            <div class="col-lg-7">
                <div class="form-group">
                    <label>Razón Social <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" ng-required="record.type === 'EMPRESA'" ng-model="record.name">
                </div>
            </div>
            <div class="col-lg-12">
                <div class="form-group">
                    <label>Vincular a cliente registrado</label>
                    <div class="input-group">
                        <input type="text" class="form-control" ng-model="record.customer_id" placeholder="Escanee tarjeta o ingrese N° de documento">
                        <span class="input-group-btn">
                            <button class="btn btn-default" type="button" ng-click="searchPerson($event)">Buscar</button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 text-right">
                <div class="form-group m-t">
                    <a href="#/customers" class="btn btn-default">Cancelar</a>
                    <button type="submit" class="btn btn-primary">
                        Registrar
                    </button>
                </div>
            </div>
        </div>
    </form>
</section>
