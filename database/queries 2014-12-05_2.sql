ALTER TABLE series ALTER COLUMN sale_point_id SET DEFAULT NULL;
UPDATE series SET sale_point_id = NULL WHERE voucher = 'BOLETA';