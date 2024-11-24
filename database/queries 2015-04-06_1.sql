ALTER TABLE purchase_orders DROP COLUMN supplier_id;

DROP TABLE suppliers CASCADE;
ALTER TABLE supplier RENAME TO suppliers;
ALTER TABLE purchase_orders ADD COLUMN supplier_id INTEGER NOT NULL;
ALTER TABLE purchase_orders ADD CONSTRAINT FK_purchase_order_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id);
ALTER TABLE purchases ADD CONSTRAINT FK_purchase_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id);