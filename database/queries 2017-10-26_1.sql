/* Funcion para cambiar una linea */

CREATE OR REPLACE FUNCTION cambiar_linea(t_product character varying, t_dato character varying)
  RETURNS character varying AS
$BODY$
DECLARE
	v_mensaje character varying;
	v_codigo INTEGER;
	v_linea INTEGER;
BEGIN

	SELECT id INTO v_linea FROM categories WHERE description = t_dato;
	SELECT id INTO v_codigo FROM products WHERE code = t_product;
	
	IF v_codigo IS NULL THEN
		v_mensaje = 'El codigo no existe papu';
		RETURN v_mensaje;
	END IF;

	IF v_linea IS NULL THEN
		INSERT INTO categories (description) VALUES (t_dato)
		RETURNING id INTO v_linea;
	END IF;
	
	UPDATE products SET category_id = v_linea WHERE id = v_codigo;
	v_mensaje = 'Exito causa';
	RETURN v_mensaje;
	
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION cambiar_linea(character varying, character varying)
  OWNER TO postgres;