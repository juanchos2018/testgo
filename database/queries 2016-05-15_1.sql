/* Agregar el campo registered_at en purchase_orders */
ALTER TABLE purchase_orders ADD COLUMN registered_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()::TIMESTAMP WITHOUT TIME ZONE;
