<section class="scrollable wrapper">
    <div class="row">

        <section class="panel panel-default">
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-12">
                        <p class="pull-left">
                            <a ng-href="#/rewards/edit/{{selected[0].id}}" class="btn btn-default" ng-disabled="selected.length !== 1">
                                <i class="fa fa-pencil text"></i>
                                <span class="text">&nbsp;Editar</span>
                            </a>
                            <button type="button" class="btn btn-default" ng-disabled="selected.length === 0" ng-click="trash()">
                                <i class="fa fa-trash-o text"></i>
                                <span class="text">
                                    &nbsp;Enviar a papelera
                                    <span ng-if="selected.length > 0">({{selected.length}})</span>
                                </span>
                            </button>
                        </p>
                        <p class="pull-right">
                            <a href="#/rewards/add" class="btn btn-success">
                                <i class="fa fa-plus text"></i>
                                <span class="text">&nbsp;Agregar</span>
                            </a>
                            <a href="#/rewards/trash" class="btn btn-default">
                                <span class="text">&nbsp;Papelera</span>
                            </a>
                        </p>
                    </div>
                    <div class="col-sm-12">
                        <?php echo erp_datatable(
                            'reward in rewards',
                            array(
                                'labels' => array('Descripción','Abreviacion','Compañia','Puntos Requeridos', 'Puntos por S/1', 'Puntos para Voucher', 'Valor del voucher','Voucher Cumpleaños'),
                                'fields' => array('{{reward.description}}', '{{reward.abbrev}}','{{reward.company}}', '{{reward.min_points}}','{{reward.earn_points}}', '{{reward.points_to_voucher}}', '{{reward.voucher_amount}}', '{{reward.voucher_birthday}}')
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
            $scope.rewards = records.extendEach({selected: false});
        }
    });
</script>
