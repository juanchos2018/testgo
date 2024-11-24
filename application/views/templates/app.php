<!DOCTYPE html>
<html lang="en" class="app" ng-app="ERP">
<head>
  <meta charset="utf-8">
  <title>Cargando...</title>

  <link rel="icon" href="<?php echo base_url('favicon.ico'); ?>" type="image/x-icon" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

  <link rel="stylesheet" href="<?php echo npm_url('bootstrap/dist/css/bootstrap.min.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo npm_url('font-awesome/css/font-awesome.min.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo npm_url('open-sans-fontface/open-sans.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo npm_url('select2/dist/css/select2.min.css'); ?>" type="text/css" />

  <link rel="stylesheet" href="<?php echo bower_url('nvd3/build/nv.d3.min.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo bower_url('world-flags-sprite/stylesheets/flags16.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo bower_url('codemirror/lib/codemirror.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo bower_url('codemirror/theme/monokai.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo bower_url('chosen/chosen.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo bower_url('bootstrap-datepicker/dist/css/bootstrap-datepicker3.min.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo bower_url('bootstrap-daterangepicker/daterangepicker.css'); ?>" type="text/css" />

  <link rel="stylesheet" href="<?php echo lib_url('icon/css/icon.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo lib_url('fontello/css/fontello.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo lib_url('fontello/css/animation.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo lib_url('timeentry/jquery.timeentry.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo lib_url('animate.css/animate.css'); ?>" type="text/css" />

  <link rel="stylesheet" href="<?php echo base_url('public/css/datatables.css'); ?>" type="text/css"/>
  <link rel="stylesheet" href="<?php echo base_url('public/css/app.css'); ?>" type="text/css" />
  <link rel="stylesheet" href="<?php echo base_url('public/css/custom.css'); ?>" type="text/css"/>
  <link rel="stylesheet" href="<?php echo base_url('public/css/animation.css'); ?>" type="text/css"/>
  <link rel="stylesheet" href="<?php echo base_url('public/css/printer.css'); ?>" type="text/css" media="print"/>
  <link rel="stylesheet" href="<?php echo base_url('public/css/rdata.css'); ?>" type="text/css"/>
  <link rel="stylesheet" href="https://unpkg.com/vue-select/dist/vue-select.css">

  <?php include_spa_styles(); ?>
</head>
<body class="" style="opacity: 0" ng-class="'shown'"
  ng-init='Settings.branches = <?php echo json_encode($branches); ?>; Settings.regimes = <?php echo json_encode($regimes); ?>; Settings.setItems(<?php echo json_encode($settings); ?>);'
  breakpoint="{ 0: 'mobile-screen', 768: 'tablet-screen', 1024: 'desktop-screen' }"
