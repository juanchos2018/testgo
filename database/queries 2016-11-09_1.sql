/* Funcion para Obtener listado de Documentos de compra */
CREATE OR REPLACE FUNCTION get_invoice_by_purchase(
    p_purchase_id integer)
  RETURNS VARCHAR AS
$BODY$
DECLARE
	v_invoices VARCHAR;
BEGIN
	SELECT string_agg(i.serie,', ') INTO v_invoices
	FROM purchases pu
	INNER JOIN invoices i ON pu.id = i.purchase_id
	WHERE purchase_id = p_purchase_id;
	RETURN v_invoices;
END;
$BODY$
  LANGUAGE plpgsql;