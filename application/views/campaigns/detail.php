<section class="scrollable wrapper">

    <form class="form-horizontal" ng-submit="save()" autocomplete="off">
        <div class="col-sm-3">
            <div class="form-group">
                <label class="col-sm-6 control-label">Código</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control" readonly ng-model="code">
                </div>
            </div>
        </div>

        <div class="col-sm-9">
            <div class="form-group required">
                <label class="col-sm-2 control-label">Descripción</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" ng-model="description" ng-readonly="action === 'view'" required>
                </div>
            </div>
        </div>

        <div class="col-sm-3">
            <div class="form-group required">
                <label class="col-sm-6 control-label">Fecha de inicio</label>
                <div class="col-sm-6">
                    <input type="text" date-picker required data-model="startDate" class="form-control text-center" ng-readonly="action === 'view'">
                </div>
            </div>
        </div>

        <div class="col-sm-3">
            <div class="form-group">
                <label class="col-sm-6 control-label">Fecha de fin</label>
                <div class="col-sm-6">
                    <input type="text" date-picker data-model="endDate" class="form-control text-center" ng-readonly="action === 'view'">
                </div>
            </div>
        </div>

        <div class="col-sm-3">
            <div class="form-group">
                <label class="col-sm-6 control-label">Hora de inicio</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control text-center" ng-model="startTime" pattern="^\d{2}:\d{2}(AM|PM)$" erp-time data-show-24="false" ng-required="endTime" ng-readonly="action === 'view'">
                </div>
            </div>
        </div>

        <div class="col-sm-3">
            <div class="form-group">
                <label class="col-sm-6 control-label">Hora de fin</label>
                <div class="col-sm-6">
                    <input type="text" class="form-control text-center" ng-model="endTime" pattern="^\d{2}:\d{2}(AM|PM)$" erp-time data-show-24="false" ng-required="startTime" ng-readonly="action === 'view'">
                </div>
            </div>
        </div>

        <div class="col-sm-3">
            <div class="form-group">
                <label class="col-sm-6 control-label">Activo</label>
                <div class="col-sm-6">
                    <label class="switch m-b-none">
                        <input type="checkbox" ng-model="active" ng-disabled="action === 'view'">
                        <span></span>
                    </label>
                </div>
            </div>
        </div>
        
        <div class="col-sm-9">
            <div class="form-group required">
                <label class="col-sm-2 control-label">Válido para</label>
                <div erp-branch-multi-chooser
                    data-labels="[]"
                    data-labels-disabled="true"
                    data-class-names="['col-sm-4', 'col-sm-6']"
                    data-model="branches"
                    data-disabled="action === 'view'"
                    data-use-long-format="true"
                ></div>
            </div>
        </div>

        <div class="col-sm-12">
            <div class="row">
                <div class="col-xs-4 col-sm-6">
                    <h4>
                        Combos
                        <small ng-if="packs.length > 0" ng-bind="'(' + packs.length + ')'"></small>
                    </h4>
                </div>

                <div class="col-xs-8 col-sm-6 text-right" ng-if="action !== 'view'">
                    <a class="btn btn-default" href="#" ng-click="showPackModal()">Agregar</a>
                </div>
            </div>

			<div class="fixed-table-responsive panel panel-default">
				<table class="table table-striped table-bordered">
					<thead>
						<tr>
							<th width="80px">Nro.</th>
							<th>Descripción</th>
							<th width="120px">Empresa</th>
							<th width="120px">Régimen</th>
							<th width="100px">Listas</th>
							<th width="120px">Precio</th>
							<th width="120px">Activo</th>
							<th width="50px">&nbsp;</th>
							<th width="50px" ng-if="action !== 'view'">&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr ng-repeat="pack in packs track by $index">
							<td width="80px" class="text-center v-middle" ng-bind="$index + 1"></td>
							<td class="v-middle" ng-bind="pack.description"></td>
                            <td class="v-middle" ng-bind="$parent.companies[pack.company_id] || ''"></td>
                            <td class="v-middle" ng-bind="$parent.regimes[pack.regime] || ''"></td>
                            <td class="v-middle text-center" ng-bind="pack.lists.length"></td>
							<td width="120px" class="v-middle">
                                <span class="pull-left">S/</span>
                                <span class="pull-right" ng-bind="pack.price"></span>
                            </td>
							<td width="120px" class="text-center v-middle">
							    <label class="switch m-b-none">
                                    <input type="checkbox" ng-model="pack.active" ng-disabled="action === 'view'">
                                    <span></span>
                                </label>
							</td>
							<td class="v-middle text-center">
                                <a href="#" ng-click="$parent.editPack(pack)" title="{{ $parent.action === 'view' ? 'Ver detalle' : 'Editar' }}">
                                    <i class="fa" ng-class="{ 'fa-pencil': $parent.action !== 'view', 'fa-folder-open-o': $parent.action === 'view' }"></i>
                                </a>
                            </td>
							<td class="v-middle text-center" ng-if="action !== 'view'">
                                <a href="#" ng-click="$parent.removePack(pack)" title="Eliminar">
                                    <i class="fa fa-remove text-danger"></i>
                                </a>
                            </td>
						</tr>
						<tr ng-if="packs.length === 0">
							<td colspan="8" class="text-center">
							    <div class="padder-v">Sin registros</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
        </div>

        <div class="col-lg-12 text-center m-t-sm m-b-lg" ng-if="action !== 'view'">
            <a href="#/campaigns" class="btn btn-default">Cancelar</a>
            <button type="submit" class="btn btn-primary" ng-disabled="packs.length < 1">Guardar</button>
        </div>
        
        <div class="col-lg-12 text-center m-t-sm m-b-lg" ng-if="action === 'view'">
            <a href="#/campaigns" class="btn btn-default">Volver</a>
            <a href="#/campaigns/edit/{{ id }}" class="btn btn-default">Editar</a>
        </div>
    </form>

