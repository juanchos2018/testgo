INSERT INTO product_barcodes
(size_id, old_barcode, product_detail_id)
VALUES
(
(SELECT size.id FROM size WHERE size.description = '${this.TALLA}'),
  '${this["CODIGO DE BARRAS"]}',
  (SELECT product_details.id FROM product_details INNER JOIN products ON product_details.product_id = products.id WHERE products.code = '${this.CODIGO}')
);