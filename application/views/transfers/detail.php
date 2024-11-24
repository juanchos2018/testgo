<section class="wrapper">
    <form class="m-b-lg">
        <div class="row">
            <div class="col-sm-3 col-md-2">
                <div class="form-group">
                    <label>Código</label>
                    <input type="text" class="form-control" disabled ng-model="code">
                </div>
            </div>
        </div>
    </form>

    <h4>
        Productos
        <small ng-if="data.length" ng-bind="'(' + data.length + ')'"></small>
    </h4>

    <div class="row" ng-if="data.length">
        <div class="col-lg-12">
            <riot-table>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="fixed-table-responsive panel panel-default">
                            <table class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th width="70px">Nro.</th>
                                        <th width="150px">Código</th>
                                        <th width="100px">Talla</th>
                                        <th width="100px">Cantidad</th>
                                        <th width="150px">PVP</th>
                                        <th width="150px">P Oferta</th>
                                        <th width="300px">Descripción</th>
                                        <th width="300px">Codigo de Barras</th>
                                        <th width="150px">Marca</th>
                                        <th width="150px">Guia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr each="{ row, index in data }">
                                        <td class="text-center v-middle">{ parent.num(index) }</td>
                                        <td class="v-middle">
                                            { row.CODIGO }
                                        </td>
                                        <td class="v-middle text-center">
                                            <strong>{ row.TALLA || 0 }</strong>
                                        </td>
                                        <td class="v-middle text-center">
                                            <span class="text-primary">{ row['CANT.'] || 0 }</span>
                                        </td>
                                        <td class="v-middle">
                                            <div if="{ !row.product_detail_id }" class="text-center">&mdash;</div>
                                            <div if="{ row.product_detail_id }" class="input-group">
                                                <span class="input-group-addon">S/</span>
                                                <input type="text" readonly class="form-control text-right" value="{ row.PVP.toFixed(2) }">
                                            </div>
                                        </td>
                                        <td class="v-middle">
                                            <div if="{ !row.product_detail_id }" class="text-center">&mdash;</div>
                                            <div if="{ row.product_detail_id }" class="input-group">
                                                <span class="input-group-addon">S/</span>
                                                <input type="text" readonly class="form-control text-right" value="{ row.POFERTA.toFixed(2) }">
                                            </div>
                                        </td>
                                        <td class="v-middle">
                                            <span if="{ !row.DESCRIPCION }">&mdash;</span>
                                            <span if="{ row.DESCRIPCION }">{ row.DESCRIPCION }</span>
                                        </td>
                                        <td class="v-middle">
                                            <span if="{ !row.CODIGO_DE_BARRA }">&mdash;</span>
                                            <span if="{ row.CODIGO_DE_BARRA }">{ row.CODIGO_DE_BARRA }</span>
                                        </td>
                                        <td class="v-middle">
                                            <span if="{ !row.MARCA }">&mdash;</span>
                                            <span if="{ row.MARCA }">{ row.MARCA }</span>
                                        </td>
                                        <td class="v-middle">
                                            <span if="{ !row.GUIA }">&mdash;</span>
                                            <span if="{ row.GUIA }">{ row.GUIA }</span>
                                        </td>
                                    </tr>
                                    <tr if="{ !data.length }">
                                        <td colspan="14">No se encontraron registros</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4 m-b">
                        <searchbox input_class="form-control" placeholder="Filtrar..."></searchbox>
                    </div>
                    <div class="col-md-8 m-b">
                        <paginator button_class="btn btn-sm btn-default" active_button_class="btn btn-sm btn-primary"></paginator>
                    </div>
                </div>
            </riot-table>
        </div>
    </div>

    <div class="row m-t">
        <div class="col-lg-12 text-center" style="clear:both">
            <a href="#/transfers" class="btn btn-default">Cancelar</a>
        </div>
    </div>
</section>

<script>
    angularScope(function ($scope) {
        $scope.setDetail(<?php echo json_encode($detail); ?>);
    });
</script>