</section>

<riot-pack-modal readonly="<?php echo $action === 'view' ? 'true' : 'false'; ?>"></riot-pack-modal>

<script>
    /* global angularScope */
    angularScope([
        '$window',
        '$scope',
        '$rootScope',
        'Page',
        'FileHandler',
        'Ajax',
        function ($window, $scope, $rootScope, Page, FileHandler, Ajax) {
            var moment = $window.moment, $ = $window.jQuery, riot = $window.riot;
            
            $scope.action = '<?php echo $action; ?>';
            
            <?php if ($action === 'add'): ?>
            
                $scope.startDate = moment().format('YYYY-MM-DD');
                
                $scope.setCode('<?php echo $next_id; ?>');
                Page.title('Nueva campaña');
            
            <?php else: ?>
            
                $scope.description = '<?php echo $campaign['description']; ?>';
                $scope.startDate = '<?php echo $campaign['start_date']; ?>';
                
                <?php if (!is_null($campaign['end_date'])): ?>
                $scope.endDate = '<?php echo $campaign['end_date']; ?>';
                <?php endif; ?>
                
                <?php if (!is_null($campaign['start_time'])): ?>
                $scope.startTime = '<?php echo $campaign['start_time']; ?>';
                <?php endif; ?>
                
                <?php if (!is_null($campaign['end_time'])): ?>
                $scope.endTime = '<?php echo $campaign['end_time']; ?>';
                <?php endif; ?>
                
                $scope.branches = [<?php echo implode(',', $branches); ?>];
                $scope.active = ('<?php echo $campaign['active']; ?>' === 't');
                
                $scope.packs = <?php echo json_encode(array_map(function ($pack) use ($pack_lists) {
                    $lists = array_values(array_filter($pack_lists, function ($pack_list) use ($pack) {
                        return $pack_list['pack_id'] === $pack['id'];
                    }));
                    
                    $pack['active'] = ($pack['active'] === 't');
                    $pack['lists'] = array_map(function ($pack_list) {
                        $pack_list['subtotal'] = floatval($pack_list['price']) * intval($pack_list['quantity']);
                        $pack_list['products'] = explode(',', substr($pack_list['products'], 1, count($pack_list['products']) - 2));
                        $pack_list['codes'] = explode(',', substr($pack_list['codes'], 1, count($pack_list['codes']) - 2));
                        
                        return $pack_list;
                    }, $lists);
                    
                    return $pack;
                }, $packs)); ?>;
                
                $scope.setCode('<?php echo $id; ?>');
                
                if ($scope.action === 'edit') {
                    Page.title('Editar campaña');
                } else {
                    Page.title('Detalle de campaña');
                }
                
            <?php endif; ?>
            
            if ($scope.action !== 'view') {
                $('[ng-model="description"]').focus();
            }
            
            [$scope.packModal] = riot.mount('riot-pack-modal', {
                companies: $scope.companies,
                regimes: $scope.regimes,
                FileHandler,
                Ajax
            });
        
            $scope.packModal.on('done', function (data) {
              // console.log('datos recibidos', data);
              var found = $scope.packs.find(function (pack) {
                return pack.id === data.id;
              });
        
              if (found !== undefined) {
                console.log('Se editará');
                found.lists.length = 0;
                
                Object.assign(found, data);
              } else {
                console.log('Se agregará');
                $scope.packs.push(data);
              }
        
              $scope.$apply();
            });
        }
    ]);
</script>
