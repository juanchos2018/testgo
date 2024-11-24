/* Creando la función save_purchase que aprueba directamente el ingreso */
CREATE OR REPLACE FUNCTION save_purchase(JSON, JSON[], JSON, JSON) /* compra, detalle de compra, facturas, costos y precios de productos */
  RETURNS integer AS
$BODY$
DECLARE
	v_purchase_id INTEGER;
	v_detail JSON;
	v_product_id INTEGER;
	v_product_detail_id INTEGER;
	r RECORD;
BEGIN
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

	FOR r IN SELECT * FROM json_each_text($3)
	LOOP
		INSERT INTO invoices (serie, date, amount, igv, purchase_id)
		VALUES
		(
			r.key::CHARACTER VARYING,
			(r.value::JSON->>'date')::DATE,
			(r.value::JSON->>'amount')::REAL,
			(r.value::JSON->>'amount')::REAL * ($1->>'igv')::REAL,
			v_purchase_id
		);
	END LOOP;

	RETURN v_purchase_id;
END;
$BODY$
  LANGUAGE plpgsql