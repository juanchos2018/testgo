ALTER TABLE companies ADD COLUMN regime regime_type NOT NULL DEFAULT 'General';
UPDATE companies SET regime = 'ZOFRA' WHERE id = 1;
UPDATE companies SET regime = 'General' WHERE id = 2;