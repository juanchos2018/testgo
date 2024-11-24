/* Eliminar el campo money en tipos de cambio (sólo necesitaremos al abreviación) */
ALTER TABLE exchange_rates DROP COLUMN money;

/* Eliminar el tipo money_types */
DROP TYPE money_types;

/* Agregar la columna unidad, para saber cuántas monedas extranjeras se toman en cuenta para el cambio */
ALTER TABLE exchange_rates ADD COLUMN unit REAL NOT NULL;

/* Crear un trigger para que se guarde la fecha de actualización cada vez que se edite un registro en exchange_rates */
CREATE OR REPLACE FUNCTION on_change_exchange_rates()
  RETURNS trigger AS
$BODY$
BEGIN
	NEW.updated_at := NOW()::TIMESTAMP WITHOUT TIME ZONE;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bu_exchange_rates
  BEFORE UPDATE
  ON exchange_rates
  FOR EACH ROW
  EXECUTE PROCEDURE on_change_exchange_rates();

/* Agregar los valores temporales */
INSERT INTO exchange_rates(money_abbrev, purchase_value, sale_value, unit) VALUES
('USD', 3.320, 3.323, 1), /* Valor de 1 dólar */
('CLP', 4.710, 4.719, 1000); /* Valor de 1000 pesos */
