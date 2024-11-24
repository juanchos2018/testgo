<section class="scrollable wrapper">
	<form ng-submit="submit()" autocomplete="off">
		<div class="row" ng-if="record.type === 'PERSONA'">
            <div class="col-lg-5">
                <div class="form-group">
                    <label>Nombres <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" ng-required="record.type === 'PERSONA'" ng-model="record.name">
                </div>
            </div>
            <div class="col-lg-5">
                <div class="form-group">
                    <label>Apellidos</label>
                    <input type="text" class="form-control" ng-model="record.last_name">
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label>F. nacimiento <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" date-picker data-model="record.born_date" pattern="^\d{2}\/\d{2}\/\d{4}$">
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label>Tipo Doc <sup class="text-danger">*</sup></label>
                    <select class="form-control" ng-model="record.doc_type">
                        <option value="">-- Seleccione --</option>
                        <option value="0">SIN DOM/RUC</option>
                        <option value="1">DNI</option>
                        <option value="4">CE</option>
                        <option value="6">RUC</option>
                        <option value="7">Pasaporte</option>
                        <option value="B">DOC ID PAIS RESI</option>
                    </select>
                </div>
            </div>
            <div class="col-lg-2">
                <div class="form-group">
                    <label>DNI o documento <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" ng-required="record.type === 'PERSONA'" ng-model="record.id_number">
                </div>
            </div>
            <div class="col-lg-2">
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
            --
           <!--  <div class="col-lg-12 m-b-sm">
                <div class="checkbox i-checks">
                    <label>
                        <input type="checkbox" ng-model="saveWithCompany" ng-change="changeSaveWithCompany(saveWithCompany)"><i></i> Emitir {{ voucherType | lowercase }} a nombre de empresa
                    </label>
                </div>
            </div>
            <div ng-show="saveWithCompany" class="col-lg-12 slidedown-anim">
                <div class="row" name="save-with-company-row">
                    <div class="col-lg-4">
                        <div class="form-group">
                            <label>RUC <sup class="text-danger">*</sup></label>
                            <input type="text" class="form-control" ng-model="record.company.id_number" maxlength="11" pattern="\d{11}" ng-required="saveWithCompany">
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="form-group">
                            <label>Razón Social <sup class="text-danger">*</sup></label>
                            <input type="text" class="form-control" ng-model="record.company.name" ng-required="saveWithCompany">
                        </div>
                    </div>
                </div>
            </div>-- -->
        </div>
        <div class="row" ng-if="record.type === 'EMPRESA'">
            <div class="col-lg-2">
                <div class="form-group">
                    <label>Tipo Doc <sup class="text-danger">*</sup></label>
                    <select class="form-control" ng-model="record.doc_type">
                        <option value="">-- Seleccione --</option>
                        <option value="0">SIN DOM/RUC</option>
                        <option value="1">DNI</option>
                        <option value="4">CE</option>
                        <option value="6">RUC</option>
                        <option value="7">Pasaporte</option>
                        <option value="B">DOC ID PAIS RESI</option>
                    </select>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="form-group">
                    <label>RUC <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" ng-required="record.type === 'EMPRESA'" ng-model="record.id_number" maxlength="11" pattern="\d{11}">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label>Razón Social <sup class="text-danger">*</sup></label>
                    <input type="text" class="form-control" ng-required="record.type === 'EMPRESA'" ng-model="record.name">
                </div>
            </div>
            <div class="col-lg-12">
                <div class="form-group">
                    <label>Dirección</label>
                    <input type="text" class="form-control" ng-model="record.address">
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>Correl. interno</label>
                    <input type="text" class="form-control" ng-model="record.barcode_card2" maxlength="5" pattern="\d+">
                </div>
            </div>
            <div class="col-lg-3">
                <div class="form-group">
                    <label>Correl. LFA</label>
                    <input type="text" class="form-control" ng-model="record.nro_inticard" ng-disabled="saveCorrelLoading" pattern="\d+">
                </div>
            </div>
            <div class="col-lg-6">
                <div class="form-group">
                    <label>N° tarjeta LFA</label>
                    <input type="text" class="form-control" ng-model="record.barcode_inticard" maxlength="13" pattern="\d+">
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
                        Guardar
                    </button>
                </div>
            </div>
        </div>
	</form>
</section>

<script>
    angularScope(function ($scope) {
        $scope.record = <?php echo json_encode($record); ?>;
    });
</script>