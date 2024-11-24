
/* Agregar el campo supplier_id */
ALTER TABLE invoices ADD COLUMN supplier_id INTEGER NOT NULL;
ALTER TABLE invoices ADD CONSTRAINT fk_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id);
