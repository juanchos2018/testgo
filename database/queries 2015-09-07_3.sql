/* Crear la vista product_sizes para obtener los productos y sus tallas */
CREATE OR REPLACE VIEW product_sizes AS
SELECT DISTINCT product_details.product_id, product_barcodes.size_id, size.code, size.description FROM product_barcodes
INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
INNER JOIN size ON product_barcodes.size_id = size.id
WHERE size.active = TRUE
