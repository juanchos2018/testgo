/* Creando tabla para facturas */

CREATE TABLE invoices
(
  id serial NOT NULL,
  serie integer NOT NULL,
  serial integer NOT NULL,
  date timestamp without time zone NOT NULL,
  amount real NOT NULL DEFAULT 0,
  file character varying(255),
  update_date timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT "PK_invoices_id" PRIMARY KEY (id)
);
