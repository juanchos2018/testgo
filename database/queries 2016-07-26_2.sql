/* Creando función para guardar compra (solo actualiza stocks) */
CREATE OR REPLACE FUNCTION save_purchase(
    json,
    json[])
  RETURNS integer AS
$BODY$
DECLARE
	v_purchase_order_id INTEGER;
	v_detail JSON;
	v_product_id INTEGER;
	v_product_detail_id INTEGER;
BEGIN
	/*INSERT INTO purchase_orders (description, start_date, finish_date, paid_date, active, supplier_id, branch_detail_id)
	VALUES (
		($1->>'description'),
		CASE WHEN ($1->>'start_date') IS NULL THEN NULL ELSE ($1->>'start_date')::DATE END,
		CASE WHEN ($1->>'finish_date') IS NULL THEN NULL ELSE ($1->>'finish_date')::DATE END,
		CASE WHEN ($1->>'paid_date') IS NULL THEN NULL ELSE ($1->>'paid_date')::DATE END,
		($1->>'active')::BOOLEAN,
		($1->>'supplier_id')::INTEGER,
		(SELECT bd.id FROM branch_details bd WHERE bd.branch_id = ($1->>'branch_id')::INTEGER AND bd.company_id = ($1->>'company_id')::INTEGER)
	)
	RETURNING id INTO v_purchase_order_id;*/

	FOREACH v_detail IN ARRAY $2
	LOOP
		IF (v_detail->>'product_detail_id') IS NOT NULL THEN
			UPDATE stock
			SET store_stock = store_stock + (v_detail->>'quantity')::INTEGER
			WHERE
			product_barcode_id = (
				SELECT pb.id FROM product_barcodes pb WHERE pb.product_detail_id = (v_detail->>'product_detail_id')::INTEGER AND
				pb.size_id = (SELECT si.id FROM size si WHERE si.description = v_detail->>'size')
			) AND
			branch_id = ($1->>'branch_id')::INTEGER;
			/*INSERT INTO purchase_order_details (purchase_order_id, quantity, product_detail_id)
			VALUES (v_purchase_order_id, (v_detail->>'quantity')::INTEGER, (v_detail->>'product_detail_id')::INTEGER);
		ELSEIF (v_detail->>'product_id') IS NOT NULL THEN
			v_product_detail_id := NULL;

			SELECT pd.id INTO v_product_detail_id FROM product_details pd 
			WHERE pd.product_id = (v_detail->>'product_id')::INTEGER AND pd.company_id = ($1->>'company_id')::INTEGER;

			IF v_product_detail_id IS NULL THEN
				INSERT INTO product_details (product_id, company_id)
				VALUES ((v_detail->>'product_id')::INTEGER, ($1->>'company_id')::INTEGER)
				RETURNING id INTO v_product_detail_id;
			END IF;

			INSERT INTO purchase_order_details (purchase_order_id, quantity, product_detail_id)
			VALUES (v_purchase_order_id, (v_detail->>'quantity')::INTEGER, v_product_detail_id);
		ELSE
			INSERT INTO products (description, brand_id, subcategory_id, category_id, uses_id, ages_id, code, regime, gender_id)
			VALUES (
				(v_detail->>'product_description'),
				CASE WHEN (v_detail->>'product_brand_id') IS NULL THEN NULL ELSE (v_detail->>'product_brand_id')::INTEGER END,
				CASE WHEN (v_detail->>'product_subcategory_id') IS NULL THEN NULL ELSE (v_detail->>'product_subcategory_id')::INTEGER END,
				CASE WHEN (v_detail->>'product_category_id') IS NULL THEN NULL ELSE (v_detail->>'product_category_id')::INTEGER END,
				CASE WHEN (v_detail->>'product_use_id') IS NULL THEN NULL ELSE (v_detail->>'product_use_id')::INTEGER END,
				CASE WHEN (v_detail->>'product_age_id') IS NULL THEN NULL ELSE (v_detail->>'product_age_id')::INTEGER END,
				(v_detail->>'product_code'),
				(v_detail->>'product_regime')::regime_type,
				CASE WHEN (v_detail->>'product_gender_id') IS NULL THEN NULL ELSE (v_detail->>'product_gender_id')::INTEGER END
			) RETURNING id INTO v_product_id;

			INSERT INTO product_details (product_id, company_id)
			VALUES (v_product_id, ($1->>'company_id')::INTEGER)
			RETURNING id INTO v_product_detail_id;

			INSERT INTO purchase_order_details (purchase_order_id, quantity, product_detail_id)
			VALUES (v_purchase_order_id, (v_detail->>'quantity')::INTEGER, v_product_detail_id);
		*/
		END IF;
	END LOOP;

	RETURN v_purchase_order_id;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION save_purchase_order(json, json[])
  OWNER TO postgres;