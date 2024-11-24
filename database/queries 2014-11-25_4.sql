ALTER TABLE sales ADD COLUMN regime regime_type;
ALTER TABLE sales ADD COLUMN serie INTEGER;
ALTER TABLE sales ADD COLUMN serial_number INTEGER;

ALTER TABLE sale_details RENAME COLUMN precio TO price;
ALTER TABLE sale_details DROP COLUMN igv;