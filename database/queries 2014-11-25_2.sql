ALTER TABLE sale_details DROP COLUMN product_id;
ALTER TABLE sale_details DROP COLUMN size_id;
ALTER TABLE sale_details ADD COLUMN product_detail_id INTEGER;
ALTER TABLE sale_details ADD CONSTRAINT fk_sale_details_product_detail_id FOREIGN KEY (product_detail_id) REFERENCES product_details(id);