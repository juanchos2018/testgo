/* Crear la función para obtener el stock por product_detail_id */
CREATE OR REPLACE FUNCTION get_stock_by_detail(p_product_detail_id IN INTEGER, p_branch_id IN INTEGER)
RETURNS INTEGER AS
$$
DECLARE
	v_stock INTEGER;
BEGIN
	SELECT s.store_stock INTO v_stock
	FROM stock s
	INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id
	INNER JOIN product_details pd ON pb.product_detail_id = pd.id
	WHERE pd.id = p_product_detail_id AND s.branch_id = p_branch_id;

	RETURN v_stock;
END;
$$
LANGUAGE plpgsql;
