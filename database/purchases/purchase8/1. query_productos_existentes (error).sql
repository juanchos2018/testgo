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

/* Actualizar stock */
UPDATE stock
SET store_stock = GREATEST(store_stock, 0) + ${this["CANT."]},
last_entry = NOW()::TIMESTAMP WITHOUT TIME ZONE;

END
$do$



