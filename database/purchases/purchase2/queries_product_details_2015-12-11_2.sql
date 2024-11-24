UPDATE product_details
SET price = '${this["P SIN TARJETA"]}',
offer_price = '${this["P CON TARJETA"]}',
cost = '${this["CTO REPO"]}',
cost_currency = 'S',
currency_cost = 'S',
invoice_currency = 'S',
invoice_cost = '${this["C.U. SEGUN FACTURA"]}'
WHERE product_id = (SELECT products.id FROM products WHERE products.code = '${this["CODIGO"]}');