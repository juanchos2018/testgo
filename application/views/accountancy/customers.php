<section class="scrollable wrapper">
    <div class="row">
        
        <section class="panel panel-default">
            <header class="panel-heading font-bold">
              Clientes - CONCAR
            </header>
            <div class="panel-body">
                <div class="row" ng-if="!data.length"> <!-- CUANDO NO HAY DATOS -->
                    <div class="col-lg-12">
                        <button type="button" class="btn btn-default btn-rounded" ng-click="getData()">
                            Obtener datos
                        </button>
                        <a href="#" class="btn btn-default" ng-click="getData()">
                        <i class="fa fa-book"></i> Registro de Venta</a>
                    </div>
                </div>

                <div class="row" ng-if="data.length"> <!-- CUANDO YA SE RECIBIERON DATOS -->
                    <div class="col-lg-12">
                        <button type="button" class="btn btn-default" ng-click="exportExcel()">
                            <i class="i i-file-excel "></i> Exportar a Excel
                        </button>
                        <button type="button" class="btn btn-default" ng-click="exportDBF()">
                            <i class="i  i-data"></i> Exportar a DBF
                        </button>
                    </div>
                    <div class="col-lg-12">
                        <erp-simple-grid ng-model="data" data-labels="labels"></erp-simple-grid>
                    </div>
                </div>
            </div>
        </section>
  </div>
</section>