<section class="scrollable wrapper">
	<div class="row">
    
        <section class="panel panel-default">
            <header class="panel-heading font-bold">
              Registro de ventas - CONCAR
            </header>
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="form-group required">
                            <label class="col-sm-1 control-label">Inicio</label>
                            <div class="col-sm-2">
                                <input type="text" class="form-control" date-picker data-model="reg.startDate" data-format="YYYY-MM-DD">
                            </div>
                            <label class="col-sm-1 control-label">Fin</label>
                            <div class="col-sm-2">
                                <input type="text" class="form-control" date-picker data-model="reg.endDate" data-format="YYYY-MM-DD">
                            </div>
                        </div>
                        <div class="col-sm-4 col-sm-offset-2">
                          <button type="submit" class="btn btn-primary" ng-click="getData()"><i class="fa fa-book"></i> Cargar ventas</button>
                          <button type="submit" class="btn btn-primary" ng-click="getDetailData()"><i class="fa fa-book"></i> Cargar detalle</button>
                        </div>
                    </div>
                </div>
                
                <section class="panel panel-default">
                    <header class="panel-heading bg-light">
                      <span class="hidden-sm">Datos</span>
                    </header>
                    <div class="panel-body">
                      <div class="tab-content">   

                        <div class="tab-pane active" id="messages-1">
                            <div class="row" ng-if="data.length"> <!-- CUANDO YA SE RECIBIERON DATOS -->
                                <div class="col-lg-12">
                                   <!--  <button type="button" class="btn btn-default" ng-click="exportExcel()">
                                        <i class="i i-file-excel "></i> Exportar a Excel
                                    </button> -->
                                    <button type="button" class="btn btn-default" ng-click="exportDBF(filename)">
                                        <i class="i  i-data"></i> Exportar a DBF
                                    </button>
                                </div>
                                <div class="col-lg-12">
                                    <erp-simple-grid ng-model="data" data-labels="labels"></erp-simple-grid>
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </section>
            </div>
        </section>
    </div>
</section>