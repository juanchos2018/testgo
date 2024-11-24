/* Creando vista v_transfer_details para mostrar detalle de traslado con codigo de barra */

DROP VIEW IF EXISTS v_transfer_details;
CREATE VIEW v_transfer_details
AS
SELECT 
trd.id,
trd.transfer_id,
p.id AS product_id,
p.code,
s.description AS size,
trd.quantity,
pb.old_barcode,
pd.id AS product_detail_id,
pd.price,
pd.offer_price,
p.description,
bra.description AS brand,
g.serie AS guide
FROM transfer_details trd
INNER JOIN product_barcodes pb ON trd.product_barcode_id = pb.id
INNER JOIN size s ON pb.size_id = s.id
INNER JOIN product_details pd ON pb.product_detail_id = pd.id
INNER JOIN products p ON pd.product_id = p.id
LEFT JOIN brands bra ON p.brand_id = bra.id
LEFT JOIN guides g ON trd.guide_id = g.id
