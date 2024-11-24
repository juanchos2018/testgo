/* La siguiente vista muestra todos los datos de series, desplegando los datos de sucursal y empresa */
CREATE VIEW v_series
AS
SELECT
 s.id,
 s.serie,
 s.serial_number,
 s.voucher,
 s.subsidiary_journal,
 b.id AS branch_id,
 b.alias AS branch_name,
 c.id AS company_id,
 c.name AS company_name,
 sp.id AS sale_point_id,
 sp.description AS sale_point_name
FROM series s
INNER JOIN branch_details bd ON s.branch_detail_id = bd.id
INNER JOIN branches b ON bd.branch_id = b.id
INNER JOIN companies c ON bd.company_id = c.id
LEFT OUTER JOIN sale_points sp ON s.sale_point_id = sp.id;

/* CUIDADO: la siguiente consulta elimina TODAS las series que NO TENGAN branch_detail_id asignado */
DELETE FROM series WHERE branch_detail_id IS NULL;
