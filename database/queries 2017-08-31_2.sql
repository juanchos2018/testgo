/* Eliminar la función anterior para guardar campañas */
DROP FUNCTION IF EXISTS save_campaign(JSON, INTEGER[], JSON[]);

/* Función para guardar paquetes de campañas */
CREATE OR REPLACE FUNCTION save_packs(
  p_campaign_id INTEGER,
  p_packs JSON[]
)
  RETURNS VOID AS
$BODY$
DECLARE
  v_pack JSON;
  v_pack_id INTEGER;
  v_list JSON;
BEGIN
  FOREACH v_pack IN ARRAY p_packs
  LOOP
    IF (v_pack->>'id') IS NULL THEN
      INSERT INTO packs (campaign_id, active, company_id, description, regime, price)
      VALUES (
        p_campaign_id,
        (v_pack->>'active')::BOOLEAN,
        (v_pack->>'company_id')::INTEGER,
        v_pack->>'description',
        (v_pack->>'regime')::regime_type,
        (v_pack->>'price')::NUMERIC(10,2)
      ) RETURNING id INTO v_pack_id;
    ELSE
      v_pack_id = (v_pack->>'id')::INTEGER;

      UPDATE packs SET
        campaign_id = p_campaign_id,
        active = (v_pack->>'active')::BOOLEAN,
        company_id = (v_pack->>'company_id')::INTEGER,
        description = v_pack->>'description',
        regime = (v_pack->>'regime')::regime_type,
        price = (v_pack->>'price')::NUMERIC(10,2)
      WHERE id = v_pack_id;
    END IF;

    FOR v_list IN SELECT * FROM json_array_elements((v_pack->>'lists')::JSON)
    LOOP
      RAISE NOTICE 'Nuevo product_details: %', REPLACE(REPLACE(v_list->>'product_details', '[', '{'), ']', '}');
      IF (v_list->>'id') IS NULL THEN
        INSERT INTO pack_lists (pack_id, unit_price, quantity, product_details) VALUES (
          v_pack_id,
          (v_list->>'unit_price')::NUMERIC(10,2),
          (v_list->>'quantity')::INTEGER,
          REPLACE(REPLACE(v_list->>'product_details', '[', '{'), ']', '}')::INTEGER[]
        );
      ELSE
        UPDATE pack_lists SET
          pack_id = v_pack_id,
          unit_price = (v_list->>'unit_price')::NUMERIC(10,2),
          quantity = (v_list->>'quantity')::INTEGER,
          product_details = REPLACE(REPLACE(v_list->>'product_details', '[', '{'), ']', '}')::INTEGER[]
        WHERE id = (v_list->>'id')::INTEGER;
      END IF;
    END LOOP;
  END LOOP;
END;
$BODY$
  LANGUAGE plpgsql;
  