/* Crear función que devuelva las tablas independientes relacionadas a productos */
CREATE OR REPLACE FUNCTION get_tables_for_products()
  RETURNS SETOF character varying AS
$BODY$
DECLARE
   result CHARACTER VARYING[];
BEGIN
	result := ARRAY[
	   array_to_string((SELECT array_agg(id || ':' || description) FROM categories WHERE active = TRUE), ','),
	   array_to_string((SELECT array_agg(id || ':' || description) FROM genders WHERE active = TRUE), ','),
	   array_to_string((SELECT array_agg(id || ':' || description) FROM ages WHERE active = TRUE), ','),
	   array_to_string((SELECT array_agg(id || ':' || description) FROM uses WHERE active = TRUE), ','),
	   array_to_string((SELECT array_agg(id || ':' || description) FROM brands WHERE active = TRUE), ','),
	   array_to_string((SELECT array_agg(id || ':' || description) FROM subcategories WHERE active = TRUE), ',')
	];

	RETURN QUERY SELECT UNNEST(result);
END
$BODY$
  LANGUAGE plpgsql;
