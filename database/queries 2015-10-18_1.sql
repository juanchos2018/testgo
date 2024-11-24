/* Eliminar la columna sale_point_id en series, porque ya tiene relación con una ticketera */
ALTER TABLE series DROP COLUMN sale_point_id;
/* Crear la columna branch_detail_id donde siempre se debe especificar a qué empresa/sucursal pertence la serie */
ALTER TABLE series ADD COLUMN branch_detail_id INTEGER;
ALTER TABLE series ADD CONSTRAINT FK_serie_branch_detail_id FOREIGN KEY (branch_detail_id) REFERENCES branch_details(id);
