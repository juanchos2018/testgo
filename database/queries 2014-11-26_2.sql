ALTER TABLE sale_points DROP COLUMN company_id;
ALTER TABLE sale_points ADD COLUMN branch_id INTEGER;
ALTER TABLE sale_points ADD CONSTRAINT fk_sale_points_branch_id FOREIGN KEY (branch_id) REFERENCES branches(id);
