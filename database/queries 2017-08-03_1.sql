/* Corrigiendo trigger que impedía edición de packs */
CREATE OR REPLACE FUNCTION public.fau_packs()
  RETURNS trigger AS
$BODY$
BEGIN
	/*RAISE NOTICE 'Actualizar unit_price: %, donde pack_id = %', NEW.price / NEW.combinations, NEW.id;*/
	IF NEW.combinations IS NOT NULL THEN
		UPDATE pack_lists SET unit_price = NEW.price / NEW.combinations WHERE pack_id = NEW.id;
	END IF;
	
	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql;
