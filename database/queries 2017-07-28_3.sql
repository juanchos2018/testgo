/* Eliminamos la tabla pack_list_details */
DROP TABLE pack_list_details;

/* Actualizar tabla pack_lists */
ALTER TABLE pack_lists ADD COLUMN quantity INTEGER;
ALTER TABLE pack_lists RENAME COLUMN price TO unit_price;
ALTER TABLE pack_lists ADD COLUMN product_details INTEGER[];

/* Agregando restricciones a pack_lists */
ALTER TABLE pack_lists ADD CONSTRAINT check_price CHECK (unit_price >= 0);
ALTER TABLE pack_lists ADD CONSTRAINT check_quantity CHECK (quantity IS NULL OR quantity > 0);

/* Agregando trigger a tabla pack_lists para validaciones */
CREATE OR REPLACE FUNCTION fbiu_pack_lists() RETURNS TRIGGER AS
$BODY$
DECLARE
	product_detail_id INTEGER;
BEGIN
	IF array_length(NEW.product_details, 1) IS NULL OR array_length(NEW.product_details, 1) = 0 THEN
		RAISE EXCEPTION 'pack_lists.product_details can not be an empty array';
	END IF;

	FOREACH product_detail_id IN ARRAY NEW.product_details
	LOOP 
		IF NOT EXISTS(SELECT 1 FROM product_details WHERE id = product_detail_id) THEN
			RAISE EXCEPTION 'There is no record in product_details where id = %', product_detail_id;
		END IF;
	END LOOP;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER biu_pack_lists BEFORE INSERT OR UPDATE ON pack_lists FOR EACH ROW EXECUTE PROCEDURE fbiu_pack_lists();

/* Agregando trigger a pack_lists para calcular precio unitario */

/* Agregando trigger a tabla pack_lists para validaciones */
CREATE OR REPLACE FUNCTION faiu_pack_lists() RETURNS TRIGGER AS
$BODY$
DECLARE
	v_pack_price NUMERIC(10,2);
BEGIN
	SELECT price INTO v_pack_price FROM packs WHERE id = NEW.pack_id;
	NEW.unit_price := v_pack_price / array_length(NEW.product_details, 1);
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER aiu_pack_lists AFTER INSERT OR UPDATE ON pack_lists FOR EACH ROW EXECUTE PROCEDURE faiu_pack_lists();
