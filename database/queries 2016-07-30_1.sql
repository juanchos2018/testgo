/* Agregando guardado de tallas */
CREATE OR REPLACE FUNCTION save_single_tables(character varying[], character varying[], character varying[], character varying[], character varying[], character varying[], character varying[])
  RETURNS SETOF character varying AS
$BODY$
DECLARE
	result CHARACTER VARYING[];
	fields CHARACTER VARYING[];
	description CHARACTER VARYING;
	insert_id INTEGER;
BEGIN
	fields := ARRAY[]::CHARACTER VARYING[];

	IF array_ndims($1) > 0 THEN
		FOREACH description IN ARRAY $1
		LOOP
			INSERT INTO categories (description) VALUES (description) RETURNING id INTO insert_id;
			fields := fields || (insert_id || ':' || description)::CHARACTER VARYING;
		END LOOP;
	END IF;

	result[1] := array_to_string(fields, ',', '');

	fields := ARRAY[]::CHARACTER VARYING[];

	IF array_ndims($2) > 0 THEN
		FOREACH description IN ARRAY $2
		LOOP
			INSERT INTO genders (description) VALUES (description) RETURNING id INTO insert_id;
			fields := fields || (insert_id || ':' || description)::CHARACTER VARYING;
		END LOOP;
	END IF;

	result[2] := array_to_string(fields, ',', '');

	fields := ARRAY[]::CHARACTER VARYING[];

	IF array_ndims($3) > 0 THEN
		FOREACH description IN ARRAY $3
		LOOP
			INSERT INTO ages (description) VALUES (description) RETURNING id INTO insert_id;
			fields := fields || (insert_id || ':' || description)::CHARACTER VARYING;
		END LOOP;
	END IF;

	result[3] := array_to_string(fields, ',', '');

	fields := ARRAY[]::CHARACTER VARYING[];

	IF array_ndims($4) > 0 THEN
		FOREACH description IN ARRAY $4
		LOOP
			INSERT INTO uses (description) VALUES (description) RETURNING id INTO insert_id;
			fields := fields || (insert_id || ':' || description)::CHARACTER VARYING;
		END LOOP;
	END IF;

	result[4] := array_to_string(fields, ',', '');

	fields := ARRAY[]::CHARACTER VARYING[];

	IF array_ndims($5) > 0 THEN
		FOREACH description IN ARRAY $5
		LOOP
			INSERT INTO brands (description) VALUES (description) RETURNING id INTO insert_id;
			fields := fields || (insert_id || ':' || description)::CHARACTER VARYING;
		END LOOP;
	END IF;

	result[5] := array_to_string(fields, ',', '');

	fields := ARRAY[]::CHARACTER VARYING[];

	IF array_ndims($6) > 0 THEN
		FOREACH description IN ARRAY $6
		LOOP
			INSERT INTO subcategories (description) VALUES (description) RETURNING id INTO insert_id;
			fields := fields || (insert_id || ':' || description)::CHARACTER VARYING;
		END LOOP;
	END IF;

	result[6] := array_to_string(fields, ',', '');

	fields := ARRAY[]::CHARACTER VARYING[];

	IF array_ndims($7) > 0 THEN
		FOREACH description IN ARRAY $7
		LOOP
			INSERT INTO size (description) VALUES (description) RETURNING id INTO insert_id;
			fields := fields || (insert_id || ':' || description)::CHARACTER VARYING;
		END LOOP;
	END IF;

	result[7] := array_to_string(fields, ',', '');

	RETURN QUERY SELECT UNNEST(result);
END;
$BODY$
  LANGUAGE plpgsql;
  