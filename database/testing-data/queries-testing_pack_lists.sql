DO
$DO$
DECLARE
	v_campaign_id INTEGER;
	v_pack_id INTEGER;
BEGIN
	INSERT INTO campaigns (description, start_date, end_date, active) VALUES ('Prueba de listas', '2017-07-28', NULL, TRUE) RETURNING id INTO v_campaign_id;

	INSERT INTO campaign_places (campaign_id, branch_id) VALUES (v_campaign_id, 1), (v_campaign_id, 3);

	INSERT INTO packs (price, campaign_id, description, company_id, regime) VALUES
		(89, v_campaign_id, '2 polos + 1 short', 1, 'ZOFRA'::regime_type) RETURNING id INTO v_pack_id;

	INSERT INTO pack_lists (unit_price, pack_id, quantity, product_details)
	VALUES
		(25, v_pack_id, 2, ARRAY[9337, 6702, 6726]),
		(39, v_pack_id, 1, ARRAY[7191, 3275]);

	INSERT INTO packs (price, campaign_id, description, company_id, regime) VALUES
		(99, v_campaign_id, '3x1 zapatillas', 1, 'ZOFRA'::regime_type) RETURNING id INTO v_pack_id;

	INSERT INTO pack_lists (unit_price, pack_id, quantity, product_details)
	VALUES
		(33, v_pack_id, 3, ARRAY[9372,8101,8110,6702]);
END
$DO$
