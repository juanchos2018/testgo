/* Agregando el tipo de cambio en compras */
ALTER TABLE purchases ADD COLUMN exchange_rate DECIMAL(10, 2);

/* Asignando 3.6 como tipo de cambio para las compras registradas previamente */
UPDATE purchases SET exchange_rate = 3.6 WHERE currency = 'D';

/* En producción las compras no tuvieron precios autocalculados */
UPDATE purchases SET automatic_prices = FALSE;