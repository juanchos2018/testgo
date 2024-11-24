/*
    Crear la tabla para ticketeras
*/

CREATE TABLE ticket_printers
(
  id serial NOT NULL,
  sale_point_id integer NOT NULL,
  branch_detail_id integer NOT NULL,
  printer_serial character varying(15),
  printer_name character varying(255),
  CONSTRAINT "PK_ticket_printer_id" PRIMARY KEY (id),
  CONSTRAINT "FK_ticket_printer_branch_detail_id" FOREIGN KEY (branch_detail_id)
      REFERENCES branch_details (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_ticket_printer_sale_point_id" FOREIGN KEY (sale_point_id)
      REFERENCES sale_points (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

/*
    Agregar la columna opcional ticket_printer_id en la tabla series
*/

ALTER TABLE series ADD COLUMN ticket_printer_id INTEGER;
ALTER TABLE series ADD CONSTRAINT FK_serie_ticket_printer_id FOREIGN KEY (ticket_printer_id) REFERENCES ticket_printers(id);
