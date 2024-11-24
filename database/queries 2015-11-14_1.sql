/* Creamos los tipos de moneda como una lista ENUM */
CREATE TYPE money_types AS ENUM('DOLAR ESTADOUNIDENSE', 'PESO CHILENO');

/* Creamos las abreviaciones de moneda como una lista ENUM */
CREATE TYPE money_abbrevs AS ENUM('USD', 'CLP');

/* Crear la tabla para almacenar los tipos de cambio */
CREATE TABLE exchange_rates
(
  id serial NOT NULL,
  updated_at timestamp without time zone NOT NULL DEFAULT now(),
  purchase_value real NOT NULL DEFAULT 0,
  sale_value real NOT NULL DEFAULT 0,
  money money_types NOT NULL,
  money_abbrev money_abbrevs NOT NULL,
  CONSTRAINT "PK_sale_rate_id" PRIMARY KEY (id)
);
