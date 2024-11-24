INSERT INTO product_details
(company_id, price, offer_price, cost, cost_currency, currency_cost, invoice_currency, invoice_cost, product_id)
VALUES
(
  1,
  '${this["P ANTES"]}',
  '${this["P OFERRTA"]}',
  '${this["CTO REPO"]}',
  'S',
  'S',
  '${this.MONEDAFACT}',
  '${this["C.U. SEGUN FACTURA"]}',
  (SELECT products.id FROM products WHERE products.code = '${this["CODIGO"]}')
);