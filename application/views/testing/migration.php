<section class="scrollable wrapper">
    <div class="row" ng-show="state === stateOpts.ORIGEN_DE_DATOS">
        <form class="form-horizontal" ng-submit="next()">
            <div class="form-group">
                <div class="row m-b">
                    <label class="col-lg-2 control-label">Archivo CSV</label>
                    <div class="col-lg-10">
                        <input type="file" accept=".csv" required>
                    </div>
                </div>
                <div class="row m-b">
                    <label class="col-lg-2 control-label">Separador</label>
                    <div class="col-lg-2">
                        <select ng-model="separator" class="form-control" ng-options="s.value as s.text for s in separatorOpts"></select>
                    </div>
                </div>
                <div class="row m-b">
                    <div class="col-lg-10 col-lg-offset-2">
                        <div class="checkbox i-checks">
                          <label>
                            <input type="checkbox" ng-model="hasHeaders"><i></i> Tiene encabezados
                          </label>
                        </div>
                    </div>

                    <div class="col-lg-10 col-lg-offset-2">
                        <div class="checkbox i-checks">
                          <label>
                            <input type="checkbox" ng-model="quotes">
                                <i></i> Escapar comillas simples
                          </label>
                        </div>
                    </div>
                </div>
                <div class="row m-t-lg">
                    <div class="col-lg-10 col-lg-offset-2">
                        <button type="submit" class="btn btn-default">Continuar</button>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <div class="row" ng-show="state === stateOpts.GENERAR_CONSULTA">
        <form ng-submit="finish()">
            <div class="form-group">
                <h4>Consulta SQL</h4>
                <textarea class="form-control"></textarea>
                <p class="m-t-sm">
                    <strong>Ayuda:</strong>
                    Para hacer referencia a una columna utilice ${this.nombre_de_columna} o ${this['nombre con espacio']} o también puede usar el
                    índice en lugar del nombre ${this.2}.
                </p>
            </div>

            <div class="text-center m-b">
                <a href="#" class="btn btn-default m-b" ng-click="previous()">Cancelar</a>
                <a href="#" class="btn btn-default m-b" ng-click="saveAs()">Guardar como...</a>
                <button type="submit" class="btn btn-success m-b">Generar</button>
            </div>

            <h4>Tabla de datos</h4>

            <riot-table>
                <div class="row">
                    <div class="col-lg-1 col-lg-offset-6 text-right">
                        Filtro
                    </div>
                    <div class="col-lg-5">
                        <searchbox input_class="form-control"></searchbox>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 m-t">
                        <section class="panel panel-default">
                            <div class="panel-body">
                                <div class="table-responsive" style="overflow-x: scroll; white-space: nowrap">
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th class="v-middle text-center" each="{ header, i in opts.headers }">{ i }</th>
                                            </tr>
                                            <tr if="{ opts.hasHeaders }">
                                                <th class="v-middle text-center" each="{ header, i in opts.headers }">{ header }</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr each="{ row in data }">
                                                <td each="{ header, i in parent.opts.headers }">{ row[i] }</td>
                                            </tr>
                                            <tr if="{ !data.length }">
                                                <td colspan="{ opts.headers.length }" class="text-center">
                                                    No se encontraron registros
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6">
                        { total } registros
                    </div>
                    <div class="col-lg-6">
                        <paginator button_class="btn btn-sm btn-default" active_button_class="btn btn-sm btn-primary"></paginator>
                    </div>
                </div>
            </riot-table>
        </form>
    </div>

</section>