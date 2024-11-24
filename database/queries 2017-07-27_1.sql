/* Agregamos la columna exchange_rate en initial_stocks */
ALTER TABLE initial_stocks ADD COLUMN exchange_rate DECIMAL(4,2);

/* Llenando datos de tipo de cambio para años 2016 y 2017 */
UPDATE initial_stocks SET exchange_rate = 3.5 WHERE cost_currency = 'D' OR invoice_currency = 'D' and year = 2016;
UPDATE initial_stocks SET exchange_rate = 3.5 WHERE cost_currency = 'D' OR invoice_currency = 'D' and year = 2017;

/* Agregando restricción para ingresar tipo de cambio cuando no sean Soles */
ALTER TABLE initial_stocks ADD CONSTRAINT check_exchange_rate CHECK ((cost_currency = 'S' AND invoice_currency = 'S') OR exchange_rate IS NOT NULL);
