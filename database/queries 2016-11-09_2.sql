/* Funcion para Obtener listado de Documentos de traslado */
CREATE OR REPLACE FUNCTION get_guides_by_transfer(
    t_transfer_id integer)
  RETURNS VARCHAR AS
$BODY$
DECLARE
	v_guides VARCHAR;
BEGIN
	SELECT string_agg(g.serie,', ') INTO v_guides
	FROM transfers t
	INNER JOIN guides g ON t.id = g.transfer_id
	WHERE transfer_id = t_transfer_id;
	RETURN v_guides;
END;
$BODY$
  LANGUAGE plpgsql;