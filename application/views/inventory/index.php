<section class="wrapper">
    <form class="m-b-lg" ng-submit="generate()" autocomplete="off">
        <div class="row">
            <div class="col-sm-8 col-md-4">
                <div class="form-group">
                    <label>Tipo</label>
                    <select ng-model="type" class="form-control" ng-options="t.id as t.text for t in types" disabled>
                        <option value="">- Seleccione -</option>
                    </select>
                </div>
            </div>
            <div class="col-sm-4 col-md-2">
                <div class="form-group">
                    <label class="required">Empresa</label>
                    <erp-company-chooser class="form-control" ng-model="company" ng-disabled="loading" required>
                    </erp-company-chooser>
                </div>
            </div>

            <div erp-branch-multi-chooser
                data-labels="['Sucursal']"
                data-class-names="['col-sm-2', 'col-sm-4']"
                data-model="branches"
                data-custom-disabled="true"
                data-form-group-class="true"
                data-disabled="loading"
            ></div>
        </div>
            
        <div class="row">
            <div class="col-sm-2">
                <div class="form-group">
                    <label>Período</label>
                    <select ng-model="period" class="form-control" ng-options="p.id as p.text for p in periods" ng-disabled="loading">
                    </select>
                </div>
            </div>

            <div class="col-sm-2" ng-if="period === 0">
                <div class="form-group">
                    <label class="required">Desde</label>
                    <input type="text" date-picker required data-model="startDate" class="form-control text-center" ng-disabled="loading">
                </div>
            </div>

            <div class="col-sm-2" ng-if="period === 0">
                <div class="form-group">
                    <label class="required">Hasta</label>
                    <input type="text" date-picker required data-model="endDate" class="form-control text-center" ng-disabled="loading">
                </div>
            </div>

            <div class="col-sm-2" ng-if="period === 1">
                <div class="form-group">
                    <label>Mes</label>
                    <erp-month-chooser ng-model="$parent.month" class="form-control" show-empty="false" ng-disabled="loading">
                    </erp-month-chooser>
                </div>
            </div>

            <div class="col-sm-2" ng-if="period === 1 || period === 2">
                <div class="form-group">
                    <label class="required">Año</label>
                    <input type="number" required ng-model="$parent.year" class="form-control text-center" min="2000" max="3000" ng-disabled="loading">
                </div>
            </div>

            <div class="col-sm-8 col-md-4">
                <div class="form-group">
                    <label>Salida</label>
                    <select ng-model="output" class="form-control" ng-options="o.id as o.text for o in outputs" disabled>
                        <option value="">- Seleccione -</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 text-center m-t-lg">
                <button type="submit" class="btn btn-primary" ng-disabled="loading">Generar inventario</button>
            </div>
        </div>
        
        <div class="row" ng-if="loading">
            <div class="col-lg-12 m-t-lg text-center">
                <div class="inline">
                    <div easy-pie-chart data-percent="0" data-line-width="10" data-track-color="#eee" data-bar-color="#1ccc88" data-scale-color="#fff" data-size="188" data-line-cap='butt'>
                        <div>
                            <span class="h3 step">{{ percent | number : 0 }}%</span>
                        </div>
                    </div>

                    <h4><small>{{ loadingMessage }}</small></h4>
                </div>
            </div>
        </div>
    </form>
</section>

<script>
    angularScope(['$scope', function ($scope) {
        $scope.setSunatTables(<?php echo json_encode($sunat_tables); ?>);
    }]);
</script>
