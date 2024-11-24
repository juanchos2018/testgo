<section class="scrollable wrapper">
	<form ng-submit="generate()">
		<div class="row m-b-xs">
			<div class="col-lg-2">
				<div class="checkbox i-checks">
					<label>
						<input type="checkbox" ng-model="filterShown">
						<i></i> Filtrar
					</label>
				</div>
			</div>
			<div class="col-lg-10">
				<div ng-if="filterShown" class="row m-b-xs" ng-repeat="f in filters">
					<div class="col-md-3">
						<select disabled class="form-control">
							<option selected>{{ f.key.text }}</option>
						</select>
					</div>
					<div class="col-md-7">
						<span ng-repeat="item in f.values">
							{{item.text}}{{$last ? '' : ', '}}
						</span>
					</div>
					<div class="col-md-2 text-center">
						<a href="#" ng-click="removeFilter($index)">Remover</a>
					</div>
				</div>
				<div class="row">
					<div class="col-md-3">
						<select
							class="form-control"
							ng-disabled="!filterShown"
							ng-model="filter.key"
							ng-change="changeFilterKey()"
							ng-options="k.id as k.text for k in getFilterKeys()"
							ng-required="filterShown &amp;&amp; !filters.length"
						>
							<option value="">- Seleccione -</option>
						</select>
					</div>
					<div class="col-md-7" ng-if="filterShown &amp;&amp; filter.key.length">
						<select select2 multiple style="width:100%" ng-if="!filterItems.length" disabled></select>
						<select
							select2
							style="width:100%"
							multiple
							ng-if="filterItems.length"
							ng-model="filter.values"
							ng-options="t.id as t.text for t in filterItems"
							ng-required="filter.key.length"
						></select>
					</div>
					<div class="col-md-2" ng-if="filterShown &amp;&amp; filter.key.length">
						<a href="#" class="btn btn-default btn-block" ng-disabled="!filter.values.length" ng-click="addFilter()">
							<i class="fa fa-plus"></i>
							Agregar
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="row m-b-xs m-t-sm">
			<div class="col-lg-2">
				<div class="checkbox i-checks">
					<label>
						<input type="checkbox" ng-model="companyShown">
						<i></i> De empresa
					</label>
				</div>
			</div>
			<div class="col-lg-10">
				<div class="row m-b-xs">
					<div class="col-lg-3">
						<erp-company-chooser
						class="form-control"
						ng-disabled="!companyShown"
						ng-model="company"
						ng-required="companyShown"
						></erp-company-chooser>
					</div>
				</div>
			</div>
		</div>

		<div class="row m-b-xs m-t-sm">
			<div class="col-lg-2">
				<div class="checkbox i-checks">
					<label>
						<input type="checkbox" ng-model="regimeShown">
						<i></i> Régimen
					</label>
				</div>
			</div>
			<div class="col-lg-10">
				<div class="row m-b-xs">
					<div class="col-lg-3">
						<erp-regime-chooser
						class="form-control"
						ng-disabled="!regimeShown"
						ng-model="regime"
						ng-required="regimeShown"
						></erp-regime-chooser>
					</div>
				</div>
			</div>
		</div>

		<!-- De momento todos los registros los requeriremos en una hoja -->
		<!-- <div class="row m-b-xs m-t-sm">
			<div class="col-lg-2">
				<div class="checkbox i-checks">
					<label>
						<input type="checkbox" ng-model="groupShown">
						<i></i> Agrupar por
					</label>
				</div>
			</div>
			<div class="col-lg-10">
				<div class="row m-b-xs">
					<div class="col-lg-3">
						<select
							class="form-control"
							ng-disabled="!groupShown"
							ng-model="group"
							ng-required="groupShown"
						>
							<option value="">-- Seleccione --</option>
							<option value="categories">Línea</option>
							<option value="brands">Marca</option>
						</select>
					</div>
				</div>
			</div>
		</div> -->

		<div class="row m-b-xs m-t-sm">
			<div class="col-lg-12">
				<div class="checkbox i-checks">
					<label>
						<input type="checkbox" ng-model="onlyActive">
						<i></i> Sólo productos en estado activo
					</label>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-6 m-b-none m-t-lg text-center">
				<button class="btn btn-primary" ng-disabled="downloading || (filterShown &amp;&amp; !filters.length)">Generar</button>
			</div>
			<div class="col-sm-6 m-b-none m-t-lg text-center">
				<a class="btn btn-default" href="<?php echo base_url('public/files/templates/purchase_order.xlsx'); ?>" download="pedido_<?php echo date('d-m-Y_His'); ?>.xlsx" ng-click="downloadBlank($event)">Descargar plantilla en blanco</a>
			</div>
	    </div>
	</form>
</section>
