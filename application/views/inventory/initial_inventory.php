<section class="scrollable wrapper">
	<div class="row">
        
        <form class="form-horizontal" ng-submit="save()" autocomplete="off">
          <section class="panel panel-default">
              <div class="panel-body">

    		        <form role="form">
    			        <div class="form-group">
                  		<div class="row-fluid">
                        <div class="col-lg-12 m-b">
                          <label>Plantilla</label>
                          <div>
                            <a href="<?php echo base_url('public/files/inventario_inicial.xlsx'); ?>" class="btn btn-default">Descargar archivo</a>
                          </div>
                        </div>

                				<div class="col-lg-12">
    		                  <label>Origen de datos</label>
    		                  <erp-file model="step1.file" accept=".xlsx" placeholder="Hoja de Cálculo de Microsoft Excel (.xlsx)" callback="changeFile(file)"></erp-file>
      			        		</div>

      			        		<div class="col-lg-12 m-t-lg m-b-sm text-center" style="clear:both">
    				              <button class="btn btn-s-md btn-default btn-rounded" type="button">Aceptar</button>
    				            </div>
        			    		</div>
    			        </div>
    			      </form>
              </div>
          </section>
        </form>
    </div>
</section>