INSERT INTO credit_cards
(sale_id, verification_code, amount, credit_card_type_id)
VALUES
(
	(SELECT id FROM sales WHERE serie = ${ parseInt(parseInt(this.nrodocum).toString().substr(0, 1)) || 0 }
     	AND serial_number = ${ parseInt(parseInt(this.nrodocum).toString().substr(1)) || 0 }),
  	'${this.nrotarjcr1}',
  	${ parseFloat(this.mtopagtar1s) || 0 },
  	(SELECT id FROM credit_card_types WHERE abbrev = '${ this.cdtarjcre1 === "01" ? "VIS" : (this.cdtarjcre1 === "02" ? "AEX" : (this.cdtarjcre1 === "04" ? "VEL" : "MTC")) }')
);
