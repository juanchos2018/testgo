<section class="row m-b-md padder-v-md">
	<div class="col-md-12 col-sm-12 bg-light">
		<section class="panel panel-default" >
            <header class="panel-heading font-bold">Historial de ventas</header>
            <div class="panel-body">
				<div id='chart'>
					<svg style='height:300px'> </svg>
				</div>
            </div>
         </section>
	</div>

	<div class="col-md-3 col-sm-6">
		<div class="panel b-a">
			<div class="panel-heading no-border bg-info lt text-center">
				<a target="_blank" ng-href="https://twitter.com/{{ twitter_id }}">
					<i class="fa fa-twitter fa fa-3x m-t m-b text-white"></i>
				</a>
			</div>
			<div class="padder-v text-center clearfix">
				<div class="col-xs-12 b-r">
					<div class="h3 font-bold" ng-if="followers > -1">{{ followers | number : 0 }}</div>
					<small ng-if="!twitterError" class="text-muted">
						<span ng-if="followers < 0">
 							Cargando...
 						</span>
						<span ng-if="followers > -1">
 							Seguidores
 						</span>
 					</small>
					<small ng-if="twitterError" class="text-muted">
						Ocurrió un error
					</small>
				</div>
			</div>
		</div>
	</div>

	<div class="col-md-3 col-sm-6">
		<div class="panel b-a">
			<div class="panel-heading no-border bg-primary lt text-center">
				<a target="_blank" ng-href="https://facebook.com/{{ facebook_id }}">
					<i class="fa fa-facebook fa fa-3x m-t m-b text-white"></i>
				</a>
			</div>
			<div class="padder-v text-center clearfix">
				<div class="col-xs-12 b-r" ng-if="facebookError">
					<small class="text-muted">
						Ocurrió un error
					</small>
				</div>
				<div class="b-r" ng-class="{ 'col-xs-6': likes > -1, 'col-xs-12': likes < 0 }" ng-if="!facebookError">
					<div class="h3 font-bold" ng-if="likes > -1">{{ likes | number : 0 }}</div>
					<small ng-if="!facebookError" class="text-muted">
						<span ng-if="likes < 0">
 							Cargando...
 						</span>
						<span ng-if="likes > -1">
 							Me gusta
 						</span>
 					</small>
				</div>
				<div class="col-xs-6" ng-if="!facebookError && likes > -1">
					<div class="h3 font-bold">{{ starRating }}<span class="small">/5</span></div>
					<small ng-if="!facebookError" class="text-muted">
						<span>Valoración</span>
 					</small>
				</div>
			</div>
		</div>
	</div>

	<div class="col-md-3 col-sm-6 bg-light">
		<section class="panel panel-default" >
            <header class="panel-heading font-bold">Porcentaje de Ventas Mensual</header>
            <div class="panel-body">
            	<nvd3 options="monthlyOpts" data="product_percent"></nvd3>
            </div>
         </section>
	</div>

	<div class="col-md-3 col-sm-6 bg-light">
		<section class="panel panel-default" >
            <header class="panel-heading font-bold">Reportes</header>
            <div class="panel-body">
            	<p>
            		<a href="#/customers/reports" class="btn btn-default btn-lg btn-block">
            			<i class="fa fa-user pull-left"></i>
            			Clientes
            		</a>
            	</p>
            	<p>
            		<a href="#/manpower/reports" class="btn btn-default btn-lg btn-block">
            			<i class="fa fa-male pull-left"></i>
            			Vendedores
            		</a>
            	</p>
            </div>
         </section>
	</div>

</section>

<script>
    angularScope(['$scope', '$window', '$timeout', 'Settings', 'Auth', function ($scope, $window, $timeout, Settings, Auth) {
		var nv = $window.nv,
			d3 = $window.d3,
			moment = $window.moment,
			started = new Date(),
			data = []
		;

    	(<?php echo json_encode($history); ?> || []).forEach(function (row, index) {
    		var item = data.find(function (dataRow) {
    			return dataRow.company_id === row.company_id;
    		});

    		if (item === undefined) {
    			var company = Settings.getCompanyOfBranch(row.company_id, Auth.value('userBranch'));

    			item = {
    				key: company.company_name,
    				company_id: row.company_id,
    				values: []
    			};

    			company = null;

    			data.push(item);
    		}

    		item.values.push({
    			x: row.date,
    			y: parseFloat(row.amount)
    		});
		});

		nv.addGraph(function() {
			//console.log('Se crea el cuadro de diálogo', new Date() .getTime());
			var chart = nv.models.multiBarChart()
				.reduceXTicks(true)
				.rotateLabels(0)
				.showControls(true)
				.groupSpacing(0.1)
				.margin({left: 80, right: 30})
				.useInteractiveGuideline(false)
				.color(['#1f77b4', '#ff7f0e'])
				.stacked(true)
				.controlLabels({grouped: 'Agrupado', stacked: 'Apilado'})
			;

			chart.xAxis.tickFormat(function (d) {
				return moment(d).format('ddd DD MMM');
			});

			chart.yAxis.tickFormat(function (d) {
				return 'S/' + d3.format(',.02f')(d);
			});

			d3.select('#chart svg')
		        .datum(data)
		        .call(chart);

			nv.utils.windowResize(chart.update);

			return chart;
		});

		/*$timeout(function () {
			$('#chart').get(0).dataset.showPoints = 'true';
		}, 100);*/

		$scope.product_percent = <?php echo json_encode($products_records); ?>;
    }]);
</script>
