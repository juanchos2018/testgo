/* Eliminando la relación entre compras y empresas */
ALTER TABLE purchases DROP CONSTRAINT "FK_purchase_company_id";

/* Vinculando compras a una empresa/sucursal */
ALTER TABLE purchases RENAME COLUMN company_id TO branch_detail_id;
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_branch_detail_id
   FOREIGN KEY (branch_detail_id)
   REFERENCES branch_details(id)
   ON DELETE CASCADE;

/* Renombrando tabla purchases_detail a purchase_details (en plural) */
ALTER TABLE purchases_detail RENAME TO purchase_details;

/* Vinculando detalle de compra a factura */
ALTER TABLE purchase_details ADD COLUMN invoice_id INTEGER;
ALTER TABLE purchase_details ADD CONSTRAINT "FK_purchase_details_invoice_id"
   FOREIGN KEY (invoice_id)
   REFERENCES invoices(id)
   ON DELETE CASCADE;

/* Renombrando columna update_date de tabla facturas */
ALTER TABLE invoices RENAME COLUMN update_date TO updated_at;
