<section class="scrollable wrapper">
	<div class="row">
  
        <form class="form-horizontal" ng-submit="submit()" autocomplete="off">
          <section class="panel panel-default">
              <div class="panel-body">
                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Empresa</label>
                      <div class="col-sm-2">
                        <select class="form-control" ng-model="record.company_id" ng-options="company.id as company.text for company in companies" ng-change="record.branch_id = ''">
                          <option value="">-- Todas --</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group required" ng-if="record.company_id">
                      <label class="col-sm-2 control-label">Sucursal</label>
                      <div class="col-sm-2">
                        <select class="form-control" ng-model="record.branch_id" ng-options="branch.id as branch.text for branch in getBranches(record.company_id)">
                          <option value="">-- Todas --</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Descripción</label>
                      <div class="col-sm-8">
                          <input type="text" class="form-control" ng-model="record.description" />
                      </div>
                    </div>
                    
                    <div class="line line-dashed b-b line-lg pull-in"></div>
                    
                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Dirección MAC</label>
                      <div class="col-sm-4">
                        <input type="text" class="form-control" ng-model="record.address" />
                          <span class="help-block m-b-none">Formato XX-XX-XX-XX-XX-XX</span>
                      </div>
                    </div>
                    
                    <div class="line line-dashed b-b line-lg pull-in"></div>
                    
                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Serie de Ticketera</label>
                      <div class="col-sm-4">
                        <input type="text" class="form-control" ng-model="record.printer_serial" />
                      </div>
                    </div>
                    
                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="col-sm-4 col-sm-offset-2">
                      <a href="#/sale_points" class="btn btn-default">Cancelar</a>
                      <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>

              </div>
          </section>

        </form>
    </div>
</section>

<script>
/*    angularScope(function ($scope) {
        $scope.companies = <?php echo json_encode($companies); ?>;
        $scope.branches = <?php echo json_encode($branches); ?>;

    <?php if (isset($record)): ?>
        $scope.record = <?php echo json_encode($record); ?>;
        $scope.record.address = atob($scope.record.address);
    <?php endif; ?>
    });*/
</script>