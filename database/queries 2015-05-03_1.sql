/* Eliminando tablas de ofertas */

DROP TABLE offer_price;
DROP TABLE offer_detail;
DROP TABLE offer;

/* Creando la tabla combos */

CREATE TABLE offers
(
  id serial NOT NULL,
  description character varying(255),
  price real NOT NULL DEFAULT 0,
  start_date timestamp without time zone NOT NULL DEFAULT now(),
  end_date timestamp without time zone,
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT "PK_offers_id" PRIMARY KEY (id)
);

/* Creando la tabla detalle de combo */

CREATE TABLE offer_details
(
  id serial NOT NULL,
  offer_id integer NOT NULL,
  product_id integer NOT NULL,
  price real NOT NULL DEFAULT 0,
  CONSTRAINT "PK_offer_details_id" PRIMARY KEY (id),
  CONSTRAINT "FK_offer_details_offer_id" FOREIGN KEY (offer_id)
      REFERENCES offers (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_offer_details_product_id" FOREIGN KEY (product_id)
      REFERENCES products (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
