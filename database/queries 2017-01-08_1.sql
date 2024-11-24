/* Función para eliminar la compra (sin considerar stock) */
CREATE OR REPLACE FUNCTION delete_purchase(
	INTEGER
)
  RETURNS VOID AS
$BODY$
DECLARE
	v_i INTEGER;
	v_pb INTEGER;
	v_branch_id INTEGER;
	v_purchase_order_id INTEGER;
	v_product_barcode_id INTEGER[];
	v_quantity INTEGER[];

BEGIN
	SELECT branch_id INTO v_branch_id FROM branch_details WHERE id = (SELECT branch_detail_id FROM purchases WHERE id = $1);
	SELECT purchase_order_id INTO v_purchase_order_id FROM purchases WHERE id = $1;
	SELECT ARRAY_AGG(product_barcode_id), ARRAY_AGG(quantity) INTO v_product_barcode_id, v_quantity FROM purchase_details WHERE purchase_id = $1;
	RAISE NOTICE 'quantity? %', v_quantity;
	/* Decrementamos los pedidos entregados (si correspondiera) */
	IF v_purchase_order_id IS NOT NULL THEN
		v_i := 1;
		
		FOREACH v_pb IN ARRAY v_product_barcode_id
		LOOP
			RAISE NOTICE 'v_i = %, v_quantity[v_i] = %', v_i, v_quantity[v_i];
			UPDATE purchase_order_details SET arrived_quantity = arrived_quantity - v_quantity[v_i] WHERE product_detail_id = (SELECT product_detail_id FROM product_barcodes WHERE id = v_pb) AND purchase_order_id = v_purchase_order_id;
			v_i := v_i + 1;
		END LOOP;
	END IF;

	/* Decrementamos los stocks */
	/*v_i := 1;
		
	FOREACH v_pb IN ARRAY v_product_barcode_id
	LOOP
		UPDATE stock SET store_stock = store_stock - v_quantity[v_i] WHERE product_barcode_id = v_pb AND branch_id = v_branch_id;
		v_i := v_i + 1;
	END LOOP;*/

	/* Eliminamos el registro de compra */
	DELETE FROM invoices WHERE purchase_id = $1;
	DELETE FROM purchases WHERE id = $1;
END;
$BODY$
LANGUAGE plpgsql;