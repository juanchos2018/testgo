ALTER TABLE series RENAME COLUMN "number" TO serial_number;
ALTER TABLE series ADD COLUMN voucher voucher_type NOT NULL;
ALTER TABLE series ADD COLUMN regime regime_type;
ALTER TABLE series ADD COLUMN tax INTEGER NOT NULL DEFAULT 0;

INSERT INTO series (serie, serial_number, voucher, regime, tax) VALUES (1, 1, 'BOLETA', 'General', 18);
INSERT INTO series (serie, serial_number, voucher, regime, tax) VALUES (1, 1, 'BOLETA', 'ZOFRA', 0);