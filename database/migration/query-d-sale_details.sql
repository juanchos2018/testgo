INSERT INTO sale_details
(sale_id, quantity, price, cost, product_barcode_id)
VALUES
(
	(SELECT id FROM sales WHERE serie = ${ parseInt(parseInt(this.nrodocum).toString().substr(0, 1)) || 0 }
     	AND serial_number = ${ parseInt(parseInt(this.nrodocum).toString().substr(1)) || 0 }),
  	${ parseInt(this.cantidad) || 0 },
  	${ parseFloat(this.precio) || 0 },
  	${ parseFloat(this.costo) || 0 },
  	(SELECT product_barcodes.id FROM product_barcodes INNER JOIN size ON product_barcodes.size_id = size.id
    INNER JOIN product_details ON product_barcodes.product_detail_id = product_details.id
    INNER JOIN products ON product_details.product_id = products.id
    WHERE products.code = '${ this.codarticulo }' AND size.code = '${ this.codtalla }')
);
