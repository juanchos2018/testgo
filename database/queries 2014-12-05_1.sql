/* CREANDO UN INDICE PARA OPTIMIZAR LA BUSQUEDA POR IP */
CREATE INDEX idx_sale_points_addr ON sale_points (address);

UPDATE sale_points SET branch_id = 2 WHERE id = 2;