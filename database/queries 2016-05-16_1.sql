/* Agregando campo de cantidad entregada de detalle de pedido para mostrar unas barritas chulas */
ALTER TABLE purchase_order_details ADD COLUMN arrived_quantity INTEGER NOT NULL DEFAULT 0;
