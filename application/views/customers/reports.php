<section class="wrapper">
    <form class="m-b-none" autocomplete="off" ng-submit="generate()">
        <div class="row" ng-show="!loaded">
        	<div class="col-lg-4">
        		<div class="form-group">
                    <label>Tipo</label>

                    <select ng-model="type" class="form-control" ng-disabled="loading" ng-options="item.value as item.text for item in types">
                    </select>
                </div>
        	</div>

            <div class="col-lg-8">
                <div class="form-group">
                    <label class="required">Cliente</label>

                    <select class="form-control" ng-disabled="loading" id="customer" select2="customerOpts" required ng-model="customer">
                        <option></option>
                    </select>
                </div>
            </div>

            <erp-period-chooser period="period" ng-model="dateRange" required="true" data-custom-opts="dateRangeOpts" data-disabled="loading"></erp-period-chooser>

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

                <div class="row">
                    <div class="col-lg-1 col-md-2 col-sm-4">
                        <strong>Cliente</strong>
                    </div>
                    <div class="col-lg-7 col-md-5 col-sm-8 text-overflow" ng-bind="getCustomerSelected()">
                    </div>

                    <div class="col-lg-1 col-md-2 col-sm-4">
                        <strong>Período</strong>
                    </div>
                    <div class="col-lg-3 col-md-3 col-sm-8 text-overflow" ng-bind="getPeriod()">
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
                        <div class="col-md-3 m-b-sm">
                            <h4>{ getRows('registro', 'registros') }</h4>
                        </div>
                        <div class="col-md-9 text-right m-b-sm" if="{ rows > 0 }">
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
                                    <th class="text-center" width="50px">Nº</th>
                                    <th class="text-center" width="120px">Fecha</th>
                                    <th class="text-center">Cajero</th>
                                    <th class="text-center" width="160px">Documento</th>
                                    <th class="text-center" width="120px">Régimen</th>
                                    <th class="text-center" width="120px">Empresa</th>
                                    <th class="text-center" width="120px">Sucursal</th>
                                    <th class="text-center" width="100px">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr each="{ data }">
                                    <td class="text-center">{ $index }</td>
                                    <td class="text-center">{ parent.opts.moment(sale_date).format('DD/MM/YYYY') }</td>
                                    <td>{ cashier }</td>
                                    <td>
                                        <a href="#" data-is="riot-sale-modal" item="{ this }" class="underlined-link" data-id="{ sale_id }" title="Ver detalle">
                                            <span>{ parent.opts.vouchers[opts.item.voucher] + '. ' + opts.item.serie.zeros(4) + '-' + opts.item.serial_number.zeros(8) }</span>
                                        </a>
                                    </td>
                                    <td>{ regime === 'ZOFRA' ? 'Zofra' : 'General' }</td>
                                    <td>{ company }</td>
                                    <td>{ branch }</td>
                                    <td class="text-right">
                                        <span class="{ text-danger: voucher.indexOf('NOTA DE CREDITO') > -1 }">
                                            { ((voucher.indexOf('NOTA DE CREDITO') < 0 ? 1 : -1) * amount).toLocaleString('es-PE', parent.opts.numberFormat) }
                                        </span>
                                    </td>
                                </tr>
                                <tr if="{ rows === 0 }">
                                    <td colspan="8" class="text-center">No se encontraron registros</td>
                                </tr>
                            </tbody>
                            <tfooter if="{ rows > 0 }">
                                <tr>
                                    <th colspan="7" class="text-right">TOTAL</th>
                                    <td class="text-right">{ opts.totalAmount.toLocaleString('es-PE', opts.numberFormat) }</td>
                                </tr>
                            </tfooter>
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
                    
                    <div class="row m-t-lg" if="{ opts.showCategories }">
                        <div class="col-md-6" style="background-color:yellow">
                            <div style="background-color:pink"> <!-- style="width:300px; display:inline-block;" -->
                                <svg id="categories-chart" style="background-color:cyan"></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row m-t-lg">
                    <div class="col-md-6" ng-if="showCategories">
                        <nvd3 options="categoryOpts" data="categories"></nvd3>
                    </div>

                    <div class="col-md-6" ng-if="showBrands">
                        <nvd3 options="brandOpts" data="brands"></nvd3>
                    </div>
                </div>

            </div>

        </div>
    </form>
</section>
