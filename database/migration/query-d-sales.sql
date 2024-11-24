INSERT INTO sales 
(cashier_id, customer_id, sale_date, igv, total_amount, state, active, voucher, regime, serie, serial_number,
 sale_point_id, credit_card_amount, total_cash_amount, branch_id, company_id)
VALUES
(
  	1,
	(SELECT id FROM customers WHERE id_number = '${parseInt(this.cdcliente)}'),
  	'${this.fecdocum}'::TIMESTAMP WITHOUT TIME ZONE,
  	'${this.igv}'::REAL,
  	'${this.total}'::REAL,
  	'${ this.estado === "ANULADO" ? "CANCELED" : "SOLD" }',
  	'${ this.estado === "ANULADO" ? "f" : "t" }',
  	'${ this.cdtipodocu === "003" ? "BOLETA" : "TICKET" }',
  	'${ parseFloat(this.igv) === 0 ? "ZOFRA" : "General" }',
  	'${ parseInt(parseInt(this.nrodocum).toString().substr(0, 1)) || 0 }',
  	'${ parseInt(parseInt(this.nrodocum).toString().substr(1)) || 0 }',
  	1,
  	'${ parseFloat(this.mtopagtar1s) || 0 }',
  	'${ parseFloat(this.mtopagefecs) || 0 }',
  	1,
  	1
);