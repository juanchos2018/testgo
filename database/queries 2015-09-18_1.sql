/* Asignamos la fecha actual como fecha de registro para los usuarios que no tengan ese campo lleno */
UPDATE customers SET registered_at = NOW() WHERE registered_at IS NULL;
/* No permitimos NULO como válido en la fecha de registro */
ALTER TABLE customers ALTER COLUMN registered_at DROP NOT NULL;