UPDATE product_details
SET price = '${this["P ANTES"]}',
offer_price = '${this["P OFERRTA"]}',
cost = '${this["CTO REPO"]}',
cost_currency = 'S',
currency_cost = 'S',
invoice_currency = '${this.MONEDAFACT}',
invoice_cost = '${this["C.U. SEGUN FACTURA"]}'
WHERE product_id = (SELECT products.id FROM products WHERE products.code = '${this["CODIGO"]}');