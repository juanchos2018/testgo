DROP TABLE stock;
DROP TABLE depots;

CREATE TABLE branches
(
  id serial NOT NULL,
  company_id integer NOT NULL,
  address character varying(80),
  alias character varying(20),
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT "PK_branch_id" PRIMARY KEY (id),
  CONSTRAINT "FK_branches_company_id" FOREIGN KEY (company_id)
      REFERENCES companies (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

/* DATOS DE PRUEBA */
INSERT INTO branches (company_id, address, alias) VALUES (1, 'Dirección Sucursal 1', 'SUC1'), (2, 'Dirección Sucursal 2', 'SUC2');

CREATE TABLE stock
(
  id serial NOT NULL,
  branch_id integer NOT NULL,
  product_detail_id integer NOT NULL,
  store_stock integer NOT NULL DEFAULT 0,
  depot_stock integer NOT NULL DEFAULT 0,
  first_entry timestamp without time zone,
  last_entry timestamp without time zone,
  last_sale timestamp without time zone,
  CONSTRAINT "PK_stock_id" PRIMARY KEY (id),
  CONSTRAINT "FK_stock_branch_id" FOREIGN KEY (branch_id)
      REFERENCES branches (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_stock_product_detail_id" FOREIGN KEY (product_detail_id)
      REFERENCES product_details (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);