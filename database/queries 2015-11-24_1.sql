/* Crear el trigger que calcule el total de cash en sales */
CREATE OR REPLACE FUNCTION on_change_sales() RETURNS TRIGGER AS
$BODY$
BEGIN
	IF NEW.total_amount > credit_card_amount THEN
		NEW.cash_amount := NEW.total_amount - NEW.credit_card_amount;
	END IF;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bi_sales BEFORE INSERT ON sales FOR EACH ROW EXECUTE PROCEDURE on_change_sales();
CREATE TRIGGER bu_sales BEFORE UPDATE ON sales FOR EACH ROW EXECUTE PROCEDURE on_change_sales();

/* Eliminar el trigger calc_util anterior, para juntarlo después todo en uno solo para sale_details */
DROP TRIGGER calc_util ON sale_details;
DROP FUNCTION util();

/* Crear trigger para sale_details que calcule la utilidad y el subtotal (cantidad x precio) */
CREATE OR REPLACE FUNCTION on_change_sale_details() RETURNS TRIGGER AS
$BODY$
BEGIN
	NEW.utility := NEW.price - NEW.cost;
	NEW.subtotal := NEW.price * NEW.quantity;
	
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bi_sale_details BEFORE INSERT ON sale_details FOR EACH ROW EXECUTE PROCEDURE on_change_sale_details();
CREATE TRIGGER bu_sale_details BEFORE UPDATE ON sale_details FOR EACH ROW EXECUTE PROCEDURE on_change_sale_details();

