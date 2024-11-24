/* Cambiar el tipo de nro_inticard de CADENA a ENTERO */
ALTER TABLE customers ALTER COLUMN nro_inticard TYPE INTEGER USING (nro_inticard::INTEGER);
