INSERT INTO product_details
(company_id, price, offer_price, cost, cost_currency, currency_cost, invoice_currency, invoice_cost, product_id)
VALUES
(
  1,
  '${this["P SIN TARJETA"]}',
  '${this["P CON TARJETA"]}',
  '${this["CTO REPO"]}',
  'S',
  'S',
  'S',
  '${this["C.U. SEGUN FACTURA"]}',
  (SELECT products.id FROM products WHERE products.code = '${this["CODIGO"]}')
);