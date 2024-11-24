<section class="scrollable wrapper" id="stocks" data-is="rdata">
    <div class="row">
        <div class="col-lg-12">
            <table style="width:100%">
                <tr>
                    <td style="width:50%" class="v-middle">
                        <label class="switch m-b-none v-middle">
                            <input type="checkbox" data-is="rdata-filter" rel="stock">
                            <span></span>
                        </label>
                        &nbsp;Solo productos con existencias
                    </td>
                    <td style="width:50%" class="v-middle">
                        <label class="switch m-b-none v-middle">
                            <input type="checkbox" checked data-is="rdata-filter" rel="group" onchange="{ opts.groupSize }">
                            <span></span>
                        </label>
                        &nbsp;Agrupar las tallas
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-12 text-right m-b">
            <button type="button" class="btn btn-default" onclick="{ opts.download }">Descargar</button>
        </div>
        
        <div class="col-sm-12">
            <div class="row m-b">
                <div class="col-md-4">
                    <h4>{ rows.toLocaleString() } { rows === 1 ? 'registro' : 'registros'}</h4>
                </div>
                <div class="col-md-8 text-right">
                    <nav data-is="rdata-paginator">
                        <riot-rdata-paginator></riot-rdata-paginator>
                    </nav>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="scrollable-table-responsive m-b">
                        <table class="table table-bordered table-hover bg-white m-b-sm">
                            <thead>
                                <tr>
                                    <th class="text-center v-middle" style="width: 70px; min-width: 70px">N°</th>
                                    <th class="text-center v-middle" data-is="rdata-order" rel="code" style="width: 150px; min-width: 150px">
                                        Código
                                    </th>
                                    <th class="text-center v-middle" data-is="rdata-order" rel="product" asc style="min-width: 350px">
                                        Producto
                                    </th>
                                    <th class="text-center v-middle" data-is="rdata-order" if="{ showSize }" rel="product_size" style="width: 120px; min-width: 120px">
                                        Talla
                                    </th>
                                    <th class="text-center v-middle" data-is="rdata-order" rel="brand" style="width: 150px; min-width: 150px">
                                        Marca
                                    </th>
                                    <th class="text-center v-middle" style="width: 100px; min-width: 100px">
                                        Régimen
                                    </th>
                                    <th class="text-center v-middle" style="width: 100px; min-width: 100px">
                                        Empresa
                                    </th>
                                    <th class="text-center v-middle" data-is="rdata-order" rel="current_stock" style="width: 100px; min-width: 100px">
                                        Stock
                                    </th>
                                    <th class="text-center v-middle" style="width: 100px; min-width: 100px">
                                        Moneda Fact.
                                    </th>
                                    <th class="text-center v-middle" style="width: 100px; min-width: 100px" data-is="rdata-order" rel="invoice_cost">
                                        Costo Fact.
                                    </th>
                                    <th class="text-center v-middle" style="width: 100px; min-width: 100px">
                                        Moneda Repo.
                                    </th>
                                    <th class="text-center v-middle" style="width: 100px; min-width: 100px" data-is="rdata-order" rel="cost">
                                        Costo Repo.
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>&nbsp;</td>
                                    <td><input type="text" class="form-control" data-is="rdata-filter" rel="code"></td>
                                    <td><input type="text" class="form-control" data-is="rdata-filter" rel="product"></td>
                                    <td if="{ showSize }"><input type="text" class="form-control" data-is="rdata-filter" rel="size"></td>
                                    <td>
                                        <select class="form-control" id="brand-filter"><!-- data-is="rdata-filter" rel="brand" -->
                                            <option value=""></option>
                                            <?php foreach ($brands as $brand): ?>
                                            <option value="<?php echo $brand['id']; ?>"><?php echo $brand['description']; ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </td>
                                    <td>
                                        <select class="form-control" data-is="rdata-filter" rel="regime">
                                            <option value=""></option>
                                            <option value="General">General</option>
                                            <option value="ZOFRA">Zofra</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select class="form-control" data-is="rdata-filter" rel="company">
                                            <option value=""></option>
                                            <option each="{ parent.opts.companies }" value="{ company_id }">
                                                { company_name }
                                            </option>
                                        </select>
                                    </td>
                                    <td class="active">&nbsp;</td>
                                    <td>
                                        <select class="form-control" data-is="rdata-filter" rel="invoice_currency">
                                            <option></option>
                                            <option value="S">PEN</option>
                                            <option value="D">USD</option>
                                        </select>
                                    </td>
                                    <td>&nbsp;</td>
                                    <td>
                                        <select class="form-control" data-is="rdata-filter" rel="cost_currency">
                                            <option></option>
                                            <option value="S">PEN</option>
                                            <option value="D">USD</option>
                                        </select>
                                    </td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr each="{ data }" data-loading="{ parent.loading }">
                                    <td width="60ṕx" class="text-center v-middle">{ $index }</td>
                                    <td class="v-middle">{ code }</td>
                                    <td class="v-middle">{ product }</td>
                                    <td class="v-middle" if="{ showSize }">{ product_size }</td>
                                    <td class="v-middle">{ brand }</td>
                                    <td class="v-middle">{ regime === 'ZOFRA' ? 'Zofra' : regime }</td>
                                    <td class="v-middle">{ company }</td>
                                    <td class="v-middle text-center active">{ parseInt(current_stock, 10).toLocaleString() }</td>
                                    <td class="v-middle text-center">{ invoice_currency === 'S' ? 'PEN' : 'USD' }</td>
                                    <td class="v-middle text-right">{ parseFloat(invoice_cost).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
                                    <td class="v-middle text-center">{ cost_currency === 'S' ? 'PEN' : 'USD' }</td>
                                    <td class="v-middle text-right">{ parseFloat(cost).toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }</td>
                                </tr>
                                <tr if="{ data.length > 0 }" data-loading="{ loading }">
                                    <td colspan="{ showSize ? 7 : 6 }" class="text-right"><strong>Total</strong></td>
                                    <td class="v-middle text-center active">
                                        { extra && extra.total_stock ? extra.total_stock.toLocaleString() : 0 }
                                    </td>
                                </tr>
                                <tr if="{ !data.length }">
                                    <td class="text-center" colspan="{ showSize ? 8 : 7 }">
                                        { loading ? 'Cargando datos...' : 'No se encontraron registros' }
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-4">
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
                <div class="col-md-8 text-right">
                <nav data-is="rdata-paginator">
                    <riot-rdata-paginator></riot-rdata-paginator>
                </nav>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
    /* global angularScope */
	angularScope(['$scope', '$rootScope', '$window', 'Settings', function ($scope, $rootScope, $window, Settings) {
	    var riot = $window.riot, $ = $window.jQuery;
	    
	    var [stockTable] = riot.mount('#stocks', {
            url: $window.siteUrl('products/get_stocks'),
            indexed: true,
            companies: Settings.getCompaniesOfBranch(),
            groupSize: function (e) {
                this.showSize = !e.target.checked;
                e.preventUpdate = true;
            },
            download: function () {
                $scope.download(this.root.querySelector('[rel="stock"]').checked, this.root.querySelector('[rel="group"]').checked, this.order);
            }
        });
        
        if (stockTable) {
            stockTable.on('filter', function () {
                var val = document.querySelector('#brand-filter').value;
                val && stockTable.filters.set('brand', val);
            });
            
            $('#brand-filter').select2({ allowClear: true, placeholder: '' }).change(function (e) {
                stockTable.trigger('filter').trigger('filtered');
            });
        }
	}]);
</script>
