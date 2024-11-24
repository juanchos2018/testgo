/* Crear la tabla para almacenar las relaciones de devoluciones */

CREATE TABLE sale_refunds
(
  id serial NOT NULL,
  sale_origin_id integer NOT NULL,
  sale_target_id integer NOT NULL,
  from_sale boolean NOT NULL,
  CONSTRAINT "PK_sale_refund_id" PRIMARY KEY (id),
  CONSTRAINT fk_sale_refunds_sale_origin_id FOREIGN KEY (sale_origin_id)
      REFERENCES sales (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_sale_refunds_sale_target_id FOREIGN KEY (sale_target_id)
      REFERENCES sales (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

/*
    OJO: falta una consulta para migrar los refund_origin_id y refund_target_id de sales, a la tabla sale_refunds, cuando tenga internet la pongo
*/