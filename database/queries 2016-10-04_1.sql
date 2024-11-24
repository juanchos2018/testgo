
/*  Función save_transfers para guardar traslados, guias */
CREATE OR REPLACE FUNCTION save_transfer(json, json[], json[], json)
  RETURNS integer AS
$BODY$
DECLARE
    v_json JSON;
    v_record RECORD;
    v_detail JSON;
    v_product_detail JSON;

    v_transfer_id INTEGER;
    v_guide_id INTEGER;
    v_product_id INTEGER;
    v_product_detail_id INTEGER;
    v_product_barcode_id INTEGER;
    v_stock_id INTEGER;
    v_stock_target_id INTEGER;
BEGIN
    /* Guardando registro de compra */
    INSERT INTO transfers (transfer_date, total_qty, branch_detail_origin_id, branch_detail_target_id, approved_state, approved_by, approved_at, registered_by)
    VALUES (
        ($1->>'transfer_date')::DATE,
        ($1->>'total_qty')::INTEGER,
        (SELECT bd.id FROM branch_details bd WHERE bd.branch_id = ($1->>'branch_id')::INTEGER AND bd.company_id = ($1->>'company_id')::INTEGER),
        (SELECT bd.id FROM branch_details bd WHERE bd.branch_id = ($1->>'branch_id')::INTEGER AND bd.company_id = ($1->>'company_id')::INTEGER),
        'A. GERENCIA'::approved_state_type,
        ($1->>'user_id')::INTEGER,
        NOW()::TIMESTAMP WITHOUT TIME ZONE,
        ($1->>'user_id')::INTEGER
    )
    RETURNING id INTO v_transfer_id;

    /* Creando tabla temporal para almacenar las facturas (número de serie e ID) */
    CREATE TEMP TABLE inserted_guides (serie CHARACTER VARYING(15) NOT NULL, id INTEGER NOT NULL) ON COMMIT DROP;

    /* Registrando las facturas */
    FOREACH v_json IN ARRAY $3
    LOOP
        INSERT INTO guides (serie, date, transfer_id)
        VALUES
        (
            (v_json->>'number')::CHARACTER VARYING,
            (v_json->>'date')::DATE,
            v_transfer_id
        )
        RETURNING id INTO v_guide_id;

        INSERT INTO inserted_guides (serie, id)
        VALUES (
            (v_json->>'number')::CHARACTER VARYING,
            v_guide_id
        );
    END LOOP;


    FOREACH v_detail IN ARRAY $2
    LOOP
        SELECT id INTO v_guide_id FROM inserted_guides WHERE serie = (v_detail->>'invoice')::CHARACTER VARYING;

        v_product_detail := ($4->>(v_detail->>'product_code'))::JSON;
        v_product_id := NULL;
        v_product_detail_id := NULL;
        v_product_barcode_id := NULL;
        v_stock_id := NULL;
        v_stock_target_id := NULL;

        IF (v_product_detail->>'product_id') IS NOT NULL THEN
            v_product_id := (v_product_detail->>'product_id')::INTEGER;
        ELSE
            SELECT id INTO v_product_id FROM products WHERE code = (v_detail->>'product_code')::CHARACTER VARYING;
        END IF;

        IF v_product_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo obtener el producto "%"', v_detail->>'product_code';
        END IF;

        IF (v_detail->>'product_barcode_id') IS NOT NULL THEN
            v_product_barcode_id := (v_detail->>'product_barcode_id')::INTEGER;

        END IF;

        IF v_product_barcode_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo obtener el código de detalle de producto (%) para talla (%)', v_product_detail_id, v_detail->>'product_size_id';
        END IF;

        IF (v_detail->>'stock_id') IS NOT NULL THEN
            v_stock_id := (v_detail->>'stock_id')::INTEGER;

            IF (v_detail->>'stock_target_id') IS NOT NULL THEN
                
                v_stock_target_id := (v_detail->>'stock_target_id')::INTEGER;
             
                UPDATE stock SET 
                    store_stock = store_stock + (v_detail->>'quantity')::INTEGER
                WHERE id = v_stock_target_id;

            ELSE   
                INSERT INTO stock (branch_id, product_barcode_id, store_stock, first_entry, last_entry)
                VALUES 
                (
                    ($1->>'branch_target_id')::INTEGER,
                    v_product_barcode_id,
                    (v_detail->>'quantity')::INTEGER,
                    NOW()::TIMESTAMP WITHOUT TIME ZONE,
                    NOW()::TIMESTAMP WITHOUT TIME ZONE
                ) RETURNING id INTO v_stock_target_id;
            END IF;

            UPDATE stock SET 
                store_stock = store_stock - (v_detail->>'quantity')::INTEGER
            WHERE id = v_stock_id ;

        END IF;

        IF v_stock_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo actualizar el stock para código de barras (%) y sucursal (%)', v_product_barcode_id, $1->>'branch_id';
        END IF;

        IF v_stock_target_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo actualizar el stock para código de barras (%) y sucursal (%)', v_product_barcode_id, $1->>'branch_target_id';
        END IF;

        INSERT INTO transfer_details (transfer_id, product_barcode_id, guide_id, quantity)
        VALUES (
            v_transfer_id,
            v_product_barcode_id,
            v_guide_id,
            (v_detail->>'quantity')::INTEGER
        );

    END LOOP;

    RETURN v_transfer_id;
END;
$BODY$
  LANGUAGE plpgsql;