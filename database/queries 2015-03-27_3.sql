CREATE TABLE prueba
(
  id serial NOT NULL,
  texto character varying(30) NOT NULL
);

INSERT INTO prueba (texto) VALUES ('Texto'), ('Otro texto');
