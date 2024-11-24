/* Crear la vista serie_printers para facilitar las consultas de ventas */
CREATE VIEW serie_printers
AS
SELECT
sale_points.id AS sale_point_id,
sale_points.description AS sale_point,
sale_points.active,
series.serie,
series.serial_number,
series.voucher,
series.subsidiary_journal,
branch_details.branch_id,
branch_details.company_id,
ticket_printers.printer_serial,
ticket_printers.printer_name
FROM series
INNER JOIN sale_points ON series.sale_point_id = sale_points.id
INNER JOIN branch_details ON series.branch_detail_id = branch_details.id
INNER JOIN ticket_printers ON series.id = ticket_printers.serie_id;
