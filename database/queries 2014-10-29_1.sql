CREATE TABLE prices
(
  company_id integer NOT NULL,
  product_id integer NOT NULL,
  price real NOT NULL DEFAULT 0,
  CONSTRAINT pk_id PRIMARY KEY (company_id, product_id),
  CONSTRAINT fk_company_id FOREIGN KEY (company_id)
      REFERENCES companies (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_product_id FOREIGN KEY (product_id)
      REFERENCES products (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
