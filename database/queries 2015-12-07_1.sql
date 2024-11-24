/* Agregar el campo cost_currency en tabla product_details */
ALTER TABLE product_details ADD COLUMN currency_cost CHARACTER VARYING (1) NOT NULL DEFAULT 'S';