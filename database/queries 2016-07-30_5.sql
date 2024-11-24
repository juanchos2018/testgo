/* Crear trigger para registrar el código de acuerdo al ID */
CREATE OR REPLACE FUNCTION fbi_purchase() RETURNS TRIGGER AS
$BODY$
BEGIN
	NEW.code := 'COM' || LPAD(NEW.id::TEXT, 3, '0');
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bi_purchase BEFORE INSERT ON purchases FOR EACH ROW EXECUTE PROCEDURE fbi_purchase();
