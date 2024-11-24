/* Editando el trigger en ventas para que se reduzca el monto en caja si se ANULA una venta */
CREATE OR REPLACE FUNCTION on_new_sales()
  RETURNS trigger AS
$BODY$
BEGIN
	IF NEW.voucher = 'NOTA DE CREDITO' OR (NEW.active = FALSE AND OLD.active = TRUE) THEN
		UPDATE sale_points SET cash_amount = (cash_amount - NEW.cash_amount)
		WHERE id = NEW.sale_point_id;
	ELSE
		UPDATE sale_points SET cash_amount = (cash_amount + NEW.cash_amount)
		WHERE id = NEW.sale_point_id;
	END IF;

	RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql;