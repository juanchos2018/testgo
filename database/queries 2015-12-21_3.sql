/* Funcion para anular una venta OJO solo Boleta y Tickets*/
CREATE OR REPLACE FUNCTION invalidate(d_sale_serie INTEGER,d_sale_serial INTEGER) returns void as $$
    DECLARE
    v_sale_id INTEGER;
    v_saled_id INTEGER;
    BEGIN

    /* Buscamos el id de venta*/
	SELECT sales.id INTO v_sale_id FROM sales WHERE sales.serie = d_sale_serie AND sales.serial_number = d_sale_serial;

	
	/* Actualizamos estado venta */
	UPDATE sales SET state = 'CANCELED',active = 'f' WHERE sales.id = v_sale_id
	RETURNING id INTO v_saled_id;

	RAISE NOTICE 'ID de venta: %', v_sale_id;
	

	 UPDATE stock
	    SET store_stock = stock.store_stock + sale_details.quantity
	   FROM sale_details
	  WHERE stock.product_barcode_id = sale_details.product_barcode_id
	    AND sale_details.sale_id = v_sale_id;
	RAISE NOTICE 'Anulacion Completada: %', v_sale_id;

    END;
    $$
LANGUAGE plpgsql;
