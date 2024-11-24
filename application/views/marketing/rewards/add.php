<section class="scrollable wrapper">
  <div class="row">

        <form class="form-horizontal" ng-submit="submit()" autocomplete="off">
            <section class="panel panel-default">
                <header class="panel-heading font-bold">
                  Configuración de Puntos
                </header>
                <div class="panel-body">

                     <div class="form-group required">
                      <label class="col-sm-2 control-label">Empresa</label>
                      <div class="col-sm-2">
                        <select class="form-control" ng-model="record.company_id" ng-options="company.company_id as company.company_name for company in companies">
                          <option value="">-- Todas --</option>
                        </select>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Nombre</label>
                      <div class="col-sm-8">
                         <input type="text" class="form-control" required  ng-model="record.description" />
                        <span class="help-block m-b-none">Nombre del Programa del Puntos</span>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Abreviacion</label>
                      <div class="col-sm-8">
                         <input type="text" class="form-control" required  ng-model="record.abbrev" />
                        <span class="help-block m-b-none">Nombre Corto para operaciones</span>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>


                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Datos del Programa de Puntos</label>
                      <div class="col-sm-8">
                        <div class="row">
                        
                          <div class="col-xs-4">
                            <input type="text" class="form-control" required  ng-model="record.min_points" />
                            <span class="help-block m-b-none">Minimo de Puntos Requerido</span>
                          </div>

                           <div class="col-xs-4">
                            <input type="text" class="form-control" required  ng-model="record.earn_points" />
                            <span class="help-block m-b-none">Cantidad de puntos otorgados por un sol</span>
                          </div>
                          
                        </div>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Datos de Premios Voucher</label>
                      <div class="col-lg-6">
                      <div class="row">
                        
                        <div class="col-xs-4">
                            <input type="text" class="form-control" required  ng-model="record.points_to_voucher" />
                            <span class="help-block m-b-none">Puntos para Voucher</span>
                        </div>

                        <div class="col-xs-4">
                            <div class="input-group m-b">
                              <span class="input-group-addon">S/</span>
                              <input type="text" class="form-control" required  ng-model="record.voucher_amount" />
                              <span class="input-group-addon">.00</span>
                            </div>
                            <span class="help-block m-b-none">Monto del Voucher</span>
                        </div>

                         <div class="col-xs-4">
                            <div class="input-group m-b">
                              <span class="input-group-addon">S/</span>
                              <input type="text" class="form-control" required  ng-model="record.voucher_birthday" />
                              <span class="input-group-addon">.00</span>
                            </div>
                            <span class="help-block m-b-none">Monto del Voucher del Cumpleaños</span>
                        </div>
                        
                      </div>
                    </div>
                    </div>
               
                </div>
            </section>

            <!-- <section class="panel panel-default">
                <header class="panel-heading font-bold">
                  Datos de Voucher
                </header>
                <div class="panel-body">

                    <div ng-class="unavailable_usernames.indexOf(reward.username) > -1 ? ['form-group', 'required', 'has-error'] : 'form-group required'">
                      <label class="col-sm-2 control-label">Tiempo de duración del Voucher</label>
                      <div class="col-sm-10">
                        <div class="row">
                          <div class="col-md-6">
                            <input type="text" class="form-control" id="new-username" required  ng-model="reward.username" />
                            <span class="help-block m-b-none text-danger" ng-if="unavailable_usernames.indexOf(reward.username) > -1">Este nombre de usuario no está disponible</span>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </section> -->
            
            <div class="form-group">
              <div class="col-sm-4 col-sm-offset-2">
                <a href="#/rewards" class="btn btn-default">Cancelar</a>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </div>
        </form>
    </div>
</section>

