/* Eliminar el campo ticket_printer_id en series */
ALTER TABLE series DROP COLUMN ticket_printer_id;

/* Agregar la relación sale_point_id en series */
ALTER TABLE series ADD COLUMN sale_point_id INTEGER;
ALTER TABLE series ADD CONSTRAINT fk_series_sale_point_id FOREIGN KEY (sale_point_id) REFERENCES sale_points(id);

/* Eliminar los campos branch_detail_id y sale_point_id de ticket_printers */
ALTER TABLE ticket_printers DROP COLUMN branch_detail_id;
ALTER TABLE ticket_printers DROP COLUMN sale_point_id;

/* Vaciar la tabla ticket_printers */
TRUNCATE TABLE ticket_printers;

/* Agregar la relación serie_id en ticket_printers */
ALTER TABLE ticket_printers ADD COLUMN serie_id INTEGER NOT NULL;
ALTER TABLE ticket_printers ADD CONSTRAINT fk_ticket_printers_serie_id FOREIGN KEY (serie_id) REFERENCES series(id);
