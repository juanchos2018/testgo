/* Crear función para migrar la compra */
CREATE OR REPLACE FUNCTION save_old_purchase(json, json[], json[])
  RETURNS integer AS
$BODY$
DECLARE
    v_json JSON;
    v_record RECORD;
    v_detail JSON;
    v_product_detail JSON;

    v_purchase_id INTEGER;
    v_invoice_id INTEGER;
	v_product_detail_id INTEGER;
	v_product_barcode_id INTEGER;
BEGIN
    /* Guardando registro de compra */
	INSERT INTO purchases (input_date, amount, branch_detail_id, supplier_id, purchase_order_id, utility, currency, expenses, approved_state, approved_by, approved_at, registered_by)
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
		($1->>'user_id')::INTEGER
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

    FOREACH v_detail IN ARRAY $2
	LOOP
        SELECT id INTO v_invoice_id FROM inserted_invoices WHERE serie = (v_detail->>'invoice')::CHARACTER VARYING;

        v_product_detail_id := (v_detail->>'product_detail_id')::INTEGER;
        v_product_barcode_id := (v_detail->>'product_barcode_id')::INTEGER;

        IF v_product_detail_id IS NULL OR v_product_barcode_id IS NULL THEN
            RAISE EXCEPTION 'No se pudo obtener el producto con ID = "%"', v_detail->>'product_id';
        END IF;

        /* Registrando el detalle de la compra */
        INSERT INTO purchase_details (purchase_id, product_barcode_id, invoice_id, quantity, invoice_cost, price, offer_price)
        VALUES (
            v_purchase_id,
            v_product_barcode_id,
            v_invoice_id,
            (v_detail->>'quantity')::INTEGER,
            (v_detail->>'invoice_cost')::REAL,
            (v_detail->>'price')::REAL,
            (v_detail->>'offer_price')::REAL
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
