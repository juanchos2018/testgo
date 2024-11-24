/* Función para incrementar/disminuir (según si se pasa un positivo/negativo) el stock en tienda */
/* El segundo parámetro se debe pasar como TRUE si se trata de una venta, en caso contrario como FALSE */
CREATE OR REPLACE FUNCTION increase_store_stock(JSON[], BOOLEAN)
  RETURNS VOID AS
$$
DECLARE
	stock_json JSON;
BEGIN
	FOREACH stock_json IN ARRAY $1
	LOOP
		IF $2 = TRUE THEN
			UPDATE stock SET store_stock = store_stock + (stock_json->>'increment')::INTEGER,
			 last_sale = NOW()
			WHERE product_barcode_id = (stock_json->>'product_barcode_id')::INTEGER
			 AND branch_id = (stock_json->>'branch_id')::INTEGER;
		ELSE
			UPDATE stock SET store_stock = store_stock + (stock_json->>'increment')::INTEGER
			WHERE product_barcode_id = (stock_json->>'product_barcode_id')::INTEGER
			 AND branch_id = (stock_json->>'branch_id')::INTEGER;
		END IF;
	END LOOP;
END;
$$ LANGUAGE plpgsql;
