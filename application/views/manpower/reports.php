<section class="wrapper">
    <form class="m-b-lg" autocomplete="off" ng-submit="generate()">
        <div class="row" ng-show="!loaded">
        	<div class="col-lg-4">
        		<div class="form-group">
                    <label>Tipo</label>

                    <select ng-model="type" class="form-control" ng-disabled="loading" ng-options="item.value as item.text for item in types">
                    </select>
                </div>
        	</div>

            <div class="col-lg-8" ng-if="type === 'DETALLE'">
                <div class="form-group">
                    <label class="required">Trabajador</label>

                    <select class="form-control" ng-disabled="loading" id="employee" data-placeholder="- Seleccione -" select2 ng-required="type === 'DETALLE'" ng-model="$parent.employee">
                        <option></option>
                        <?php foreach($employees as $employee): ?>
                        <option value="<?php echo $employee['id']; ?>">Cód. <?php echo str_pad($employee['id'], 4, '0', STR_PAD_LEFT) . ' - ' . $employee['text']; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <erp-period-chooser period="period" ng-model="dateRange" required="true" data-custom-opts="dateRangeOpts" data-disabled="loading"></erp-period-chooser>

            <div class="col-lg-2">
                <div class="form-group">
                    <label class="required">Empresa</label>
                    <erp-company-chooser class="form-control" ng-model="company" ng-disabled="loading" required>
                    </erp-company-chooser>
                </div>
            </div>

            <div class="col-lg-12 m-t-sm">
                <button type="submit" class="btn btn-primary" ng-disabled="loading">
                    <i class="fa fa-search"></i>
                    Consultar
                </button>
            </div>

            <div class="col-lg-12 m-t-lg" ng-if="loading">
                <div class="progress progress-sm progress-striped m-b-sm">
                    <div class="progress-bar bg-success" style="width: 0%"></div>
                </div>
            </div>
        </div>

        <div class="row" ng-if="loaded">
            <div class="col-lg-12">
                <div class="row">
                    <div class="col-lg-12">
                        <h3 class="m-t-none m-b" ng-bind="getTypeSelected()"></h3>
                    </div>
                </div>

                <div ng-if="type === 'RESUMEN'">
                    <div class="row">
                        <div class="col-md-2 col-sm-4">
                            <strong>Período</strong>
                        </div>
                        <div class="col-md-4 col-sm-8 text-overflow" ng-bind="getPeriod()">
                        </div>

                        <div class="col-md-2 col-sm-4">
                            <strong>Empresa</strong>
                        </div>
                        <div class="col-md-4 col-sm-8 text-overflow" ng-bind="getCompanySelected()">
                        </div>

                        <div class="col-lg-12">
                            <button type="button" class="btn btn-default btn-rounded m-t-sm m-b" ng-click="goBack()">
                                <i class="fa fa-chevron-left"></i>
                                Volver
                            </button>
                        </div>
                    </div>

                    <div id="output" data-is="rdata">
    	                <div class="row">
    	                    <div class="col-md-3 m-b">
    	                        <h4>{ getRows('registro', 'registros') }</h4>
    	                    </div>
    	                    <div class="col-md-9 text-right m-b">
    	                        <button type="button" onclick="{ opts.download }" class="btn btn-default"><i class="fa fa-download"></i> Descargar</button>
    	                        <a href="{ opts.printableUrl }" class="btn btn-default" target="_blank">
    	                            <i class="fa fa-print"></i>
    	                            Versión imprimible
    	                        </a>
    	                    </div>
    	                </div>
    	                <div class="fixed-table-responsive">
    	                    <table class="table table-bordered bg-white">
    	                        <thead>
    	                            <tr>
                                        <th class="text-center" width="60px">Nº</th>
    	                                <th class="text-center" data-is="rdata-order" rel="id" width="100px">Código</th>
    	                                <th class="text-center" data-is="rdata-order" rel="full_name">Nombres y apellidos</th>
    	                                <th class="text-center" width="120px" data-is="rdata-order" rel="amount">Monto</th>
    	                                <th class="text-center" width="120px" data-is="rdata-order" rel="quantity" desc>Cantidad</th>
    	                            </tr>
    	                        </thead>
    	                        <tbody>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td><input type="text" class="form-control" data-is="rdata-filter" onfilter="{ opts.filterCode }"></td>
                                        <td><input type="text" class="form-control" data-is="rdata-filter" rel="full_name"></td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                    </tr>
    	                            <tr each="{ data }">
                                        <td class="text-center">{ $index }</td>
    	                                <td>{ id.zeros(4) }</td>
    	                                <td>{ full_name }</td>
    	                                <td class="text-right">{ amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
    	                                <td class="text-center">{ quantity.toLocaleString() }</td>
    	                            </tr>
                                    <tr if="{ data.length === 0 }">
                                        <td colspan="6" class="text-center">No se encontraron registros</td>
                                    </tr>
    	                        </tbody>
    	                    </table>
    	                </div>
    	                <div class="row">
    	                    <div class="col-sm-6">
    	                        <div class="form-inline">
    	                            Mostrar
    	                            <select data-is="rdata-display" class="form-control">
    	                            </select>
    	                            registros
    	                        </div>
    	                    </div>
    	                    <div class="col-sm-6 text-right">
    	                        <nav data-is="rdata-paginator">
    	                            <riot-rdata-paginator></riot-rdata-paginator>
    	                        </nav>
    	                    </div>
    	                </div>
                    </div>
	                
	                <div class="row m-t-lg" ng-if="nvd3Data[0].values.length > 0">
                        <div class="col-lg-12">
                            <div id="chart">
                                <svg></svg>
                            </div>
                        </div>
                    </div>

                </div>

                <div ng-if="type === 'DETALLE'">
                    <div class="row">
                        <div class="col-lg-1 col-md-2 col-sm-4">
                            <strong>Trabajador</strong>
                        </div>
                        <div class="col-lg-5 col-md-4 col-sm-8 text-overflow" ng-bind="getEmployeeSelected()">
                        </div>

                        <div class="col-lg-1 col-md-2 col-sm-4">
                            <strong>Período</strong>
                        </div>
                        <div class="col-lg-2 col-md-4 col-sm-8 text-overflow" ng-bind="getPeriod()">
                        </div>

                        <div class="col-lg-1 col-md-2 col-sm-4">
                            <strong>Empresa</strong>
                        </div>
                        <div class="col-lg-2 col-md-4 col-sm-8 text-overflow" ng-bind="getCompanySelected()">
                        </div>

                        <div class="col-lg-12">
                            <button type="button" class="btn btn-default btn-rounded m-t-sm m-b" ng-click="goBack()">
                                <i class="fa fa-chevron-left"></i>
                                Volver
                            </button>
                        </div>
                    </div>

                    <div id="output" data-is="rdata">
                        <div class="row">
                            <div class="col-md-4 m-b">
    	                        <button type="button" onclick="{ opts.download }" class="btn btn-default"><i class="fa fa-download"></i> Descargar</button>
    	                        <a href="{ opts.printableUrl }" class="btn btn-default" target="_blank">
    	                            <i class="fa fa-print"></i>
    	                            Versión imprimible
    	                        </a>
    	                    </div>
                            <div class="col-md-8 text-right m-b">
                                <nav data-is="rdata-paginator">
                                    <riot-rdata-paginator></riot-rdata-paginator>
                                </nav>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-lg-8 col-md-6">
                                <div id="chart">
                                    <svg style="height: 400px"></svg>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6">
                                <div class="fixed-table-responsive">
                                    <table class="table table-bordered bg-white">
                                        <thead>
                                            <tr>
                                                <th class="text-center">Fecha</th>
                                                <th class="text-center" width="100px">Monto</th>
                                                <th class="text-center" width="70px">Cant.</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr each="{ data }">
                                                <td class="text-center">{ parent.opts.moment(date).format('ddd DD/MM/YYYY') }</td>
                                                <td class="text-right">{ amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
                                                <td class="text-center">{ quantity.toLocaleString() }</td>
                                            </tr>
                                            <tr if="{ data.length === 0 }">
                                                <td colspan="3" class="text-center">No se encontraron registros</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="form-inline">
                                            Mostrar
                                            <select data-is="rdata-display" class="form-control">
                                            </select>
                                            registros
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    </form>
</section>
