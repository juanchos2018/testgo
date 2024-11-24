/* Crear la tabla para las guias de remision */
CREATE TABLE guides
(
  id serial NOT NULL,
  date date NOT NULL,
  file character varying(255),
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  transfer_id integer NOT NULL,
  serie character varying(15) NOT NULL,
  CONSTRAINT pk_guides_id PRIMARY KEY (id),
  CONSTRAINT fk_guides_transfers_id FOREIGN KEY (transfer_id)
      REFERENCES transfers (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)