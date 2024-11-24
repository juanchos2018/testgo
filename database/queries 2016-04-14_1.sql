/* Crear la función para guardar una campaña con sus respectivos combos (ofertas) */
CREATE OR REPLACE FUNCTION save_campaign(
    json,
    integer[],
    json[])
  RETURNS integer AS
$BODY$
DECLARE
	v_campaign_id INTEGER;
	v_branch_id INTEGER;
	v_offer JSON;
	v_offer_id INTEGER;
	v_detail JSON;
BEGIN
	INSERT INTO campaigns (
		description,
		start_date,
		end_date,
		active,
		start_time,
		end_time,
		branch_id
	) VALUES (
		$1->>'description',
		($1->>'start_date')::DATE,
		CASE WHEN ($1->>'end_date') IS NULL THEN NULL ELSE ($1->>'end_date')::DATE END,
		($1->>'active')::BOOLEAN,
		CASE WHEN ($1->>'start_time') IS NULL THEN NULL ELSE ($1->>'start_time')::TIME WITHOUT TIME ZONE END,
		CASE WHEN ($1->>'end_time') IS NULL THEN NULL ELSE ($1->>'end_time')::TIME WITHOUT TIME ZONE END,
		CASE WHEN ($1->>'branch_id') IS NULL THEN NULL ELSE ($1->>'branch_id')::INTEGER END
	) RETURNING id INTO v_campaign_id;

	IF array_length($2, 1) > 0 THEN
		FOREACH v_branch_id IN ARRAY $2
		LOOP
			INSERT INTO campaign_places (campaign_id, branch_id) VALUES (v_campaign_id, v_branch_id);
		END LOOP;
	END IF;

	FOREACH v_offer IN ARRAY $3
	LOOP
		INSERT INTO offers (
			description,
			price,
			campaign_id,
			active
		) VALUES (
			v_offer->>'description',
			(v_offer->>'price')::REAL,
			v_campaign_id,
			(v_offer->>'active')::BOOLEAN
		) RETURNING id INTO v_offer_id;

		FOR v_detail IN SELECT * FROM json_array_elements(v_offer->'details')
		LOOP
			INSERT INTO offer_details (
				offer_id,
				price,
				product_detail_id,
				quantity
			) VALUES (
				v_offer_id,
				(v_detail->>'price')::REAL,
				(v_detail->>'product_detail_id')::INTEGER,
				(v_detail->>'quantity')::INTEGER
			);
		END LOOP;
	END LOOP;

	/* Se refresca la vista materializada */
	REFRESH MATERIALIZED VIEW mv_offers;
	
	RETURN v_campaign_id;
END;
$BODY$
  LANGUAGE plpgsql;