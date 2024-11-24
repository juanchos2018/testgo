/* Agregar aprobado por en compras */
ALTER TABLE purchases ADD COLUMN approved_by INTEGER;
ALTER TABLE purchases ADD COLUMN approved_at TIMESTAMP WITHOUT TIME ZONE;
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_approved_by_id FOREIGN KEY (approved_by) REFERENCES users(id);

/* Agregar actualizado por en compras */
ALTER TABLE purchases ADD COLUMN updated_by INTEGER;
ALTER TABLE purchases ADD COLUMN updated_at TIMESTAMP WITHOUT TIME ZONE;
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_updated_by_id FOREIGN KEY (updated_by) REFERENCES users(id);

/* Agregar registrado por en compras */
ALTER TABLE purchases ADD COLUMN registered_by INTEGER;
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_registered_by_id FOREIGN KEY (registered_by) REFERENCES users(id);

/* Agregar fecha de registro en compras */
ALTER TABLE purchases ADD COLUMN registered_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW();

/* En compras eliminar descripción */
ALTER TABLE purchases DROP COLUMN description;

/* Cambiar el tipo de input_date a fecha */
ALTER TABLE purchases ALTER COLUMN input_date TYPE DATE;

/* Agregar el campo purchase_order_id en compras, para vincularlo a un pedido */
ALTER TABLE purchases ADD COLUMN purchase_order_id INTEGER;
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_purchase_order_id FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id);

/* Agregar el campo utilidad en compras */
ALTER TABLE purchases ADD COLUMN utility INTEGER NOT NULL DEFAULT 0;

/* Agregar el campo cantidad en detalle de compras */
ALTER TABLE purchase_details ADD COLUMN quantity INTEGER NOT NULL;

/* Cambiar el tipo de date a DATE en facturas */
ALTER TABLE invoices ALTER COLUMN date TYPE DATE;

/* Quitar el timezone de updated_at en facturas */
ALTER TABLE invoices ALTER COLUMN updated_at TYPE TIMESTAMP WITHOUT TIME ZONE;