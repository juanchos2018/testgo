/* Agregar el campo automatic_prices para determinar si los precios en la compra fueron calculados automáticamente */
ALTER TABLE purchases ADD COLUMN automatic_prices BOOLEAN NOT NULL DEFAULT TRUE;
