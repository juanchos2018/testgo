ALTER TYPE voucher_type ADD VALUE 'NOTA DE CREDITO';
ALTER TABLE series ALTER COLUMN regime DROP NOT NULL;
INSERT INTO series (serie, serial_number, voucher, regime, tax) VALUES (1, 1, 'NOTA DE CREDITO', NULL, 0);