INSERT INTO sale_refunds
(sale_origin_id, sale_target_id, from_sale)
VALUES
(
	${ this['"refund_origin_id"'] },
  	${ this['"id"'] },
  	TRUE
);