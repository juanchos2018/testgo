UPDATE stock
SET
store_stock = store_stock + ${this["CANT."]},
last_entry = '${this.FECHA.split("/").reverse().join("-")}'::TIMESTAMP WITHOUT TIME ZONE
WHERE
branch_id = 1 AND
product_barcode_id = (
	SELECT product_barcodes.id FROM product_barcodes INNER JOIN
  	product_details ON product_barcodes.product_detail_id = product_details.id INNER JOIN
  	products ON product_details.product_id = products.id
  	WHERE products.code = '${this.CODIGO}' AND product_barcodes.size_id = (SELECT size.id FROM size WHERE size.description = '${this.TALLA}')
)