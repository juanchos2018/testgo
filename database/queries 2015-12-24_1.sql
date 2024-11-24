/* Crear la tabla con las razones de devolución */
CREATE TABLE refund_reasons
(
  id serial NOT NULL,
  description character varying(30) NOT NULL,
  CONSTRAINT "PK_refund_reasons_id" PRIMARY KEY (id)
);

/* Agregamos los valores a la tabla refund_reason */
INSERT INTO refund_reasons
(description)
VALUES
('Anulación'),
('Descuentos'),
('Bonificaciones'),
('Devoluciones'),
('Otros');

/* La columna refund_reason_id solo se debe llenar si se relaciona una venta con una nota de crédito (from_sale = TRUE) */
ALTER TABLE sale_refunds ADD COLUMN refund_reason_id INTEGER;
/* El campo other_refund_reason solo se llena si se eligió Otros en refund_reason_id */
ALTER TABLE sale_refunds ADD COLUMN other_refund_reason CHARACTER VARYING (255);

ALTER TABLE sale_refunds ADD CONSTRAINT fk_sale_refunds_reason_id FOREIGN KEY (refund_reason_id) REFERENCES refund_reasons(id);