ALTER TABLE sale_points ADD COLUMN company_id INTEGER;
ALTER TABLE sale_points ADD CONSTRAINT fk_sale_point_company_id FOREIGN KEY (company_id) REFERENCES companies(id);

UPDATE sale_points SET company_id = (SELECT id FROM companies ORDER BY id ASC LIMIT 1);

ALTER TABLE sale_points ALTER COLUMN company_id SET NOT NULL;

/* AGREGANDO MI IP */
UPDATE sale_points SET address = '192.168.0.13';
INSERT INTO sale_points (address, printer_serial, cash, company_id) VALUES ('192.168.0.13', 'FFGFYYXX', 0, (SELECT id FROM companies ORDER BY id DESC LIMIT 1));
