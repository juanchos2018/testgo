/* Cambiando estructura de packs */
ALTER TABLE packs DROP COLUMN is_combination;
ALTER TABLE packs ADD COLUMN combinations SMALLINT;

CREATE OR REPLACE FUNCTION faiu_pack_lists() RETURNS TRIGGER AS
$BODY$
DECLARE
	v_combinations SMALLINT;
	v_price NUMERIC(10,2);
BEGIN
	SELECT price, combinations INTO v_price, v_combinations FROM packs WHERE id = NEW.pack_id;

	IF v_combinations IS NOT NULL THEN
		NEW.unit_price := v_price / v_combinations;
	END IF;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;