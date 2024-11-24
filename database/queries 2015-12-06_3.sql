/* Editando función increase_store_stock para que no se guarden negativos en stock */
CREATE OR REPLACE FUNCTION increase_store_stock(
    json[],
    boolean)
  RETURNS void AS
$BODY$
DECLARE
	stock_json JSON;
BEGIN
	FOREACH stock_json IN ARRAY $1
	LOOP
		IF $2 = TRUE THEN
			UPDATE stock SET store_stock = GREATEST(store_stock + (stock_json->>'increment')::INTEGER, 0),
			 last_sale = NOW()
			WHERE product_barcode_id = (stock_json->>'product_barcode_id')::INTEGER
			 AND branch_id = (stock_json->>'branch_id')::INTEGER;
		ELSE
			UPDATE stock SET store_stock = GREATEST(store_stock + (stock_json->>'increment')::INTEGER, 0)
			WHERE product_barcode_id = (stock_json->>'product_barcode_id')::INTEGER
			 AND branch_id = (stock_json->>'branch_id')::INTEGER;
		END IF;
	END LOOP;
END;
$BODY$
  LANGUAGE plpgsql;