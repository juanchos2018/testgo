/* Eliminar el trigger anterior */
DROP TRIGGER aiu_pack_lists ON pack_lists;
DROP FUNCTION faiu_pack_lists();

/* Crear trigger en packs */
CREATE OR REPLACE FUNCTION fbu_packs() RETURNS TRIGGER AS
$BODY$
BEGIN
	/*RAISE NOTICE 'NEW.combinations: %, OLD.combinations: %', NEW.combinations, OLD.combinations;*/
	IF (NEW.combinations IS NULL AND OLD.combinations IS NOT NULL) OR (NEW.combinations IS NOT NULL AND OLD.combinations IS NULL) THEN
		RAISE EXCEPTION 'Can not change combinations';
	END IF;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bu_packs BEFORE UPDATE ON packs FOR EACH ROW EXECUTE PROCEDURE fbu_packs();

CREATE OR REPLACE FUNCTION fau_packs() RETURNS TRIGGER AS
$BODY$
BEGIN
	/*RAISE NOTICE 'Actualizar unit_price: %, donde pack_id = %', NEW.price / NEW.combinations, NEW.id;*/
	UPDATE pack_lists SET unit_price = NEW.price / NEW.combinations WHERE pack_id = NEW.id;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER au_packs AFTER UPDATE ON packs FOR EACH ROW EXECUTE PROCEDURE fau_packs();

/* Agregando restricciones a packs */
ALTER TABLE packs ADD CONSTRAINT check_combinations CHECK (combinations IS NULL OR combinations > 0);

/* Eliminando los triggers en tabla pack_lists */
DROP TRIGGER IF EXISTS biu_pack_lists ON pack_lists;
DROP FUNCTION IF EXISTS fbiu_pack_lists();

/* Crear trigger antes de insertar en tabla pack_lists */
CREATE OR REPLACE FUNCTION fbi_pack_lists() RETURNS TRIGGER AS
$BODY$
DECLARE
	v_product_detail_id INTEGER;
	v_combinations SMALLINT;
	v_price NUMERIC(10,2);
BEGIN
	IF array_length(NEW.product_details, 1) IS NULL OR array_length(NEW.product_details, 1) = 0 THEN
		RAISE EXCEPTION 'pack_lists.product_details can not be an empty array';
	END IF;

	FOREACH v_product_detail_id IN ARRAY NEW.product_details
	LOOP 
		IF NOT EXISTS(SELECT 1 FROM product_details WHERE id = v_product_detail_id) THEN
			RAISE EXCEPTION 'There is no record in product_details where id = %', v_product_detail_id;
		END IF;
	END LOOP;

	SELECT price, combinations INTO v_price, v_combinations FROM packs WHERE id = NEW.pack_id;

	IF v_combinations IS NOT NULL THEN
		NEW.unit_price := v_price / v_combinations;
	END IF;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bi_pack_lists BEFORE INSERT ON pack_lists FOR EACH ROW EXECUTE PROCEDURE fbi_pack_lists();

/* Crear trigger antes de actualizar en tabla pack_lists */
CREATE OR REPLACE FUNCTION fbu_pack_lists() RETURNS TRIGGER AS
$BODY$
DECLARE
	v_product_detail_id INTEGER;
BEGIN
	/*RAISE NOTICE 'Nuevo product_Details: %', NEW.product_details;*/
	IF array_length(NEW.product_details, 1) IS NULL OR array_length(NEW.product_details, 1) = 0 THEN
		RAISE EXCEPTION 'pack_lists.product_details can not be an empty array';
	END IF;

	FOREACH v_product_detail_id IN ARRAY NEW.product_details
	LOOP
		/*RAISE NOTICE 'evaluando el product_detail_id: %', v_product_detail_id;*/
		IF NOT EXISTS(SELECT 1 FROM product_details WHERE id = v_product_detail_id) THEN
			RAISE EXCEPTION 'There is no record in product_details where id = %', v_product_detail_id;
		END IF;
	END LOOP;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bu_pack_lists BEFORE UPDATE ON pack_lists FOR EACH ROW EXECUTE PROCEDURE fbu_pack_lists();

/* Haciendo no nulos product_details en tabla pack_lists */
ALTER TABLE pack_lists ALTER COLUMN product_details SET NOT NULL;
