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
                    </div>
                </div>
                <div class="row" ng-if="data.length"> <!-- CUANDO YA SE RECIBIERON DATOS -->
                    <div class="col-lg-12">
                        <button type="button" class="btn btn-default" ng-click="exportExcel()">
                            Exportar a Excel
                        </button>
                        <button type="button" class="btn btn-default" ng-click="exportDBF()">
                            Exportar a DBF
                        </button>
                    </div>
                    <div class="col-lg-12">
                        <erp-simple-grid ng-model="data" data-labels="labels"></erp-simple-grid>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        Fecha: {{date}}
                    </div>
                    <div class="col-lg-12">
                        <erp-date model="date" format="dd/mm/yyyy"></erp-date>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        Fecha: {{select2}}
                        <button class="btn btn-default btn-rounded" type="button" ng-click="fillItems()">Llenar</button>
                    </div>
                    <div class="col-lg-12">
                        <select erp-select2 style="width:100%" data-placeholder="-- Seleccione --" ng-model="select2" ng-options="e.id as e.text for e in items">
                            <option value=""></option>
                        </select>
                    </div>
                </div>
            </div>
        </section>
  </div>
</section>