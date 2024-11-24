/* Agregando campo regime a series (útil para BOLETAS y FACTURAS manuales) */
ALTER TABLE series ADD COLUMN regime regime_type;
UPDATE series SET regime = 'General'::regime_type WHERE voucher = 'BOLETA'::voucher_type OR voucher = 'FACTURA'::voucher_type;
