/* Función para registrar ventas manuales de Boletas y Facturas */
CREATE OR REPLACE FUNCTION save_sale(sale JSON, JSON[], JSON[])
	RETURNS INTEGER AS
$BODY$
/* Tomar en consideración que esta función solo se usa para ventas manuales */
DECLARE
	sale_id INTEGER;
	serie_found INTEGER;
	diff_stock INTEGER;
	sale_detail JSON;
	credit_card JSON;
BEGIN
	/* Buscamos si el número de serie ya se encuentra registrado previamente */
	SELECT series.id INTO serie_found FROM series INNER JOIN branch_details ON series.branch_detail_id = branch_details.id
	WHERE
		branch_details.branch_id = (sale->>'branch_id')::INTEGER AND
		branch_details.company_id = (sale->>'company_id')::INTEGER AND 
		series.voucher = (sale->>'voucher')::voucher_type AND
		series.serie = (sale->>'serie')::INTEGER AND
		series.sale_point_id IS NULL /* Sin sale_point_id porque se trata de una venta manual, no generada por ticketera */
	LIMIT 1;

	IF serie_found IS NOT NULL THEN
		-- Incrementamos el correlativo si es que el serie_serial actual es igual o menor al de la nueva venta
		UPDATE series SET serial_number = serial_number + 1 WHERE id = serie_found AND serial_number <= (sale->>'serial_number')::INTEGER;
	ELSE
		INSERT INTO series (serie, serial_number, voucher, branch_detail_id)
		VALUES (
			(sale->>'serie')::INTEGER,
			(sale->>'serial_number')::INTEGER + 1,
			(sale->>'voucher')::voucher_type,
			(SELECT id FROM branch_details WHERE branch_id = (sale->>'branch_id')::INTEGER AND company_id = (sale->>'company_id')::INTEGER)
		);
	END IF;
	
	INSERT INTO sales (
		salesman_id,
		cashier_id,
		customer_id,
		coupon_id,
		igv,
		total_amount,
		state,
		voucher,
		regime,
		serie,
		serial_number,
		sale_date,
		refund_origin_id,
		refund_target_id,
		sale_point_id,
		total_cash_amount,
		credit_card_amount,
		branch_id,
		company_id
	) VALUES (
		CASE WHEN (sale->>'salesman_id') IS NULL THEN NULL ELSE (sale->>'salesman_id')::INTEGER END,
		CASE WHEN (sale->>'cashier_id') IS NULL THEN NULL ELSE (sale->>'cashier_id')::INTEGER END,
		CASE WHEN (sale->>'customer_id') IS NULL THEN NULL ELSE (sale->>'customer_id')::INTEGER END,
		CASE WHEN (sale->>'coupon_id') IS NULL THEN NULL ELSE (sale->>'coupon_id')::INTEGER END,
		(sale->>'igv')::REAL,
		(sale->>'total_amount')::REAL,
		(sale->>'state')::state_type,
		(sale->>'voucher')::voucher_type,
		(sale->>'regime')::regime_type,
		(sale->>'serie')::INTEGER,
		(sale->>'serial_number')::INTEGER,
		(sale->>'sale_date')::TIMESTAMP WITHOUT TIME ZONE,
		CASE WHEN (sale->>'refund_origin_id') IS NULL THEN NULL ELSE (sale->>'refund_origin_id')::INTEGER END,
		CASE WHEN (sale->>'refund_target_id') IS NULL THEN NULL ELSE (sale->>'refund_target_id')::INTEGER END,
		CASE WHEN (sale->>'sale_point_id') IS NULL THEN NULL ELSE (sale->>'sale_point_id')::INTEGER END,
		(sale->>'total_cash_amount')::REAL,
		(sale->>'credit_card_amount')::REAL,
		CASE WHEN (sale->>'branch_id') IS NULL THEN NULL ELSE (sale->>'branch_id')::INTEGER END,
		CASE WHEN (sale->>'company_id') IS NULL THEN NULL ELSE (sale->>'company_id')::INTEGER END
	) RETURNING id INTO sale_id;
	
	FOREACH sale_detail IN ARRAY $2
	LOOP
		INSERT INTO sale_details (
			sale_id,
			quantity,
			/* subtotal: es autogenerado al ingresarse */
			price,
			product_barcode_id,
			cost,
			/* utility: autogenerado? */
			offer_detail_id
		) VALUES (
			sale_id,
			(sale_detail->>'quantity')::INTEGER,
			(sale_detail->>'price')::REAL,
			CASE WHEN (sale_detail->>'product_barcode_id') IS NULL THEN NULL ELSE (sale_detail->>'product_barcode_id')::INTEGER END,
			(sale_detail->>'cost')::REAL,
			CASE WHEN (sale_detail->>'offer_detail_id') IS NULL THEN NULL ELSE (sale_detail->>'offer_detail_id')::INTEGER END
		);
		
		IF sale->>'voucher' LIKE '%NOTA DE CREDITO' THEN
			diff_stock := -1 * (sale_detail->>'quantity')::INTEGER;
		ELSE
			diff_stock := -1 * (sale_detail->>'quantity')::INTEGER;
		END IF;
		
		UPDATE stock SET store_stock = GREATEST(store_stock + diff_stock, 0), last_sale = NOW()
		WHERE product_barcode_id = (sale_detail->>'product_barcode_id')::INTEGER
			AND branch_id = (CASE WHEN (sale->>'branch_id') IS NULL THEN NULL ELSE (sale->>'branch_id')::INTEGER END);
	END LOOP;
	
	FOREACH credit_card IN ARRAY $3
	LOOP
		INSERT INTO credit_cards (
			sale_id,
			operation_code,
			verification_code,
			amount,
			credit_card_type_id
		) VALUES (
			sale_id,
			CASE WHEN (credit_card->>'operation_code') IS NULL THEN NULL ELSE (credit_card->>'operation_code')::INTEGER END,
			(credit_card->>'verification_code')::TEXT,
			(credit_card->>'amount')::REAL,
			(credit_card->>'credit_card_type_id')::INTEGER
		);
	END LOOP;

	RETURN sale_id;
END;
$BODY$
  LANGUAGE plpgsql;