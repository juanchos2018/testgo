INSERT INTO product_details (company_id, price, offer_price, cost, cost_currency, currency_cost, invoice_currency, invoice_cost, product_id) VALUES ( 1, '29', '8', '29', 'S', 'S', 'S', '29', (SELECT products.id FROM products WHERE products.code = 'BOL CHIMP') );
INSERT INTO product_details (company_id, price, offer_price, cost, cost_currency, currency_cost, invoice_currency, invoice_cost, product_id) VALUES ( 1, '29', '5', '29', 'S', 'S', 'S', '29', (SELECT products.id FROM products WHERE products.code = 'BOL MOCH') );
INSERT INTO product_details (company_id, price, offer_price, cost, cost_currency, currency_cost, invoice_currency, invoice_cost, product_id) VALUES ( 1, '29', '19', '29', 'S', 'S', 'S', '29', (SELECT products.id FROM products WHERE products.code = 'N011935') );