<section class="row m-b-md padder-v-md">
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
</section>
