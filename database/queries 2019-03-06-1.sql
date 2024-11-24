-- Function: invalidate(integer, integer, integer)
SELECT invalidate ('BZ01',17,1,1)
-- DROP FUNCTION invalidate(integer, integer, integer);

CREATE OR REPLACE FUNCTION invalidate(
    d_sale_serie VARCHAR,
    d_sale_serial integer,
    d_branch_id integer,
    d_company_id integer)
  RETURNS void AS
$BODY$
    DECLARE
    v_sale_id INTEGER;
    v_saled_id INTEGER;
    BEGIN

    /* Buscamos el id de venta*/
	SELECT sales.id INTO v_sale_id FROM sales WHERE sales.serie = d_sale_serie AND sales.serial_number = d_sale_serial AND sales.company_id = d_company_id AND sales.branch_id = d_branch_id;

	
	/* Actualizamos estado venta */
	UPDATE sales SET state = 'CANCELED',active = 'f' WHERE sales.id = v_sale_id
	RETURNING id INTO v_saled_id;

	RAISE NOTICE 'ID de venta: %', v_sale_id;
	

	 UPDATE stock
	    SET store_stock = stock.store_stock + sale_details.quantity
	   FROM sale_details
	  WHERE stock.product_barcode_id = sale_details.product_barcode_id
	    AND sale_details.sale_id = v_sale_id
	    AND stock.branch_id = d_branch_id;
	RAISE NOTICE 'Anulacion Completada: %', v_sale_id;

    END;
    $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION invalidate(varchar, integer, integer, integer)
  OWNER TO postgres;

  
