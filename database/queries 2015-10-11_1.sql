/* Vinculamos en cascada la ticketera con el punto de venta */
ALTER TABLE ticket_printers DROP CONSTRAINT "FK_ticket_printer_sale_point_id",
ADD CONSTRAINT "FK_ticket_printer_sale_point_id" FOREIGN KEY (sale_point_id) REFERENCES sale_points (id) ON DELETE CASCADE;

/* Vinculamos en cascada el número de serie a la ticketera (si existiera relación) */
ALTER TABLE series DROP CONSTRAINT "fk_serie_ticket_printer_id",
ADD CONSTRAINT "fk_serie_ticket_printer_id" FOREIGN KEY (ticket_printer_id) REFERENCES ticket_printers (id) ON DELETE CASCADE;
