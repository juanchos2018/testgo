/* Pasando valores de currency_cost a cost_currency */
UPDATE product_details SET cost_currency = CASE WHEN currency_cost = 'D' OR cost_currency = 'D' THEN 'D' ELSE 'S' END;

/* Eliminar currency_cost y conservar cost_currency */
ALTER TABLE product_details DROP COLUMN currency_cost;
