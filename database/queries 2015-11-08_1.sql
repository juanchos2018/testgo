/* Vinculamos en cascada la serie con el punto de venta */
ALTER TABLE series DROP CONSTRAINT "fk_series_sale_point_id",
ADD CONSTRAINT "fk_series_sale_point_id" FOREIGN KEY (sale_point_id) REFERENCES sale_points (id) ON DELETE CASCADE;

/* Vinculamos en cascada la ticketera con la serie */
ALTER TABLE ticket_printers DROP CONSTRAINT "fk_ticket_printers_serie_id",
ADD CONSTRAINT "fk_ticket_printers_serie_id" FOREIGN KEY (serie_id) REFERENCES series (id) ON DELETE CASCADE;
