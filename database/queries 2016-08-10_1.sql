/* Alterando función save_purchase para guardar si los precios son autocalculados y el tipo de cambio */
CREATE OR REPLACE FUNCTION save_purchase(json, json[], json[], json)
  RETURNS integer AS
$BODY$
DECLARE
    v_json JSON;
    v_record RECORD;
    v_detail JSON;
    v_product_detail JSON;

    v_purchase_id INTEGER;
    v_invoice_id INTEGER;
    v_product_id INTEGER;
    v_product_detail_id INTEGER;
    v_product_barcode_id INTEGER;
    v_stock_id INTEGER;
BEGIN
    /* Guardando registro de compra */
    INSERT INTO purchases (input_date, amount, branch_detail_id, supplier_id, purchase_order_id, utility, currency, expenses, approved_state, approved_by, approved_at, registered_by, consigned, automatic_prices, exchange_rate)
    VALUES (
        ($1->>'input_date')::DATE,
        ($1->>'amount')::REAL,
        (SELECT bd.id FROM branch_details bd WHERE bd.branch_id = ($1->>'branch_id')::INTEGER AND bd.company_id = ($1->>'company_id')::INTEGER),
        CASE WHEN ($1->>'purchase_order_id') IS NOT NULL THEN NULL ELSE ($1->>'supplier_id')::INTEGER END,
        CASE WHEN ($1->>'purchase_order_id') IS NULL THEN NULL ELSE ($1->>'purchase_order_id')::INTEGER END,
        ($1->>'utility')::INTEGER,
        ($1->>'currency')::CHARACTER,
        ($1->>'expenses')::REAL,
        'A. GERENCIA'::approved_state_type,
        ($1->>'user_id')::INTEGER,
        NOW()::TIMESTAMP WITHOUT TIME ZONE,
        ($1->>'user_id')::INTEGER,
        ($1->>'consigned')::BOOLEAN,
        ($1->>'automatic_prices')::BOOLEAN,
        CASE WHEN ($1->>'currency')::CHARACTER = 'D' THEN ($1->>'exchange_rate')::DECIMAL ELSE NULL END
    )
    RETURNING id INTO v_purchase_id;

    /* Creando tabla temporal para almacenar las facturas (número de serie e ID) */
    CREATE TEMP TABLE inserted_invoices (serie CHARACTER VARYING(15) NOT NULL, id INTEGER NOT NULL) ON COMMIT DROP;

    /* Registrando las facturas */
    FOREACH v_json IN ARRAY $3
    LOOP
        INSERT INTO invoices (serie, date, amount, igv, purchase_id)
        VALUES
        (
            (v_json->>'number')::CHARACTER VARYING,
            (v_json->>'date')::DATE,
            (v_json->>'amount')::REAL,
            (v_json->>'amount')::REAL * ($1->>'igv')::REAL,
            v_purchase_id
        )
        RETURNING id INTO v_invoice_id;

        INSERT INTO inserted_invoices (serie, id)
        VALUES (
            (v_json->>'number')::CHARACTER VARYING,
            v_invoice_id
        );
    END LOOP;

    /* Recorriendo el detalle de productos para registrar los nuevos (sin ID) y actualizar los existentes */
    FOR v_record IN SELECT * FROM json_each_text($4)
    LOOP
        v_json := (v_record.value)::JSON;

        IF (v_json->>'product_id') IS NOT NULL THEN
            UPDATE products SET
                description = COALESCE(CASE WHEN (v_json->>'product_description') IS NULL THEN NULL ELSE (v_json->>'product_description')::CHARACTER VARYING END, description),
                output_statement = COALESCE(CASE WHEN (v_json->>'product_output_statement') IS NULL THEN NULL ELSE (v_json->>'product_output_statement')::CHARACTER VARYING END, output_statement),
                category_id = COALESCE(CASE WHEN (v_json->>'product_category_id') IS NULL THEN NULL ELSE (v_json->>'product_category_id')::INTEGER END, category_id),
                gender_id = COALESCE(CASE WHEN (v_json->>'product_gender_id') IS NULL THEN NULL ELSE (v_json->>'product_gender_id')::INTEGER END, gender_id),
                ages_id = COALESCE(CASE WHEN (v_json->>'product_age_id') IS NULL THEN NULL ELSE (v_json->>'product_age_id')::INTEGER END, ages_id),
                uses_id = COALESCE(CASE WHEN (v_json->>'product_age_id') IS NULL THEN NULL ELSE (v_json->>'product_age_id')::INTEGER END, uses_id),
                brand_id = COALESCE(CASE WHEN (v_json->>'product_brand_id') IS NULL THEN NULL ELSE (v_json->>'product_brand_id')::INTEGER END, brand_id),
                subcategory_id = COALESCE(CASE WHEN (v_json->>'product_subcategory_id') IS NULL THEN NULL ELSE (v_json->>'product_subcategory_id')::INTEGER END, subcategory_id)
            WHERE id = (v_json->>'product_id')::INTEGER;
        ELSE
            INSERT INTO products (code, description, regime, brand_id, subcategory_id, category_id, uses_id, ages_id, gender_id)
            VALUES (
                (v_record.key)::CHARACTER VARYING,
                (v_json->>'product_description')::CHARACTER VARYING,
                (v_json->>'product_regime')::regime_type,
                CASE WHEN (v_json->>'product_brand_id') IS NULL THEN NULL ELSE (v_json->>'product_brand_id')::INTEGER END,
                CASE WHEN (v_json->>'product_subcategory_id') IS NULL THEN NULL ELSE (v_json->>'product_subcategory_id')::INTEGER END,
                CASE WHEN (v_json->>'product_category_id') IS NULL THEN NULL ELSE (v_json->>'product_category_id')::INTEGER END,
                CASE WHEN (v_json->>'product_use_id') IS NULL THEN NULL ELSE (v_json->>'product_use_id')::INTEGER END,
                CASE WHEN (v_json->>'product_age_id') IS NULL THEN NULL ELSE (v_json->>'product_age_id')::INTEGER END,
                CASE WHEN (v_json->>'product_gender_id') IS NULL THEN NULL ELSE (v_json->>'product_gender_id')::INTEGER END
            );
        END IF;
    END LOOP;

    FOREACH v_detail IN ARRAY $2
    LOOP
        SELECT id INTO v_invoice_id FROM inserted_invoices WHERE serie = (v_detail->>'invoice')::CHARACTER VARYING;

        v_product_detail := ($4->>(v_detail->>'product_code'))::JSON;
        v_product_id := NULL;
        v_product_detail_id := NULL;
        v_product_barcode_id := NULL;
        v_stock_id := NULL;

        IF (v_product_detail->>'product_id') IS NOT NULL THEN
            v_product_id := (v_product_detail->>'product_id')::INTEGER;
        ELSE
            SELECT id INTO v_product_id FROM products WHERE code = (v_detail->>'product_code')::CHARACTER VARYING;
        END IF;

        IF v_product_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo obtener el producto "%"', v_detail->>'product_code';
        END IF;

        IF (v_detail->>'product_detail_id') IS NOT NULL THEN
            v_product_detail_id := (v_detail->>'product_detail_id')::INTEGER;

            UPDATE product_details SET
                price = (v_product_detail->>'price')::REAL,
                offer_price = (v_product_detail->>'offer_price')::REAL,
                invoice_currency = ($1->>'currency')::CHARACTER,
                invoice_cost = (v_product_detail->>'invoice_cost')::REAL,
                cost_currency = ($1->>'currency')::CHARACTER,
                cost = (v_product_detail->>'cost')::REAL
            WHERE id = v_product_detail_id;
        ELSE
            INSERT INTO product_details (
                product_id,
                company_id,
                price,
                offer_price,
                invoice_currency,
                invoice_cost,
                cost_currency,
                cost
            ) VALUES (
                v_product_id,
                ($1->>'company_id')::INTEGER,
                (v_product_detail->>'price')::REAL,
                (v_product_detail->>'offer_price')::REAL,
                ($1->>'currency')::CHARACTER,
                (v_product_detail->>'invoice_cost')::REAL,
                ($1->>'currency')::CHARACTER,
                (v_product_detail->>'cost')::REAL
            ) RETURNING id INTO v_product_detail_id;
        END IF;

        IF v_product_detail_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo obtener el detalle de producto "%" para empresa (%)', v_detail->>'product_code', $1->>'company_id';
        END IF;

        IF (v_detail->>'product_barcode_id') IS NOT NULL THEN
            v_product_barcode_id := (v_detail->>'product_barcode_id')::INTEGER;

            IF (v_detail->>'product_barcode') IS NOT NULL THEN
                UPDATE product_barcodes SET
                    old_barcode = (v_detail->>'product_barcode')::CHARACTER VARYING
                WHERE id = v_product_barcode_id;
            END IF;
        ELSE
            INSERT INTO product_barcodes (size_id, product_detail_id, old_barcode) VALUES (
                (v_detail->>'product_size_id')::INTEGER,
                v_product_detail_id,
                CASE WHEN (v_detail->>'product_barcode') IS NULL THEN NULL ELSE (v_detail->>'product_barcode')::CHARACTER VARYING END
            ) RETURNING id INTO v_product_barcode_id;
        END IF;

        IF v_product_barcode_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo obtener el código de detalle de producto (%) para talla (%)', v_product_detail_id, v_detail->>'product_size_id';
        END IF;

        IF (v_detail->>'stock_id') IS NOT NULL THEN
            v_stock_id := (v_detail->>'stock_id')::INTEGER;

            UPDATE stock SET
                store_stock = store_stock + (v_detail->>'quantity')::INTEGER,
                last_entry = NOW()::TIMESTAMP WITHOUT TIME ZONE
            WHERE id = v_stock_id;
        ELSE
            INSERT INTO stock (branch_id, product_barcode_id, store_stock, first_entry, last_entry)
            VALUES
            (
                ($1->>'branch_id')::INTEGER,
                v_product_barcode_id,
                (v_detail->>'quantity')::INTEGER,
                NOW()::TIMESTAMP WITHOUT TIME ZONE,
                NOW()::TIMESTAMP WITHOUT TIME ZONE
            ) RETURNING id INTO v_stock_id;
        END IF;

        IF v_stock_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo actualizar el stock para código de barras (%) y sucursal (%)', v_product_barcode_id, $1->>'branch_id';
        END IF;

        INSERT INTO purchase_details (purchase_id, product_barcode_id, invoice_id, quantity, invoice_cost, price, offer_price)
        VALUES (
            v_purchase_id,
            v_product_barcode_id,
            v_invoice_id,
            (v_detail->>'quantity')::INTEGER,
            (v_product_detail->>'invoice_cost')::REAL,
            (v_product_detail->>'price')::REAL,
            (v_product_detail->>'offer_price')::REAL
        );

        /* Actualizando la cantidad de llegada en pedidos */
        IF ($1->>'purchase_order_id') IS NOT NULL THEN
            UPDATE purchase_order_details SET
                arrived_quantity = arrived_quantity + (v_detail->>'quantity')::INTEGER
            WHERE purchase_order_id = ($1->>'purchase_order_id')::INTEGER AND product_detail_id = v_product_detail_id;
        END IF;

    END LOOP;

    RETURN v_purchase_id;
END;
$BODY$
  LANGUAGE plpgsql;