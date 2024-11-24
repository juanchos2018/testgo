/* Agregando campo consignado a compras */
ALTER TABLE purchases ADD COLUMN consigned BOOLEAN NOT NULL DEFAULT FALSE;
