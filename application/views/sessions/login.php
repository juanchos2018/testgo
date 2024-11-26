<div class="login-container">
  <section id="content" class="wrapper-md animated fadeInUp">
    <div class="container aside-xl">
      <h2 class="text-center">
        <img src="<?php echo base_url('public/images/header.png'); ?>" alt="Go!" />
      </h2>
      <section class="m-b-lg">
        <header class="wrapper text-center">
          <strong>Pruebas Go  :V</strong>
        </header>


        <form autocomplete="off" ng-submit="submit($event)">
          <div class="list-group" id="divContainer">

            <div ng-show="user.fullName.length === 0">
              <div class="alert alert-danger" ng-show="message.length > 0">
                <button type="button" class="close" ng-click="message = ''">&times;</button>
                {{message}}
              </div>

              <div class="list-group-item">
                <input type="text" ng-model="credentials.login" id="txtLogin" value="ENGEL" placeholder="Usuario o correo electrónico" class="form-control no-border" autofocus required />
              </div>
              <div class="list-group-item">
                 <input type="password" ng-model="credentials.password" id="txtPassword" placeholder="Contraseña" class="form-control no-border" required  value="mktarias"/>
              </div>
            </div>

            <section class="panel panel-default" ng-show="user.fullName.length > 0">
              <div class="panel-body">
                <div class="clearfix text-center m-t">
                  <div class="text-center"><!--class="inline"-->
                    <div id="divAvatar" class="easypiechart" data-percent="0" data-line-width="5" data-bar-color="#4cc0c1" data-track-Color="#f5f5f5" data-scale-Color="false" data-size="134" data-line-cap="butt" data-animate="1000" style="width:134px; height:134px; line-height:134px; margin: auto">
                      <div class="thumb-lg" ng-if="user.avatar">
                        <img ng-src="<?=base_url('public')?>/{{user.avatar}}" class="img-circle">
                      </div>
                    </div>
                    <div ng-if="user.branch" class="h4 m-t m-b-xs">{{user.fullName}}</div>
                    <small class="text-muted m-b" ng-if="!user.roles.length">{{user.role}}</small>
                    <div ng-if="user.branchesGranted && !user.branch">
                      <div class="h4 m-t-none m-b-xs">{{user.fullName}}</div>

                      <div style="width: 60%; margin: auto" ng-if="user.roles.length">
                          <small class="text-muted m-b">Cargo</small>

                          <select
                            class="form-control m-b-sm"
                            ng-model="user.customRoleId"
                            ng-options="r.id as r.text for r in user.roles"
                            required
                          >
                          </select>
                      </div>

                      <div style="width: 60%; margin: auto">
                          <small class="text-muted m-b">Sucursal</small>
                          <!--ng-change="user.company = getCompanyName()"-->
                          <select
                            id="branch-picker"
                            class="form-control m-b"
                            ng-model="user.branchId"
                            ng-options="v.branch_id as v.branch_alias for (k, v) in Settings.branches"
                            ng-required="!user.branch"
                          >
                            <option value="">-- Seleccione --</option>
                          </select>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </div>

          <button type="submit" id="btnSubmit" class="btn btn-lg btn-primary btn-block">Acceder</button>

          <div id="recovery-container" class="row m-t m-b">
            <div class="col-xs-12 text-center" ng-if="!companies.length || user.defaultCompanyId > 0">
              <a href="#/login/recovery">
                <small>¿Olvidó la contraseña?</small>
              </a>
            </div>
            <div class="col-lg-12 text-center" ng-if="companies.length > 0 && !user.defaultCompanyId">
              <a href="#" ng-click="reset()">
                <small>Cancelar</small>
              </a>
            </div>
          </div>

        </form>
      </section>
    </div>
  </section>
  <!-- footer -->
  <footer id="footer" ng-if="companies.length === 0 || user.defaultCompanyId > 0">
    <div class="text-center padder">
      <p>
        <small>
          S&amp;E Soluciones Empresariales <br>
          Sistema ERP licenciado a LFA &copy; 2014
        </small>
      </p>
    </div>
  </footer>
  <!-- / footer -->
</div>
