/* Vinculando facturas a una compra (ingreso) */
ALTER TABLE invoices ADD COLUMN purchase_id INTEGER NOT NULL;
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_purchase_id FOREIGN KEY (purchase_id) REFERENCES purchases(id);

/* Eliminando relación de proveedor en factura, ya que se encuentra en compras */
ALTER TABLE invoices DROP COLUMN supplier_id;
