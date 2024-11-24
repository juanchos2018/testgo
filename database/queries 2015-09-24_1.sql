/*Cambiando branch_id por branch_details*/
ALTER TABLE sale_points DROP branch_id;
ALTER TABLE sale_points ADD COLUMN branch_detail_id INTEGER;
ALTER TABLE sale_points ADD CONSTRAINT fk_sale_points_branch_detail_id FOREIGN KEY	(branch_detail_id) REFERENCES branch_details(id);