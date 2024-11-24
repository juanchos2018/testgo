/*
	Eliminar las columnas address, printer_serial y branch_detail_id en la tabla sale_points
*/
ALTER TABLE sale_points DROP COLUMN address;
ALTER TABLE sale_points DROP COLUMN printer_serial;
ALTER TABLE sale_points DROP COLUMN branch_detail_id;

/*
	Eliminar la columna branch_detail_id en la tabla series
*/
ALTER TABLE series DROP COLUMN branch_detail_id;
