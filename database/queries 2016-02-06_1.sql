/* Redondear a 2 decimales el igv */
UPDATE sales SET igv = ROUND(igv::NUMERIC,2);

/* Cambiar el tipo REAL a NUMERIC del campo igv */
ALTER TABLE sales ALTER COLUMN igv TYPE NUMERIC(8,2);