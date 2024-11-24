/* [Punto de Venta] Agregando Monto Inicial y Actual a Punto de Venta*/
ALTER TABLE sale_points ADD COLUMN initial_amount real;
ALTER TABLE sale_points ADD COLUMN cash_amount real; 