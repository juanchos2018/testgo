/* Crear vista que contenga los product_details descontados con las devoluciones */
CREATE VIEW v_refunded_sale_details
AS
SELECT
sd.id,
sd.sale_id,
sd.quantity AS old_quantity,
sd.quantity - SUM(sd2.quantity) AS quantity,
sd.subtotal,
sd.price,
sd.product_barcode_id,
sd.cost,
sd.utility
FROM sale_details sd
INNER JOIN sale_refunds sr ON sd.sale_id = sr.sale_origin_id
INNER JOIN sale_details sd2 ON sr.sale_target_id = sd2.sale_id AND sd.product_barcode_id = sd2.product_barcode_id
GROUP BY
sd2.sale_id,
sd.id,
sd.sale_id,
sd.quantity,
sd.subtotal,
sd.price,
sd.product_barcode_id,
sd.cost,
sd.utility