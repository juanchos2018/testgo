/* Crear trigger para registrar el código de acuerdo al ID */
CREATE OR REPLACE FUNCTION fbi_transfer() RETURNS TRIGGER AS
$BODY$
BEGIN
	NEW.code := 'TR' || substr(extract(year from now())::text,3,2) || '-' || LPAD(NEW.id::TEXT, 5, '0');
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bi_transfer BEFORE INSERT ON transfers FOR EACH ROW EXECUTE PROCEDURE fbi_transfer();
