<section class="scrollable wrapper">
	<div class="row">

        <section class="panel panel-default">
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-12">
                        <p class="pull-left">
                           <!--  <a ng-href="#/subcategories/edit/{{selected[0].id}}" class="btn btn-default" ng-disabled="selected.length !== 1">
                                <i class="fa fa-pencil text"></i>
                                <span class="text">&nbsp;Editar</span>
                            </a> -->
                            <button type="button" class="btn btn-default" ng-disabled="selected.length === 0" ng-click="trash()">
                                <i class="fa fa-trash-o text"></i>
                                <span class="text">
									&nbsp;Enviar a papelera
									<span ng-if="selected.length > 0">({{selected.length}})</span>
								</span>
                            </button>
                        </p>
                        <p class="pull-right">
                            <a href="#/subcategories/add" class="btn btn-success">
                                <i class="fa fa-plus text"></i>
                                <span class="text">&nbsp;Agregar</span>
                            </a>
                            <a href="#/subcategories/trash" class="btn btn-default">
                                <span class="text">&nbsp;Papelera</span>
                            </a>
                        </p>
                    </div>
                    <div class="col-sm-12">
						<?php echo erp_datatable(
							'subcategory in subcategories',
							array(
                                'labels' => array('Descripción','Categoria'),
                                'fields' => array('{{subcategory.description}}','{{subcategory.category}}')
							),
                            'multiple',
							'selected'
						); ?>
                    </div>
                </div>
<!--                <a href="#" ng-click="add()">Aumentar</a>-->

            </div>
        </section>
    </div>
</section>

<script>
    angularScope(function ($scope) {
        var records = <?php echo json_encode($records); ?>;

        if (records) {
            $scope.subcategories = records.extendEach({selected: false});
        }
    });
</script>
