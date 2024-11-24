CREATE OR REPLACE FUNCTION faiu_pack_lists() RETURNS TRIGGER AS
$BODY$
DECLARE
	v_pack_is_combination BOOLEAN;
	v_pack_price NUMERIC(10,2);
BEGIN
	SELECT price, is_combination INTO v_pack_price, v_pack_is_combination FROM packs WHERE id = NEW.pack_id;

	IF v_pack_is_combination THEN
		NEW.unit_price := v_pack_price / array_length(NEW.product_details, 1);
	END IF;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;