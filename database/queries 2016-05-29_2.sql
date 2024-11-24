/* Crear trigger para registrar el código de acuerdo al ID */
CREATE OR REPLACE FUNCTION fbi_purchase_order() RETURNS TRIGGER AS
$BODY$
BEGIN
	NEW.code := 'PED' || LPAD(NEW.id::TEXT, 3, '0');
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bi_purchase_order BEFORE INSERT ON purchase_orders FOR EACH ROW EXECUTE PROCEDURE fbi_purchase_order();
