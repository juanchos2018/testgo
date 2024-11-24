<div class="m-b-md">
	<h3 class="m-b-none">Clientes</h3>
</div>
<div class="row">
	
	<div class="col-lg-12">
		<section class="panel panel-default">
	        <header class="panel-heading font-bold">Ingrese Codigo Tarjeta o DNI</header>
	        <div class="panel-body">
	          <form role="form">
	          	<div class="input-group">
	          		<input type="text" class="form-control" placeholder="Escanee codigo de barras" ng-model="clienteCod">
	          		<span class="input-group-btn">
	          			<button class="btn btn-success" type="button" ng-click="buscarCliente(clienteCod)">Buscar</button>
	          		</span>
	          	</div>
	          </form>
	        </div>
		</section>
	</div>
</div>

<div class="row">
	
	
	<div class="col-sm-8">
		<section class="panel no-border bg-primary lt">
                          <div class="panel-body">
                            <div class="row m-t-xl">
                              <div class="col-xs-3 text-right padder-v">
                                <a href="#" class="btn btn-primary btn-icon btn-rounded m-t-xl"><i class="i i-mail2"></i></a>
                              </div>
                              <div class="col-xs-6 text-center">
                                <div class="inline">
                                  <div class="easypiechart" data-percent="75" data-line-width="6" data-bar-color="#fff" data-track-Color="#2796de" data-scale-Color="false" data-size="140" data-line-cap='butt' data-animate="1000">
                                    <div class="thumb-lg avatar">
                                      <img src="http://localhost/lfa/public/images/a5.png" class="dker">
                                    </div>
                                  </div>
                                  <div class="h4 m-t m-b-xs font-bold text-lt">{{customer.name}}</div>
                                  <small class="text-muted m-b">{{customer.address}}</small>
                                </div>
                              </div>
                              <div class="col-xs-3 padder-v">
                                <a href="#" class="btn btn-primary btn-icon btn-rounded m-t-xl" data-toggle="class:btn-danger">
                                  <i class="i i-phone text"></i>
                                  <i class="i i-phone2 text-active"></i>
                                </a>
                              </div>
                            </div>
                            <div class="wrapper m-t-xl m-b">
                              <div class="row m-b">
                                <div class="col-xs-6 text-right">
                                  <small>N&uacute;mero Tarjeta</small>
                                  <div class="text-lt font-bold">1243 0303 0333</div>
                                </div>
                                <div class="col-xs-6">
                                  <small>N&uacute;mero DNI/RUC/RUT</small>
                                  <div class="text-lt font-bold">{{customer.id_number}}</div>
                                </div>
                              </div>
                              <div class="row">
                                <div class="col-xs-6 text-right">
                                  <small>E-mail</small>
                                  <div class="text-lt font-bold">{{customer.email}}</div>
                                </div>
                                <div class="col-xs-6">
                                  <small>Ultima Compra</small>
                                  <div class="text-lt font-bold">10 de Agosto de 2004</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <footer class="panel-footer dk text-center no-border">
                            <div class="row pull-out">
                              <div class="col-xs-4">
                                <div class="padder-v">
                                  <span class="m-b-xs h3 block text-white">245</span>
                                  <small class="text-muted">Puntos</small>
                                </div>
                              </div>
                              <div class="col-xs-4 dker">
                                <div class="padder-v">
                                  <span class="m-b-xs h3 block text-white">55</span>
                                  <small class="text-muted">Prox Puntos para Voucher</small>
                                </div>
                              </div>
                              <div class="col-xs-4">
                                <div class="padder-v">
                                  <span class="m-b-xs h3 block text-white">2,035</span>
                                  <small class="text-muted">Monto de Compra</small>
                                </div>
                              </div>
                            </div>
                          </footer>
                        </section>
	</div>
</div>
