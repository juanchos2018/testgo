ALTER TYPE voucher_type ADD VALUE 'TICKET';
UPDATE series SET sale_point_id = 1; /* TEMPORAL */
INSERT INTO series (serie, serial_number, voucher, sale_point_id) VALUES (1, 1, 'TICKET', 1);
