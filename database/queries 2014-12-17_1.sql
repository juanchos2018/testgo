ALTER TABLE sale_points ALTER COLUMN address TYPE CHARACTER VARYING(50);
ALTER TABLE sale_points ADD COLUMN description CHARACTER VARYING(50) NOT NULL DEFAULT '';

UPDATE sale_points SET address = 'MDAtMDAtMDAtMDAtMDAtMDA='; /* MAC 00-00-00-00-00-00 para pruebas */
UPDATE sale_points SET description = 'Principal' WHERE id = 1;
UPDATE sale_points SET description = 'Entrada' WHERE id > 1;

/* OJO: la siguiente consulta es SOLO para el servidor, debido a que las direcciones NO SE DEBEN REPETIR para una misma sucursal (branch_id) */
DELETE FROM series WHERE sale_point_id = 2 OR sale_point_id = 4;
DELETE FROM sale_points WHERE id = 2 or id = 4;