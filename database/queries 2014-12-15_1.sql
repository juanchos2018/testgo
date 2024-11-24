CREATE OR REPLACE FUNCTION util() RETURNS TRIGGER AS $trigger_util$
  BEGIN
	NEW.utility := NEW.price - NEW.cost;
	RETURN NEW;
  END;
$trigger_util$ LANGUAGE plpgsql;

CREATE TRIGGER calc_util
BEFORE INSERT OR UPDATE ON sale_details
	FOR EACH ROW EXECUTE PROCEDURE util();