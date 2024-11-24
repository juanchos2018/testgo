<section class="scrollable wrapper">
	<div class="row">
        <div class="col-sm-12">
            <a href="#/sunat_tables/add" class="btn btn-primary">
                <i class="fa fa-plus text"></i>
                <span class="text">&nbsp;Agregar</span>
            </a>
        </div>

        <div class="col-lg-12 m-t">
            <div class="table-responsive">
                <table class="table table-bordered table-hover bg-white">
                    <thead>
                        <tr>
                            <th class="text-center">N°</th>
                            <th class="text-center">Descripción</th>
                            <th class="text-center">Elementos</th>
                            <th class="text-center" colspan="3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="row in data">
                            <td width="60ṕx" class="text-center v-middle" ng-bind="row.id"></td>
                            <td class="v-middle" ng-bind="row.description"></td>
                            <td class="v-middle text-center" ng-bind="row.items"></td>
                            <td width="120px" class="text-center v-middle">
                                <a href="#/sunat_tables/{{ row.id }}">Ver detalle</a>
                            </td>
                            <td width="120px" class="text-center v-middle">
                                <a href="#/sunat_tables/edit/{{ row.id }}">Editar</a>
                            </td>
                            <td width="120px" class="text-center v-middle">
                                <a href="#" ng-click="$parent.delete(row)">Eliminar</a>
                            </td>
                        </tr>
                        <tr ng-if="!data.length">
                            <td class="text-center" colspan="6">
                                No se encontraron registros
                            <td>
                        </tr>
                    </tbody>
                </table>
           </div>
        </div>

    </div>
</section>
<script>
	angularScope(['$scope', function ($scope) {
		$scope.data = <?php echo json_encode($data); ?>;
	}]);
</script>