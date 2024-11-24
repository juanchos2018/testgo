/* Agregando Costo Factura, Costo, PVP y Precio Oferta en Inventario */
ALTER TABLE initial_stocks 
ADD COLUMN invoice_currency character(1) NOT NULL DEFAULT 'S',
ADD COLUMN invoice_cost real NOT NULL DEFAULT 0,
ADD COLUMN cost_currency character(1) NOT NULL DEFAULT 'S',
ADD COLUMN cost real NOT NULL DEFAULT 0,
ADD COLUMN pvp real NOT NULL DEFAULT 0,
ADD COLUMN offer_price real NOT NULL DEFAULT 0;