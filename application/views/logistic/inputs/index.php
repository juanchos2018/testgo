<section class="scrollable wrapper">
	<div class="row">

        <section class="panel panel-default">
            <div class="panel-body">
                <div class="row">
                    <div class="col-sm-12">
                        <p class="pull-left">
                            <a ng-href="#/users/edit/{{selected[0].id}}" class="btn btn-default" ng-disabled="selected.length !== 1">
                                <i class="fa fa-pencil text"></i>
                                <span class="text">&nbsp;Editar</span>
                            </a>
                            <a ng-href="#/users/password/{{selected[0].id}}" class="btn btn-default" ng-disabled="selected.length !== 1">
                                <i class="fa fa-lock text"></i>
                                <span class="text">&nbsp;Cambiar contraseña</span>
                            </a>
                            <button type="button" class="btn btn-default" ng-disabled="selected.length === 0">
                                <i class="fa fa-times text"></i>
                                <span class="text">
									&nbsp;Eliminar
									<span ng-if="selected.length > 0">({{selected.length}})</span>
								</span>
                            </button>
                        </p>
                        <p class="pull-right">
                            <a href="#/input/add" class="btn btn-success">
                                <i class="fa fa-plus text"></i>
                                <span class="text">&nbsp;Nuevo</span>
                            </a>
                            <a href="#/users/trash" class="btn btn-default">
                                <i class="fa fa-trash-o text"></i>
                                <span class="text">&nbsp;Papelera</span>
                            </a>
                        </p>
                    </div>
                    <div class="col-sm-12">
						<?php echo erp_datatable(
							'user in users',
							array(
                                'labels' => array('Nro Ing', 'Tipo Ingreso', 'Tipo Doc', 'Nro Doc','Fecha'),
                                'fields' => array('{{user.full_name}}', '{{user.username}}', '<a ng-href="mailto:{{user.email}}">{{user.email}}</a>', '{{user.username}}')
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