>
  <div ng-switch="Page.isPublic" style="height:100%; overflow-y: auto; overflow-x: hidden">
    <div class="main-container" ng-switch-when="false" style="height:100%">
      <section class="vbox">
        <header class="bg-white header header-md navbar navbar-fixed-top-xs box-shadow">
          <div class="navbar-header aside-md dk">
            <a class="btn btn-link visible-xs" data-toggle="class:nav-off-screen" data-target="#nav">
              <i class="fa fa-bars"></i>
            </a>
            <span ng-if="Auth.value('userGranted') == '1'" class="hidden-xs nav-user branches">
              <div class="dropdown">
                <a href="#" class="navbar-brand dropdown-toggle hidden-xs" data-toggle="dropdown" >
                  <img src="<?php echo base_url('public/images/logo.png'); ?>" class="m-r-sm" alt="Logo">
                  <span class="hidden-nav-xs">{{ Auth.value('userBranchName') }}</span>
                  <b class="caret"></b>
                </a>
                <ul class="dropdown-menu animated fadeInLeft">
                  <span class="arrow top"></span>
                  <li ng-repeat="branch in Settings.branches">
                    <a href="#" ng-click="Auth.switchBranch(branch)">
                      <i class="fa fa-fw text-left" ng-class="{'fa-check': (branch.branch_id === Auth.value('userBranch'))}"></i>
                      {{ branch.branch_alias }}
                    </a>
                  </li>
                </ul>
              </div>
            </span>

            <a ng-if="Auth.value('userGranted') == '1'" href="#" class="navbar-brand visible-xs" data-toggle="dropdown" data-target=".branches">
              <img src="<?php echo base_url('public/images/logo.png'); ?>" class="m-r-sm" alt="Logo">
              <span class="hidden-nav-xs">{{ Auth.value('userBranchName') }}</span>
              <b class="caret"></b>
            </a>

            <div ng-if="Auth.value('userGranted') != '1'" class="navbar-brand">
              <img src="<?php echo base_url('public/images/logo.png'); ?>" class="m-r-sm" alt="Logo">
              <span class="hidden-nav-xs">{{ Auth.value('userBranchName') }}</span>
            </div>

            <a class="btn btn-link visible-xs" data-toggle="dropdown" data-target=".user">
              <i class="fa fa-cog"></i>
            </a>
          </div>

          <ul class="nav navbar-nav navbar-right m-n hidden-xs nav-user user">
            <li class="hidden-xs">
              <a href="#" onclick="javascript:refreshPage(event)" title="Refrescar" data-tooltip style="display:inline-block">
                <i class="fa fa-refresh"></i>&nbsp;
              </a>
              <a href="#" onclick="javascript:toggleFullscreen()" title="Pantalla completa" data-tooltip style="display:inline-block">
                <i class="icon-resize-full-1"></i>&nbsp;
              </a>
            </li>
            <li ng-if="false" class="hidden-xs">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-animated-toggle="animated flipInY">
                <i class="i i-chat3"></i>
                <span ng-if="Notifications.count()" class="badge badge-sm up bg-danger count">{{Notifications.count()}}</span>
              </a>
              <section class="dropdown-menu aside-xl">
                <section class="panel bg-white">
                  <div class="panel-heading b-light bg-light">
                    <span ng-if="!Notifications.count()">No tiene notificaciones recientes</span>
                    <strong ng-if="Notifications.count()">Tiene <span class="count">{{Notifications.count()}}</span> notificaciones</strong>
                  </div>
                  <div class="list-group list-group-alt">
                    <a ng-repeat="msg in Notifications._messages" ng-href="{{msg.link}}" class="media list-group-item">
                      <span ng-if="msg.icon" class="pull-left thumb-sm">
                        <i ng-class="msg.icon"></i>
                      </span>
                      <span class="media-body block m-b-none">
                        {{msg.message}}<br />
                        <small class="text-muted" am-time-ago="msg.time"></small>
                      </span>
                    </a>
                  </div>
                  <div class="panel-footer text-sm">
                    <a href="#" class="pull-right"><i class="fa fa-cog"></i></a>
                    <a href="#notes" data-toggle="class:show animated fadeInRight">Ver todas las notificaciones</a>
                  </div>
                </section>
              </section>
            </li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-animated-toggle="animated fadeInRight">
                <span class="thumb-sm avatar pull-left">
                  <img ng-src="<?=base_url('public')?>/{{Auth.value('userAvatar')}}" alt="Avatar" />
                </span>
                {{Auth.value('userName')}} <b class="caret"></b>
              </a>
              <ul class="dropdown-menu">
                <!--li>
                  <span class="arrow top"></span>
                  <a href="#">Opciones</a>
                </li>
                <li>
                  <a href="profile.html">Perfil</a>
                </li>
                <li class="divider"></li-->
                <li>
                  <a href="#" ng-click="Auth.logout()">Salir</a> <!-- data-toggle="ajaxModal"  -->
                </li>
              </ul>
            </li>
          </ul>

        </header>
        <section>
          <section class="hbox stretch">
            <!-- .aside -->
            <aside class="bg-black aside-md hidden-print" id="nav">
              <section class="vbox">
                <section class="scrollable w-f">
                  <div class="slim-scroll" data-height="100%" data-disable-fade-out="true" data-distance="0" data-size="10px" data-railOpacity="0.2">
                    <div class="clearfix wrapper dk nav-user hidden-xs">
                      <a href="#/my/profile">
                        <span class="thumb avatar pull-left m-r">
                          <img ng-src="<?=base_url('public')?>/{{Auth.value('userAvatar')}}" class="dker" alt="Avatar" style="background-color:#fff" />
                        </span>
                        <span class="hidden-nav-xs clear">
                          <span class="block m-t-xs">
                            <strong class="font-bold text-lt">{{Auth.value('userName')}}</strong>
                          </span>
                          <span class="text-muted text-xs block">{{ Auth.value('userRoleName') }}</span>
                        </span>
                      </a>
                    </div>

                    <?php $this->load->view('templates/menu'); ?>

                  </div>
                </section>

                <footer class="footer hidden-xs no-padder text-center-nav-xs">
                  <!--<a href="modal.lockme.html" data-toggle="ajaxModal" class="btn btn-icon icon-muted btn-inactive pull-right m-l-xs m-r-xs hidden-nav-xs">-->
                  <!--  <i class="i i-logout"></i>-->
                  <!--</a>-->
                  <a href="#nav" data-toggle="class:nav-xs" class="btn btn-icon icon-muted btn-inactive m-l-xs m-r-xs" onclick="return false">
                    <i class="i i-circleleft text"></i>
                    <i class="i i-circleright text-active"></i>
                  </a>
                </footer>
              </section>
            </aside>
            <!-- /.aside -->

            <section id="content">
              <section class="hbox stretch">
                <section>
                  <section class="vbox">
                    <header ng-if="breadcrumb.path.length" class="header bg-white b-b b-light">
                      <p>
                        <i ng-if="breadcrumb.icon.length" ng-class="breadcrumb.icon"></i>
                        <span ng-repeat="label in breadcrumb.path track by $index">
                          <small class="text-muted" ng-if="$index > 0">/</small>
                          <span ng-if="angular.isObject(label)" ng-repeat="(key, value) in label track by $index">&nbsp; <a ng-href="{{ value }}">{{ key }}</a> &nbsp;</span>
                          <span ng-if="angular.isString(label)">&nbsp; {{ label }} &nbsp;</span>
                        </span>
                      </p>
                      <p ng-if="breadcrumb.dropdown" class="pull-right">
                        <riot-dropdown></riot-dropdown>
                      </p>
                    </header>

                    <section class="scrollable padder" ng-class="{'w-f': showBottomPanel}">
                      <erp-session-message></erp-session-message>

                      <div ng-view></div>
                    </section>

                    <riot-bottom-panel ng-if="showBottomPanel"></riot-bottom-panel>

                  </section>
                </section>
              </section>
            </section>

          </section>
        </section>
      </section>
    </div>
    <div class="login-container" ng-switch-when="true">
      <div ng-view></div>
    </div>
  </div>

   <!-- Iframes Sections -->
  <iframe id="ticket-end-day" src="about:blank" style="display:none"></iframe>
  <!-- end iframes -->

  <script>
    function siteUrl(uri) { var base = '<?php echo site_url(); ?>'; (base.slice(-1) !== '/') && (base += '/'); return base + uri; };
    function baseUrl(uri) { var base = '<?php echo base_url(); ?>'; (base.slice(-1) !== '/') && (base += '/'); return base + uri; };
    function npmUrl(uri) { return baseUrl('node_modules/' + uri); };
    function libUrl(uri) { return baseUrl('public/lib/' + uri); };
  </script>

  <script src="<?php echo npm_url('jquery/dist/jquery.min.js')?>"></script>
  <script src="<?php echo npm_url('bootstrap/dist/js/bootstrap.min.js'); ?>"></script>
  <script src="<?php echo npm_url('datatables/media/js/jquery.dataTables.min.js'); ?>"></script>

  <script src="<?php echo npm_url('select2/dist/js/select2.min.js'); ?>"></script>
  <script src="<?php echo npm_url('select2/dist/js/i18n/es.js'); ?>"></script>
  <script src="<?php echo npm_url('blueimp-canvas-to-blob/js/canvas-to-blob.min.js'); ?>"></script>
  <script src="<?php echo npm_url('parsleyjs/dist/parsley.min.js'); ?>"></script>
  <script src="<?php echo npm_url('parsleyjs/dist/i18n/es.js'); ?>"></script>
  <script src="<?php echo npm_url('moment/min/moment.min.js'); ?>"></script>
  <script src="<?php echo npm_url('moment/locale/es.js'); ?>"></script>
  <!-- <script src="<?php echo npm_url('xlsx/dist/xlsx.core.min.js'); ?>"></script> -->
  <script src="<?php echo npm_url('dbf/dbf.js'); ?>"></script>
  <script src="<?php echo npm_url('bootbox/bootbox.min.js'); ?>"></script>
  <script src="<?php echo npm_url('riot/riot.js'); ?>"></script>
  <script src="<?php echo npm_url('vue/dist/vue.js'); ?>"></script>
  
  <script src="<?php echo lib_url('jQuery-slimScroll/jquery.slimscroll.min.js'); ?>"></script>
  <script src="<?php echo lib_url('jquery.sparkline/jquery.sparkline.min.js'); ?>"></script>
  <script src="<?php echo lib_url('printThis/printThis.js'); ?>"></script>
  <script src="<?php echo lib_url('twitter-bootstrap-wizard/jquery.bootstrap.wizard.min.js'); ?>"></script>
  <script src="<?php echo lib_url('timeentry/jquery.plugin.js'); ?>"></script>
  <script src="<?php echo lib_url('timeentry/jquery.timeentry.js'); ?>"></script>
  <script src="<?php echo lib_url('xlsx-template/xlsx-template.js'); ?>" data-lib-path="<?php echo lib_url('xlsx-template/lib'); ?>" data-worker-path="<?php echo lib_url('xlsx-template'); ?>"></script>
  <script src="<?php echo lib_url('calc-template/calc-template.js'); ?>"></script>
  <script src="<?php echo lib_url('rdata/rdata.js'); ?>"></script>
  <script src="<?php echo lib_url('tags/dist/tags.js'); ?>"></script>

  <script src="<?php echo bower_url('d3/d3.min.js'); ?>"></script>
  <script src="<?php echo bower_url('nvd3/build/nv.d3.min.js'); ?>"></script>
  <script src="<?php echo bower_url('is_js/is.min.js'); ?>"></script>
  <script src="<?php echo bower_url('bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js'); ?>"></script>
  <script src="<?php echo bower_url('bootstrap-datepicker/dist/locales/bootstrap-datepicker.es.min.js'); ?>"></script>
  <script src="<?php echo bower_url('angular/angular.min.js'); ?>"></script>
  <script src="<?php echo bower_url('angular-route/angular-route.min.js'); ?>"></script>
  <script src="<?php echo bower_url('angular-animate/angular-animate.min.js'); ?>"></script>
  <script src="<?php echo bower_url('angular-sanitize/angular-sanitize.min.js'); ?>"></script>
  <script src="<?php echo bower_url('angular-nvd3/dist/angular-nvd3.min.js'); ?>"></script>
  <script src="<?php echo bower_url('jquery.easy-pie-chart/dist/jquery.easypiechart.min.js'); ?>"></script>
  <script src="<?php echo bower_url('codemirror/lib/codemirror.js'); ?>"></script>
  <script src="<?php echo bower_url('codemirror/addon/edit/matchbrackets.js'); ?>"></script>
  <script src="<?php echo bower_url('codemirror/mode/sql/sql.js'); ?>"></script>
  <script src="<?php echo bower_url('angularjs-breakpoint/breakpoint-0.0.1.min.js'); ?>"></script>
  <script src="<?php echo bower_url('chosen/chosen.jquery.js'); ?>"></script>
  <script src="<?php echo bower_url('bootstrap-daterangepicker/daterangepicker.js'); ?>"></script>
  <script src="<?php echo bower_url('js-xlsx/dist/xlsx.full.min.js'); ?>"></script>
  <script src="<?php echo bower_url('urijs/src/URI.min.js'); ?>"></script>

  <script src="<?php echo base_url('public/js/app.js'); ?>"></script>
  <script src="<?php echo base_url('public/js/app.plugin.js'); ?>"></script>
  <script src="<?php echo base_url('public/js/helpers.js'); ?>"></script>
  <script src="https://unpkg.com/vue-select@latest"></script>
  <script src="https://unpkg.com/lodash@latest/lodash.min.js "></script>
  
  <?php include_spa_scripts(); ?>
</body>
</html>
