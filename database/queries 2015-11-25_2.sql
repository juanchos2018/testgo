﻿CREATE OR REPLACE FUNCTION save_sale(JSON[])
RETURNS TEXT AS
$BODY$
DECLARE
	sale JSON;
	sale_id INTEGER;
	serie_found INTEGER;
	serie_serie INTEGER;
	serie_serial INTEGER;
	serie_printer_name TEXT;
	serie_printer_serial TEXT;
	result JSON[];
BEGIN
	FOREACH sale IN ARRAY $1
	LOOP
		IF (sale->>'sale_point_id') IS NOT NULL THEN
			-- Se trata de un TICKET para un PUNTO DE VENTA
			SELECT series.id INTO serie_found FROM series INNER JOIN branch_details ON series.branch_detail_id = branch_details.id INNER JOIN sale_points ON series.sale_point_id = sale_points.id
			WHERE branch_details.branch_id = (sale->>'branch_id')::INTEGER AND branch_details.company_id = (sale->>'company_id')::INTEGER
			AND sale_points.id = (sale->>'sale_point_id')::INTEGER AND sale_points.active = TRUE AND series.voucher = (sale->>'voucher')::voucher_type;

			IF serie_found IS NULL THEN
				-- No se encontró una ticketera para esta empresa, se debe tomar el de otra empresa
				SELECT series.id INTO serie_found FROM series INNER JOIN branch_details ON series.branch_detail_id = branch_details.id INNER JOIN sale_points ON series.sale_point_id = sale_points.id
				WHERE branch_details.branch_id = (sale->>'branch_id')::INTEGER AND branch_details.company_id = (sale->>'company_id')::INTEGER
				AND sale_points.active = TRUE AND series.voucher = (sale->>'voucher')::voucher_type;			
			END IF;
		ELSE
			-- Se trata de una VENTA manual o DEVOLUCION, no se considera un PUNTO DE VENTA
			SELECT series.id INTO serie_found FROM series INNER JOIN branch_details ON series.branch_detail_id = branch_details.id
			WHERE branch_details.branch_id = (sale->>'branch_id')::INTEGER AND branch_details.company_id = (sale->>'company_id')::INTEGER
			AND series.voucher = (sale->>'voucher')::voucher_type;			
		END IF;

		IF serie_found IS NOT NULL THEN
			SELECT serie INTO serie_serie FROM series WHERE id = serie_found;
			-- Incrementamos el correlativo y lo almacenamos en la variable serie_serial
			UPDATE series SET serial_number = serial_number + 1 WHERE id = serie_found RETURNING serial_number - 1 INTO serie_serial;
			SELECT printer_name INTO serie_printer_name FROM ticket_printers WHERE serie_id = serie_found;
			SELECT printer_serial INTO serie_printer_serial FROM ticket_printers WHERE serie_id = serie_found;
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
			serie_serie,
			serie_serial,
			CASE WHEN (sale->>'refund_origin_id') IS NULL THEN NULL ELSE (sale->>'refund_origin_id')::INTEGER END,
			CASE WHEN (sale->>'refund_target_id') IS NULL THEN NULL ELSE (sale->>'refund_target_id')::INTEGER END,
			CASE WHEN (sale->>'sale_point_id') IS NULL THEN NULL ELSE (sale->>'sale_point_id')::INTEGER END,
			(sale->>'total_cash_amount')::REAL,
			(sale->>'credit_card_amount')::REAL,
			CASE WHEN (sale->>'branch_id') IS NULL THEN NULL ELSE (sale->>'branch_id')::INTEGER END,
			CASE WHEN (sale->>'company_id') IS NULL THEN NULL ELSE (sale->>'company_id')::INTEGER END
		) RETURNING id INTO sale_id;

		IF serie_printer_name IS NULL THEN
			result := array_append(result, ('{"id":' || sale_id ||  ',"serie":' || COALESCE(serie_serie::TEXT, 'null') ||',"serial":' || COALESCE(serie_serial::TEXT, 'null') || '}')::JSON);
		ELSE
			result := array_append(result, ('{"id":' || sale_id ||  ',"serie":' || COALESCE(serie_serie::TEXT, 'null') ||',"serial":' || COALESCE(serie_serial::TEXT, 'null') || ',"printer":"' || serie_printer_name || '","printer_serial":"' || serie_printer_serial || '"}')::JSON);
		END IF;
	END LOOP;

	RETURN '[' || array_to_string(result, ',') || ']';
END;
$BODY$
LANGUAGE plpgsql