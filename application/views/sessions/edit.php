<section class="scrollable wrapper">
	<div class="row">
        <ul class="breadcrumb">
            <li><a href="#/users"><i class="fa fa-user"></i> Usuarios</a></li>
            <li class="active">Editar</li>
        </ul>

        <form class="form-horizontal" ng-submit="save()" autocomplete="off">
            <section class="panel panel-default">
                <header class="panel-heading font-bold">
                  Datos Personales
                </header>
                <div class="panel-body">
                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Empleado</label>
                      <div class="col-sm-8">
                          <div class="input-group">
                              <select id="new-employee" erp-select2 style="width:100%" data-placeholder="-- Seleccione --" ng-model="user.employee_id" ng-options="e.id as e.text for e in employees">
                                <option value=""></option>
                              </select>
                            <div class="input-group-btn">
                                <a href="#/employees/add" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Nuevo empleado" data-modal="#new-employee-modal">
                                    <i class="fa fa-plus text"></i>
                                </a>
                            </div>
                          </div>
                        <span class="help-block m-b-none">Solo se muestran empleados a los que no se les ha asignado un usuario</span>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group">
                      <label class="col-sm-2 control-label">Correo electrónico</label>
                      <div class="col-sm-10">
                        <div class="row">
                          <div class="col-md-6">
                            <input type="email" class="form-control" id="new-email" ng-model="user.email" />
                          </div>
                        </div>
                      </div>
                    </div>


                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group required">
                      <label class="col-sm-2 control-label">Cargo</label>
                      <div class="col-sm-4">
                          <div class="input-group">
                            <select class="form-control m-b" ng-model="user.role_id" ng-options="role.id as role.text for role in roles" required>
                              <option value="">-- Seleccione --</option>
                            </select>
                            <div class="input-group-btn">
                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Nuevo cargo" data-modal="#new-role-modal">
                                    <i class="fa fa-plus text"></i>
                                </button>
                            </div>
                          </div>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group">
                      <label class="col-sm-2 control-label">Empresa</label>
                      <div class="col-sm-2">
                        <select class="form-control m-b" ng-model="user.company_id" ng-options="company.id as company.text for company in companies" ng-change="user.branch_id = ''">
                          <option value="">-- Todas --</option>
                        </select>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group" ng-if="user.company_id">
                      <label class="col-sm-2 control-label">Sucursal</label>
                      <div class="col-sm-2">
                        <select class="form-control" ng-model="user.branch_id" ng-options="branch.id as branch.text for branch in getBranches(user.company_id)">
                          <option value="">-- Todas --</option>
                        </select>
                      </div>
                    </div>
                </div>
            </section>

            <section class="panel panel-default">
                <header class="panel-heading font-bold">
                  Datos de Usuario
                </header>
                <div class="panel-body">

                    <div ng-class="unavailable_usernames.indexOf(user.username) > -1 ? ['form-group', 'required', 'has-error'] : 'form-group required'">
                      <label class="col-sm-2 control-label">Nombre de usuario</label>
                      <div class="col-sm-10">
                        <div class="row">
                          <div class="col-md-6">
                            <input type="text" class="form-control" id="new-username" required  ng-model="user.username" />
                            <span class="help-block m-b-none text-danger" ng-if="unavailable_usernames.indexOf(user.username) > -1">Este nombre de usuario no está disponible</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>

                    <div class="form-group">
                      <label class="col-sm-2 control-label">Avatar</label>
                      <div class="col-sm-10">
                        <div class="row">
                          <div class="col-md-12">
                            <erp-avatar data-avatar="user.avatar" data-mode="user.avatar_mode" data-file="user.avatar_file"></erp-avatar>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="line line-dashed b-b line-lg pull-in"></div>

                </div>
            </section>

            <div class="form-group">
              <div class="col-sm-4 col-sm-offset-2">
                <a href="#/users" class="btn btn-default">Cancelar</a>
                <button type="submit" class="btn btn-primary">Guardar</button>
              </div>
            </div>
        </form>
    </div>
</section>

<div class="modal fade" id="new-employee-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body wrapper-lg">
          <div class="row">
            <div class="col-sm-12">
              <h3 class="m-t-none m-b">Nuevo empleado</h3>
              <form role="form" ng-submit="saveEmployee()">
                <div class="form-group">
                  <label>Nombres</label>
                  <input type="text" ng-model="employee.name" class="form-control" required />
                </div>
                <div class="form-group">
                  <label>Apellidos</label>
                  <input type="text" ng-model="employee.last_name" class="form-control" required />
                </div>
                <div class="m-t-lg text-right">
                    <button type="button" data-dismiss="modal" class="btn btn-default">Cancelar</button>
                  <button type="submit" class="btn btn-primary text-uc"><strong>Aceptar</strong></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div>

<div class="modal fade" id="new-role-modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body wrapper-lg">
          <div class="row">
            <div class="col-sm-12">
              <h3 class="m-t-none m-b">Nuevo cargo</h3>
              <form role="form" ng-submit="saveRole()">
                <div class="form-group">
                  <label>Descripción</label>
                  <input type="text" ng-model="role.description" class="form-control" required />
                </div>
                <div class="m-t-lg text-right">
                    <button type="button" data-dismiss="modal" class="btn btn-default">Cancelar</button>
                  <button type="submit" class="btn btn-primary text-uc"><strong>Aceptar</strong></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div>

<script>
    angularScope(function ($scope) {
        $scope.employees = <?php echo json_encode($employees); ?>;
        $scope.roles = <?php echo json_encode($roles); ?>;
        $scope.companies = <?php echo json_encode($companies); ?>;
        $scope.branches = <?php echo json_encode($branches); ?>;
        $scope.unavailable_usernames = <?php echo json_encode($usernames); ?>;
        
        $scope.setUserData(<?php echo json_encode($user); ?>);
    });
</script>
