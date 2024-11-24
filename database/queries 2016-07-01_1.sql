/* Corrigiendo la función get_stock_by_detail para que muestre la sumatoria de stocks */
CREATE OR REPLACE FUNCTION get_stock_by_detail(
    p_product_detail_id integer,
    p_branch_id integer)
  RETURNS integer AS
$BODY$
DECLARE
	v_stock INTEGER;
BEGIN
	SELECT SUM(s.store_stock) INTO v_stock
	FROM stock s
	INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id
	INNER JOIN product_details pd ON pb.product_detail_id = pd.id
	WHERE pd.id = p_product_detail_id AND s.branch_id = p_branch_id;

	RETURN v_stock;
END;
$BODY$
  LANGUAGE plpgsql;
