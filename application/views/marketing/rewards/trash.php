<section class="scrollable wrapper">
	<div class="row">

        <section class="panel panel-default">
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-12">
                        <p class="pull-left">
                            <button type="button" class="btn btn-default" ng-disabled="selected.length === 0" ng-click="restore()">
                                <i class="fa fa-refresh text"></i>
                                <span class="text">
                                    &nbsp;Restaurar
                                    <span ng-if="selected.length > 0">({{selected.length}})</span>
                                </span>
                            </button>
                            <button type="button" class="btn btn-danger" ng-disabled="selected.length === 0" ng-click="delete()">
                                <i class="fa fa-times text"></i>
                                <span class="text">
                                    &nbsp;Eliminar
                                    <span ng-if="selected.length > 0">({{selected.length}})</span>
                                </span>
                            </button>
                        </p>
                        <p class="pull-right">
                            <a href="#/rewards" class="btn btn-default">
                                <span class="text">&nbsp;Volver</span>
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