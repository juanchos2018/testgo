/* Cambiando la serie y el serial de Facturas por un solo campo */
ALTER TABLE invoices DROP COLUMN serie, DROP COLUMN serial;
ALTER TABLE invoices ADD COLUMN serie CHARACTER VARYING (15) NOT NULL;
