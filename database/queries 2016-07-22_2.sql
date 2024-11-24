/* Agregar la moneda en compras */
ALTER TABLE purchases ADD COLUMN currency CHAR(1) NOT NULL DEFAULT 'S';
