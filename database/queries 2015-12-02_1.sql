/* Crear campos de coste de factura */
ALTER TABLE product_details ADD COLUMN invoice_currency CHAR(1) NOT NULL DEFAULT 'S';
ALTER TABLE product_details ADD COLUMN invoice_cost REAL NOT NULL DEFAULT 0;