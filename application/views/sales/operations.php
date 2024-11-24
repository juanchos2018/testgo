<section class="scrollable wrapper">
	<form ng-submit="search()" class="m-t">
        <div class="row">
        	<div class="col-lg-offset-1 col-lg-3">
		        <div class="form-group required">
		        	<label>
		          		Tipo
		          	</label>
					<select class="form-control" ng-model="voucher" required ng-disabled="searching">
						<optgroup label="Voucher">
							<option value="TICKET">Ticket</option>
							<option value="TICKET NOTA DE CREDITO">Nota de crédito</option>
						</optgroup>
						<optgroup label="Documento físico">
							<option value="BOLETA">Boleta</option>
							<option value="FACTURA">Factura</option>
							<option value="NOTA DE CREDITO">Nota de crédito</option>
						</optgroup>
					</select>
		        </div>
        	</div>

        	<div class="col-lg-2">
		        <div class="form-group required">
		        	<label>
		          		Empresa
		          	</label>
					<select class="form-control" ng-model="company" ng-options="c.company_id as c.company_name for c in companies" required ng-disabled="searching">
						<option value="">- Seleccione -</option>
					</select>
		        </div>
        	</div>

        	<div class="col-lg-3">
		        <div class="form-group required">
		        	<label>
		          		N° de serie y correlativo
		          	</label>
					<input type="text" class="form-control" ng-model="serie" erp-serie-input required ng-disabled="searching">
		        </div>
        	</div>

        	<div class="col-lg-2">
		        <div class="form-group required">
		        	<label>&nbsp;</label>
		        	<button type="submit" class="btn btn-primary btn-block" ng-disabled="searching">Buscar</button>
		        </div>
        	</div>
        </div>
        <div class="row hidden-sm hidden-xs" ng-if="searching">
        	<div class="col-lg-12 text-center m-t-lg">
        		<img src="<?php echo base_url('public/images/ajax-loader-bg.gif'); ?>" alt="Loader">
        	</div>
        </div>
    </form>
</section>

<!--h3>voucher</h3>
<pre>{{ voucher | json }}</pre>

<h3>company</h3>
<pre>{{ company | json }}</pre>

<h3>serie</h3>
<pre>{{ serie | json }}</pre-->