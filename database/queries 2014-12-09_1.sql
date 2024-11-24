ALTER TABLE products DROP COLUMN pvp;

ALTER TABLE products ADD COLUMN output_statement CHARACTER VARYING(20);

ALTER TABLE sale_details ADD COLUMN cost REAL NOT NULL DEFAULT 0;
ALTER TABLE sale_details ADD COLUMN utility REAL NOT NULL DEFAULT 0;

CREATE TABLE product_values
(
  id serial NOT NULL,
  product_id integer NOT NULL,
  company_id integer NOT NULL,
  price real NOT NULL DEFAULT 0,
  cost real NOT NULL DEFAULT 0,
  CONSTRAINT "PK_product_value_id" PRIMARY KEY (id),
  CONSTRAINT "FK_company_id" FOREIGN KEY (company_id)
      REFERENCES companies (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_product_id" FOREIGN KEY (product_id)
      REFERENCES products (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);