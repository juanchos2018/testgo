<section class="wrapper">
    <form class="m-b-lg" ng-submit="submit()" autocomplete="off">
        <div class="row">
            <div class="col-sm-4 col-md-2">
                <div class="form-group">
                    <label class="required">Empresa</label>
                    <erp-company-chooser class="form-control" ng-model="company" ng-disabled="loading" required>
                    </erp-company-chooser>
                </div>
            </div>

            <div erp-branch-multi-chooser
                data-labels="['Sucursal']"
                data-class-names="['col-sm-2', 'col-sm-4']"
                data-model="branches"
                data-custom-disabled="true"
                data-form-group-class="true"
                data-disabled="loading"
            ></div>
            
            <div class="col-sm-2">
                <div class="form-group">
                    <label>Período</label>
                    <select ng-model="period" class="form-control" ng-options="p.id as p.text for p in periods" ng-disabled="loading">
                    </select>
                </div>
            </div>

            <div class="col-sm-2" ng-if="period === 1">
                <div class="form-group">
                    <label>Mes</label>
                    <erp-month-chooser ng-model="$parent.month" class="form-control" show-empty="false" ng-disabled="loading">
                    </erp-month-chooser>
                </div>
            </div>

            <div class="col-sm-2" ng-if="period === 1 || period === 2">
                <div class="form-group">
                    <label class="required">Año</label>
                    <input type="number" required ng-model="$parent.year" class="form-control text-center" min="2000" max="3000" ng-disabled="loading">
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="form-group">
                    <label class="required">Producto</label>

                    <erp-product-chooser
                        required
                        ng-disabled="loading"
                        class="form-control"
                        ng-model="product"
                        id="product-chooser"
                    >
                    </erp-product-chooser>
                </div>
            </div>
            <div class="col-md-6 text-right">
                <label>&nbsp;</label>
                <p class="form-control-static">
                    <button type="submit" class="btn btn-primary" ng-disabled="loading">
                        <i class="fa fa-search"></i>
                        Consultar
                    </button> 
                </p>
            </div>
        </div>
        
        <div class="row">
            <div ng-if="loading" class="col-lg-12 m-t-lg text-center">
                <div class="progress progress-sm progress-striped m-b-sm">
                    <div class="progress-bar bg-success" style="width: 0%"></div>
                </div>
            </div>
            
            <div ng-if="loaded" class="col-lg-12 m-t" id="kardex-detail" data-is="rdata">
                <h3 class="m-t-none m-b">Kárdex generado</h3>
                <div class="row">
                    <div class="col-md-3 m-b">
                        <h4>{ getRows('registro', 'registros') }</h4>
                    </div>
                    <div class="col-md-9 text-right m-b">
                        <button type="button" class="btn btn-default" onclick="{ opts.getPhysical }"><i class="fa fa-download"></i> Formato 12.1</button>
                        <button type="button" disabled class="btn btn-default"><i class="fa fa-download"></i> Formato 13.1</button>
                    </div>
                </div>
                <div class="fixed-table-responsive">
                    <table class="table table-bordered bg-white">
                        <thead>
                            <tr>
                                <th class="text-center v-middle" colspan="4">Documento de traslado, comprobante de pago, documento interno o similar</th>
                                <th if="{ opts.showBranch }" class="text-center v-middle" rowspan="2">Sucursal</th>
                                <th class="text-center v-middle" rowspan="2">Tipo de operación</th>
                                <th class="text-center v-middle" rowspan="2">Entradas</th>
                                <th class="text-center v-middle" rowspan="2">Salidas</th>
                                <th class="text-center v-middle" rowspan="2">Saldo final</th>
                            </tr>
                            <tr>
                                <th class="text-center v-middle">Fecha</th>
                                <th class="text-center v-middle">Tipo</th>
                                <th class="text-center v-middle">Serie</th>
                                <th class="text-center v-middle">Número</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr each="{ data }">
                                <td class="text-center">{ date_text }</td>
                                <td>{ parent.opts.document(this) }</td>
                                <td class="text-center">{ serie }</td>
                                <td class="text-center">{ serial_number || 'Saldo inicial' }</td>
                                <td if="{ parent.opts.showBranch }">{ parent.opts.branches.get(branch_id) }</td>
                                <td>{ parent.opts.operation(this) }</td>
                                <td class="text-center">{ parent.opts.inputs(this) }</td>
                                <td class="text-center">{ parent.opts.outputs(this) }</td>
                                <td class="text-center">{ balance }</td>
                            </tr>
                        </tbody>
                        <tfooter>
                            <tr>
                                <th colspan="{ opts.showBranch ? 6 : 5 }" class="text-right">TOTALES</th>
                                <td class="text-center">{ opts.totalInputs }</td>
                                <td class="text-center">{ opts.totalOutputs }</td>
                                <td>&nbsp;</td>
                            </tr>
                        </tfooter>
                    </table>
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <div class="form-inline">
                            Mostrar
                            <select data-is="rdata-display" class="form-control">
                                <option value="10">10 registros</option>
                                <option value="25">25 registros</option>
                                <option value="50">50 registros</option>
                                <option value="100">100 registros</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-sm-6 text-right">
                        <nav data-is="rdata-paginator">
                            <riot-rdata-paginator></riot-rdata-paginator>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

    </form>
</section>

<script>
    angularScope(['SunatTables', function (SunatTables) {
        SunatTables.init(<?php echo json_encode($sunat_tables); ?>);
    }]);
</script>
