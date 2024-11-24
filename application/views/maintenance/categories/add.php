<section class="scrollable wrapper">
	<div class="row">
  
        <form class="form-horizontal" ng-submit="submit()" autocomplete="off">
          <section class="panel panel-default">
              <div class="panel-body">
                    
                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Descripción</label>
                      <div class="col-sm-8">
                          <input type="text" class="form-control" ng-model="record.description" />
                      </div>
                    </div>
                    
                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Imagen</label>
                      <div class="col-sm-8">
                          <input type="text" class="form-control" ng-model="record.image" />
                      </div>
                    </div>

                    <div class="col-sm-4 col-sm-offset-2">
                      <a href="#/categories" class="btn btn-default">Cancelar</a>
                      <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>

              </div>
          </section>

        </form>
    </div>
</section>
<script>
    angularScope(function ($scope) {

    <?php if (isset($record)): ?>
        $scope.record = <?php echo json_encode($record); ?>;
    <?php endif; ?>
    });
</script>