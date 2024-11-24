INSERT INTO stock
(branch_id, product_barcode_id, store_stock, depot_stock, last_entry, last_sale)
VALUES
(
	1,
  	(SELECT product_barcodes.id FROM product_barcodes INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
    INNER JOIN size ON product_barcodes.size_id = size.id INNER JOIN products ON product_details.product_id = products.id WHERE products.code = '${ this.Codigo }'
    AND size.code = '${ this.Talla }'),
  ${ parseInt(this.STOCK) || 0 },
  0,
  ${ this["Ultimo Ingreso"] ? "'" + this["Ultimo Ingreso"] + "'" : "NULL" },
  ${ this["Ultima Salida"] ? "'" + this["Ultima Salida"] + "'" : "NULL" }
);