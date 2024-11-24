/* Modificando la relación entre purchase_orders y purchase_order_details para que se elimine en cascada */
ALTER TABLE purchase_order_details DROP CONSTRAINT "fk_purchase_orders_id",
ADD CONSTRAINT "fk_purchase_orders_id" FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders (id) ON DELETE CASCADE;