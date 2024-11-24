DO
$do$
DECLARE
   v_product_barcode_id INTEGER;
BEGIN

/* Actualizar los costos y precios en product_details */
UPDATE product_details SET 
price = ${ this['P ANTES'] },
offer_price = ${ this['P OFERRTA'] },
invoice_currency = '${ this['MONEDAFACT'] }',
invoice_cost = ${ this['C.U. SEGUN FACTURA LFA'] },
cost = ${ this['C.U. A REPONER LFA'] },
cost_currency = '${ this['MONEDA REPO'] }',
currency_cost = '${ this['MONEDA REPO'] }'
WHERE id = ${ this.product_detail_id };

/* Actualizar la DS para los productos */
UPDATE products SET output_statement = '${ this['DECLARACION DE SALIDA'] }' WHERE id = ${ this.product_id };

/* Ingresar los códigos de barra */
INSERT INTO product_barcodes
(size_id, old_barcode, product_detail_id)
VALUES
(
(SELECT size.id FROM size WHERE size.description = '${this.TALLA}'),
  '${this["CODIGO DE BARRAS"]}',
  ${ this.product_detail_id }
) RETURNING id INTO v_product_barcode_id;

/* Ingresar stock */
INSERT INTO stock (branch_id, product_barcode_id, store_stock, last_entry)
VALUES
(
  1,
  v_product_barcode_id,
  ${this["CANT."]},
  NOW()::TIMESTAMP WITHOUT TIME ZONE
);

END
$do$



