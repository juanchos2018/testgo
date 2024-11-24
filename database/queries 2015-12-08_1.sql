/* Asignar a los montos de puntos de venta, un valor por defecto de cero */
ALTER TABLE sale_points ALTER COLUMN initial_amount SET DEFAULT 0;
ALTER TABLE sale_points ALTER COLUMN cash_amount SET DEFAULT 0;

/* Asignar cero a los valores nulos */
UPDATE sale_points SET initial_amount = 0, cash_amount = 0;
/* Aunque solo usaremos cash_amount (que sería el monto en efectivo) */

/* Agregar el campo last_closing_cash */
ALTER TABLE sale_points ADD COLUMN last_closing_cash TIMESTAMP WITHOUT TIME ZONE;