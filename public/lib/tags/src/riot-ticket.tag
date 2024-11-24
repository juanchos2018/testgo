<riot-ticket>
	<div class="row">
		<div class="col-xs-12 text-center m-b-sm text-ellipsis">
			<div class="i-2x">{ company.company_name }</div>
		</div>
		<div class="col-xs-12 text-center m-b text-ellipsis">
			R.U.C. { company.company_ruc }
		</div>
	</div>

	<div class="row">
		<div class="col-xs-4 text-ellipsis">
			Cliente
		</div>
		<div class="col-xs-8 text-ellipsis">
			{ customer.full_name || '(Público general)' }
		</div>
	</div>

	<div class="row" if="{ customer.id }">
		<div class="col-xs-4 text-ellipsis">
			{ customer.type === 'PERSONA' ? (customer.id_number.length === 8 ? 'D.N.I.' : 'Doc.') : 'R.U.C.' }
		</div>
		<div class="col-xs-4 text-ellipsis">
			{ customer.id_number }
		</div>
	</div>

	<div class="separator"></div>

	<div each="{ detail in details }" class="row">
		<div class="col-xs-5 text-ellipsis">
			{ detail.code }
		</div>
		<div class="col-xs-7 text-right text-ellipsis">
			<span if="{ parent.regime === 'ZOFRA' }">D.S. { detail.output_statement }<br /></span>
			{ detail.description }
		</div>
		<div class="col-xs-7 text-ellipsis">
			{ detail.qty } &times; { parent.price(detail).toFixed(2) }
		</div>
		<div class="col-xs-5 text-right text-ellipsis">
			{ parent.amount(detail).toFixed(2) }
		</div>
		
		<div class="col-xs-12">
			<div class="separator"></div>
		</div>
	</div>
	<div class="row">
		<div class="col-xs-6 text-ellipsis">
			{ tax ? 'SUBTOTAL' : 'TOTAL A COBRAR' }
		</div>
		<div class="col-xs-2 text-right">
			S/
		</div>
		<div class="col-xs-4 text-right text-ellipsis">
			{ subtotal().toFixed(2) }
		</div>
	</div>
	<div if="{ regime === 'General' }" class="row">
		<div class="col-xs-6 text-ellipsis">
			I.G.V. { tax * 100 }%
		</div>
		<div class="col-xs-2 text-right">
			S/
		</div>
		<div class="col-xs-4 text-right text-ellipsis">
			{ igv().toFixed(2) }
		</div>
	</div>
	
	<div class="separator" if="{ regime === 'General' }"></div>

	<div class="row" if="{ regime === 'General' }">
		<div class="col-xs-6 text-ellipsis">
			TOTAL A COBRAR
		</div>
		<div class="col-xs-2 text-right">
			S/
		</div>
		<div class="col-xs-4 text-right text-ellipsis">
			{ total.toFixed(2) }
		</div>
	</div>

	<div class="separator"></div>

	<div class="row">
		<div class="col-xs-6 text-ellipsis">
			RECIBIDO
		</div>
		<div class="col-xs-2 text-right">
			S/
		</div>
		<div class="col-xs-4 text-right text-ellipsis">
			{ paid.toFixed(2) }
		</div>
	</div>

	<div class="separator" if="{ paid > total }"></div>

	<div class="row">
		<div class="col-xs-6 text-ellipsis">
			CAMBIO
		</div>
		<div class="col-xs-2 text-right">
			S/
		</div>
		<div class="col-xs-4 text-right text-ellipsis">
			{ (paid - total).toFixed(2) }
		</div>
	</div>

	<div if="{ regime === 'ZOFRA' }" class="separator"></div>

	<div if="{ regime === 'ZOFRA' }" class="text-center">
		<p>Venta exonerada del IGV-isc-ipm-ipma</p>
		<p>Prohibida la venta fuera de la zona de comercialización de Tacna</p>
	</div>

	<style scoped>
		:scope {
			display: table-cell;
			font-family: sans-serif;
		    line-height: 12pt;
		    color: #000;
		    font-weight: lighter;
		}

		:scope:not(:first-child) {
			border-left: 1px solid #EAEEF1;
			padding-left: 10px;
		}

		:scope:not(:last-child) {
			padding-right: 10px;
		}

		.i-2x {
			line-height: 1.5em;
		}

		div.separator {
		    border-bottom: 1px dashed #000;
		    margin-bottom: 15px;
		    line-height: 8pt;
		}

		div.separator:after {
		    content: '\0000a0';
		}
	</style>
	<script>
		var self = this

		self.customer = opts.customer
		self.company = opts.company
		self.details = opts.details
		self.tax = opts.tax
		self.total = opts.total
		self.paid = opts.paid
		self.regime = opts.regime

		price(sale) {
			if ( self.customer.verified ) {
				return sale.offer_price
			} else {
				return sale.price
			}
		}

		amount(sale) {
			return self.price(sale) * sale.qty
		}

		subtotal() {
			return self.total * (1 - self.tax / (1 + self.tax))
		}

		igv() {
			return self.total * self.tax / (1 + self.tax)
		}
	</script>
</riot-ticket>