/* Quiter el campo product_id de purchase_order_details */
ALTER TABLE purchase_order_details DROP COLUMN product_id;
/* Agregar el campo product_detail_id */
ALTER TABLE purchase_order_details ADD COLUMN product_detail_id INTEGER NOT NULL;
ALTER TABLE purchase_order_details ADD CONSTRAINT fk_product_details_id FOREIGN KEY (product_detail_id) REFERENCES product_details(id);
/* Agregar el campo branch_detail_id que relaciona empresa/sucursal en purchase_orders */
ALTER TABLE purchase_orders ADD COLUMN branch_detail_id INTEGER NOT NULL;
ALTER TABLE purchase_orders ADD CONSTRAINT fk_branch_details_id FOREIGN KEY (branch_detail_id) REFERENCES branch_details(id);
