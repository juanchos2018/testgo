/* Función para obtener el stock inicial de determinado producto */
CREATE OR REPLACE FUNCTION get_kardex_initial_stock(
	p_product_id INTEGER,
	p_company_id INTEGER,
	p_branch_id INTEGER,
	p_year INTEGER,
	p_month INTEGER
)
  RETURNS INTEGER AS
$BODY$
DECLARE
	v_initial_stock INTEGER;
	v_sales INTEGER;
	v_refunds INTEGER;
	v_purchases INTEGER;
	v_received_transfers INTEGER;
	v_sent_transfers INTEGER;
	v_branch_detail_id INTEGER;
BEGIN
	IF p_branch_id IS NOT NULL THEN
		SELECT branch_details.id INTO v_branch_detail_id FROM branch_details
		WHERE branch_details.company_id = p_company_id AND branch_details.branch_id = p_branch_id;
		/*RAISE NOTICE 'v_branch_detail_id: %', v_branch_detail_id;*/
	END IF;
	
	IF p_branch_id IS NULL THEN
		SELECT COALESCE(SUM(initial_stocks.store_stock), 0) INTO v_initial_stock FROM initial_stocks
		INNER JOIN branch_details ON initial_stocks.branch_detail_id = branch_details.id
		WHERE branch_details.company_id = p_company_id
		AND initial_stocks.product_id = p_product_id
		AND initial_stocks.year = p_year;
	ELSE
		SELECT COALESCE(store_stock, 0) INTO v_initial_stock FROM initial_stocks
		WHERE branch_detail_id = v_branch_detail_id
		AND product_id = p_product_id
		AND initial_stocks.year = p_year;
	END IF;

	/*RAISE NOTICE 'v_stock_inicial: %', v_initial_stock;*/
	
	IF p_month IS NOT NULL THEN
		IF p_branch_id IS NULL THEN
			SELECT COALESCE(SUM(sale_details.quantity), 0) INTO v_sales FROM sale_details
			INNER JOIN sales ON sale_details.sale_id = sales.id
			INNER JOIN product_barcodes ON sale_details.product_barcode_id = product_barcodes.id
			INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
			WHERE sales.active = TRUE AND sales.state != 'CANCELED' AND sales.company_id = p_company_id
			AND EXTRACT(MONTH FROM sales.sale_date) <= p_month AND EXTRACT(YEAR FROM sales.sale_date) = p_year
			AND product_details.product_id = p_product_id
			AND sales.voucher::TEXT = ANY(VALUES ('TICKET'), ('BOLETA'), ('FACTURA'));

			SELECT COALESCE(SUM(sale_details.quantity), 0) INTO v_refunds FROM sale_details
			INNER JOIN sales ON sale_details.sale_id = sales.id
			INNER JOIN product_barcodes ON sale_details.product_barcode_id = product_barcodes.id
			INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
			WHERE sales.active = TRUE AND sales.state != 'CANCELED' AND sales.company_id = p_company_id
			AND EXTRACT(MONTH FROM sales.sale_date) <= p_month AND EXTRACT(YEAR FROM sales.sale_date) = p_year
			AND product_details.product_id = p_product_id
			AND sales.voucher::TEXT = ANY(VALUES ('NOTA DE CREDITO'), ('TICKET NOTA DE CREDITO'));

			SELECT COALESCE(SUM(purchase_details.quantity), 0) INTO v_purchases FROM purchase_details
			INNER JOIN purchases ON purchase_details.purchase_id = purchases.id
			INNER JOIN product_barcodes ON purchase_details.product_barcode_id = product_barcodes.id
			INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
			INNER JOIN branch_details ON purchases.branch_detail_id = branch_details.id
			WHERE purchases.approved_state = 'A. GERENCIA'
			AND branch_details.company_id = p_company_id
			AND EXTRACT(MONTH FROM purchases.input_date) <= p_month AND EXTRACT(YEAR FROM purchases.input_date) = p_year
			AND product_details.product_id = p_product_id;

			/* Si es por EMPRESA no hay traslados entre almacenes */
		ELSE
			SELECT COALESCE(SUM(sale_details.quantity), 0) INTO v_sales FROM sale_details
			INNER JOIN sales ON sale_details.sale_id = sales.id
			INNER JOIN product_barcodes ON sale_details.product_barcode_id = product_barcodes.id
			INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
			WHERE sales.active = TRUE AND sales.state != 'CANCELED' AND sales.company_id = p_company_id
			AND sales.branch_id = p_branch_id
			AND EXTRACT(MONTH FROM sales.sale_date) <= p_month AND EXTRACT(YEAR FROM sales.sale_date) = p_year
			AND product_details.product_id = p_product_id
			AND sales.voucher::TEXT = ANY(VALUES ('TICKET'), ('BOLETA'), ('FACTURA'));

			SELECT COALESCE(SUM(sale_details.quantity), 0) INTO v_refunds FROM sale_details
			INNER JOIN sales ON sale_details.sale_id = sales.id
			INNER JOIN product_barcodes ON sale_details.product_barcode_id = product_barcodes.id
			INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
			WHERE sales.active = TRUE AND sales.state != 'CANCELED' AND sales.company_id = p_company_id
			AND sales.branch_id = p_branch_id
			AND EXTRACT(MONTH FROM sales.sale_date) <= p_month AND EXTRACT(YEAR FROM sales.sale_date) = p_year
			AND product_details.product_id = p_product_id
			AND sales.voucher::TEXT = ANY(VALUES ('NOTA DE CREDITO'), ('TICKET NOTA DE CREDITO'));

			SELECT COALESCE(SUM(purchase_details.quantity), 0) INTO v_purchases FROM purchase_details
			INNER JOIN purchases ON purchase_details.purchase_id = purchases.id
			INNER JOIN product_barcodes ON purchase_details.product_barcode_id = product_barcodes.id
			INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
			WHERE purchases.approved_state = 'A. GERENCIA'
			AND purchases.branch_detail_id = v_branch_detail_id
			AND EXTRACT(MONTH FROM purchases.input_date) <= p_month AND EXTRACT(YEAR FROM purchases.input_date) = p_year
			AND product_details.product_id = p_product_id;

			SELECT COALESCE(SUM(transfer_details.quantity), 0) INTO v_received_transfers FROM transfer_details
			INNER JOIN transfers ON transfer_details.transfer_id = transfers.id
			INNER JOIN product_barcodes ON transfer_details.product_barcode_id = product_barcodes.id
			INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
			WHERE transfers.approved_state = 'A. GERENCIA'
			AND transfers.branch_detail_target_id = v_branch_detail_id
			AND EXTRACT(MONTH FROM transfers.transfer_date) <= p_month AND EXTRACT(YEAR FROM transfers.transfer_date) = p_year
			AND product_details.product_id = p_product_id;

			SELECT COALESCE(SUM(transfer_details.quantity), 0) INTO v_sent_transfers FROM transfer_details
			INNER JOIN transfers ON transfer_details.transfer_id = transfers.id
			INNER JOIN product_barcodes ON transfer_details.product_barcode_id = product_barcodes.id
			INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
			WHERE transfers.approved_state = 'A. GERENCIA'
			AND transfers.branch_detail_origin_id = v_branch_detail_id
			AND EXTRACT(MONTH FROM transfers.transfer_date) <= p_month AND EXTRACT(YEAR FROM transfers.transfer_date) = p_year
			AND product_details.product_id = p_product_id;

			/*RAISE NOTICE 'v_received_transfers: %', v_received_transfers;
			RAISE NOTICE 'v_sent_transfers: %', v_sent_transfers;*/

			v_initial_stock := v_initial_stock + v_received_transfers - v_sent_transfers;
		END IF;

		/*RAISE NOTICE 'v_sales: %', v_sales;
		RAISE NOTICE 'v_refunds: %', v_refunds;
		RAISE NOTICE 'v_purchases: %', v_purchases;*/

		v_initial_stock := v_initial_stock - v_sales + v_refunds + v_purchases;
	END IF;

	RETURN v_initial_stock;
END;
$BODY$
LANGUAGE plpgsql;
