ALTER TABLE currencies ADD COLUMN exchange_rate REAL NOT NULL DEFAULT 1; /* HASTA 6 DECIMALES */
UPDATE currencies SET description = 'Nuevos Soles' WHERE description = 'Soles';
UPDATE currencies SET description = 'Dólares', exchange_rate = 2.932 WHERE description = 'Dolares';