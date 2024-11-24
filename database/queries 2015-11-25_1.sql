/* Corrigiendo error en trigger de sales */
CREATE OR REPLACE FUNCTION on_change_sales()
  RETURNS trigger AS
$BODY$
BEGIN
	IF NEW.total_amount > NEW.credit_card_amount THEN
		NEW.cash_amount := NEW.total_amount - NEW.credit_card_amount;
	END IF;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql
