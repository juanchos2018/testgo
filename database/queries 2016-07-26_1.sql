/* Agregar campo de gastos en compras */
ALTER TABLE purchases ADD COLUMN expenses REAL NOT NULL DEFAULT 0;

/* Renombrar campo de costo en detalle de compra */
ALTER TABLE purchase_details RENAME COLUMN cost TO invoice_cost;
