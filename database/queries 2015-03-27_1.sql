CREATE TABLE prueba
(
  id serial NOT NULL,
  texto character varying(30) NOT NULL
  CONSTRAINT "PK_card_type_id" PRIMARY KEY (id)
);

INSERT INTO prueba (texto) VALUES ('Texto'), ('Otro texto');
