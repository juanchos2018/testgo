/* Eliminar la función save_purchase anterior */
DROP FUNCTION save_purchase(json, json[]);

/* Agregar el campo offer_price en detalle de compra */
ALTER TABLE purchase_details ADD COLUMN offer_price REAL NOT NULL DEFAULT 0;

/* Agregar el campo IGV a factura */
ALTER TABLE invoices ADD COLUMN igv REAL NOT NULL DEFAULT 0;
