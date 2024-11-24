<section class="scrollable wrapper">
	<div class="row">
  		
			<div class="panel b-a">
			<div class="row m-n">
			  <div class="col-md-6 b-b b-r">
			    <a href="#" class="block padder-v hover">
			      <span class="i-s i-s-2x pull-left m-r-sm">
			        <i class="i i-hexagon2 i-s-base text-danger hover-rotate"></i>
			        <i class="i i-alarm i-sm text-white"></i>
			      </span>
			      <span class="clear">
			        <span class="h3 block m-t-xs text-danger">2,000</span>
			        <small class="text-muted text-u-c">Productos sin Codigo de Barra</small>
			      </span>
			    </a>
			  </div>
			  <div class="col-md-6 b-b">
			    <a href="#" class="block padder-v hover">
			      <span class="i-s i-s-2x pull-left m-r-sm">
			        <i class="i i-hexagon2 i-s-base text-primary hover-rotate"></i>
			        <i class="i i-plus2 i-1x text-white"></i>
			      </span>
			      <span class="clear">
			        <span class="h3 block m-t-xs text-primary">3434</span>
			        <small class="text-muted text-u-c">Productos con codigo de Barra</small>
			      </span>
			    </a>
			  </div>
			</div>
			</div>
	
		
    </div>
    <div class="row">

		<form class="form-horizontal" ng-submit="submit()" autocomplete="off">
      	<section class="panel panel-default">
          	<div class="panel-body">
          		<div class="col-lg-12">
                    <div class="radio i-checks">
                        <label>
                            <input type="radio" name="filters" ng-value="1" ng-model="filters.include">
                            <i></i>
                            Incluir registros de productos
                        </label>
                    </div>
                </div>
                <div class="col-lg-12 m-t m-l-lg slidedown-anim" ng-show="filters.include">
                    <div class="row m-b-xs">
                        <div class="col-lg-2">
                            <div class="checkbox i-checks">
                                <label>
                                    <input type="checkbox" ng-model="filters.filter" ng-change="changeFilter()">
                                    <i></i> Filtrar
                                </label>
                            </div>
                        </div>
                        <div class="col-lg-8">
                            <div class="row m-b-xs" ng-repeat="f in filters.filterList">
                                <div class="col-sm-2">
                                    {{f.key.text}}
                                </div>
                                <div class="col-sm-1 text-right">
                                    =
                                </div>
                                <div class="col-sm-5">
                                    {{f.term.text}}
                                </div>
                                <div class="col-sm-2">
                                    <button type="button" class="btn btn-default" ng-click="removeFilter($index)">Eliminar</button>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-3">
                                    <select class="form-control" ng-disabled="!filters.filter" ng-model="filters.filterBy.key" ng-change="changeFilterBy()" ng-options="k.id as k.text for k in filterKeys">
                                        <option value="">-- Seleccione --</option>
                                    </select>
                                </div>
                                <div class="col-sm-7" ng-if="filters.filterBy.key.length">
                                    <select erp-select2 style="width:100%" data-placeholder="-- Seleccione --" ng-model="filters.filterBy.term" ng-options="t.id as t.text for t in filterTerms" ng-disabled="!filterTerms.length" ng-change="changeFilterTerm()">
                                        <option value=""></option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row m-b-xs m-t-sm">
                        <div class="col-lg-2">
                            <div class="checkbox i-checks">
                                <label>
                                    <input type="checkbox" ng-model="filters.group">
                                    <i></i> Agrupar por
                                </label>
                            </div>
                        </div>
                        <div class="col-lg-2">
                            <select class="form-control" ng-disabled="!filters.group" ng-model="filters.groupBy">
                                <option value="category">Línea</option>
                                <option value="brand">Marca</option>
                            </select>
                        </div>
                    </div>
                    <div class="row m-t-sm">
                        <div class="checkbox i-checks">
                            <div class="col-lg-12">
                                <label>
                                    <input type="checkbox" ng-model="filters.onlyActive">
                                    <i></i> Sólo productos en estado activo
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
           
        </section>
        <div class="col-lg-12 m-b-none m-t-xs text-center">
            <a  class="btn btn-default"  ng-click="barcode()" ng-disabled="startedDownload">
                <i class="fa" ></i> &nbsp;Descargar codigos de barra
            </a>
        </div>
    	</form>
       
            
        
    </div>
    <div class="hide">
        <img id="barcode"/>
    </div>
    <!-- <barcode id="barcode" type="ean" string="0029000018068" options="options"></barcode><br> -->
    <div class="row">
        
        <iframe frameborder="0" width="500" height="400"></iframe>
    </div>
</section>
