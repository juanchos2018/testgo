/* Crear la función para actualizar un pedido */
CREATE OR REPLACE FUNCTION update_purchase_order(
    integer,
    json,
    json[])
  RETURNS integer AS
$BODY$
DECLARE
	v_original_details INTEGER[];
	v_detail JSON;
	v_product_id INTEGER;
	v_product_detail_id INTEGER;
BEGIN
	UPDATE purchase_orders
	SET
	    description = ($2->>'description'),
	    start_date = CASE WHEN ($2->>'start_date') IS NULL THEN NULL ELSE ($2->>'start_date')::DATE END,
	    finish_date = CASE WHEN ($2->>'finish_date') IS NULL THEN NULL ELSE ($2->>'finish_date')::DATE END,
	    paid_date = CASE WHEN ($2->>'paid_date') IS NULL THEN NULL ELSE ($2->>'paid_date')::DATE END,
	    active = ($2->>'active')::BOOLEAN,
	    supplier_id = ($2->>'supplier_id')::INTEGER,
	    branch_detail_id = (SELECT bd.id FROM branch_details bd WHERE bd.branch_id = ($2->>'branch_id')::INTEGER AND bd.company_id = ($2->>'company_id')::INTEGER)
	WHERE
	    id = $1;
	
	FOREACH v_detail IN ARRAY $3
	LOOP
		IF (v_detail->>'id') IS NOT NULL THEN
			v_original_details := v_original_details || (v_detail->>'id')::INTEGER;
		END IF;
	END LOOP;
	
	IF array_length(v_original_details, 1) > 0 THEN
		DELETE FROM purchase_order_details
		WHERE
			purchase_order_id = $1 AND
			id <> ALL(v_original_details);
	END IF;

	FOREACH v_detail IN ARRAY $3
	LOOP
	    IF (v_detail->>'id') IS NOT NULL AND (v_detail->>'update') IS NOT NULL THEN
	    	IF (v_detail->>'update') = 'true' THEN
	    		UPDATE purchase_order_details SET
	    			quantity = (v_detail->>'quantity')::INTEGER,
	    			product_detail_id = (v_detail->>'product_detail_id')::INTEGER,
	    			arrived_quantity = LEAST(arrived_quantity, (v_detail->>'quantity')::INTEGER)
	    		WHERE
	    			id = (v_detail->>'id')::INTEGER;
	    	END IF;
		ELSEIF (v_detail->>'product_detail_id') IS NOT NULL THEN
			INSERT INTO purchase_order_details (purchase_order_id, quantity, product_detail_id)
			VALUES ($1, (v_detail->>'quantity')::INTEGER, (v_detail->>'product_detail_id')::INTEGER);
		ELSEIF (v_detail->>'product_id') IS NOT NULL THEN
			v_product_detail_id := NULL;

			SELECT pd.id INTO v_product_detail_id FROM product_details pd 
			WHERE pd.product_id = (v_detail->>'product_id')::INTEGER AND pd.company_id = ($2->>'company_id')::INTEGER;

			IF v_product_detail_id IS NULL THEN
				INSERT INTO product_details (product_id, company_id)
				VALUES ((v_detail->>'product_id')::INTEGER, ($2->>'company_id')::INTEGER)
				RETURNING id INTO v_product_detail_id;
			END IF;

			INSERT INTO purchase_order_details (purchase_order_id, quantity, product_detail_id)
			VALUES ($1, (v_detail->>'quantity')::INTEGER, v_product_detail_id);
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
			VALUES (v_product_id, ($2->>'company_id')::INTEGER)
			RETURNING id INTO v_product_detail_id;

			INSERT INTO purchase_order_details (purchase_order_id, quantity, product_detail_id)
			VALUES ($1, (v_detail->>'quantity')::INTEGER, v_product_detail_id);
		END IF;
	END LOOP;

	RETURN $1;
END;
$BODY$
  LANGUAGE plpgsql;