/* Agregando un Alias a los Tipos de Documentos */
ALTER TABLE series ADD COLUMN abbrev CHARACTER VARYING(4);
UPDATE series SET abbrev = 'TKT' WHERE voucher = 'TICKET';
UPDATE series SET abbrev = 'N/C' WHERE voucher = 'NOTA DE CREDITO';
UPDATE series SET abbrev = 'BOL' WHERE voucher = 'BOLETA';
