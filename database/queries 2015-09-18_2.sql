/* Hacemos que la columan registered_at de customers sea NO NULA */
ALTER TABLE customers ALTER COLUMN registered_at set NOT NULL;
