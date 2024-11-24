CREATE OR REPLACE FUNCTION save_sale(json, json[], json[])
  RETURNS text AS
$BODY$
BEGIN
	RAISE NOTICE 'Venta: %', $1;
	RAISE NOTICE 'Detalles: %', $2;
	RAISE NOTICE 'Tarjetas: %', $3;
	RETURN '{"ok":true}';
END;
$BODY$
LANGUAGE plpgsql;