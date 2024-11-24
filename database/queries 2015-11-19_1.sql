/* Crear un trigger para que actualize el monto de caja al realizar un venta */
CREATE OR REPLACE FUNCTION on_new_sales()
  RETURNS trigger AS
$BODY$
BEGIN
	IF(NEW.voucher = 'NOTA DE CREDITO') THEN
		UPDATE sale_points SET cash_amount = (cash_amount - NEW.cash_amount)
		WHERE id = NEW.sale_point_id;
	ELSE
		UPDATE sale_points SET cash_amount = (cash_amount + NEW.cash_amount)
		WHERE id = NEW.sale_point_id;
	END IF;
	--INSERT INTO sale_points (description,active,cash_amount) VALUES ('Nuevo',TRUE,NEW.cash_amount);
	RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER ai_cash_update
  AFTER INSERT 
  ON sales
  FOR EACH ROW
  EXECUTE PROCEDURE on_new_sales();