INSERT INTO product_details
  (product_id, company_id, price, cost, currency_cost, offer_price, invoice_currency, invoice_cost)
VALUES
(
  (SELECT id FROM products WHERE code = '${this.Codigo}'),
  1,
  '${this.PVP}',
  '${this["CTO REPO"]}',
  '${this["Moneda"]}',
  '${this["P.Oferta"]}',
  '${this.Moneda2 || "S"}',
  '${this["COSTO FACT"] || "0"}'
);
