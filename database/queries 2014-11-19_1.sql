UPDATE currencies SET description = 'Soles' WHERE description = 'Nuevos Soles';

CREATE TABLE card_types
(
  id serial NOT NULL,
  description character varying(30) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT "PK_card_type_id" PRIMARY KEY (id)
);

INSERT INTO card_types (description) VALUES ('VISA'), ('MASTERCARD');