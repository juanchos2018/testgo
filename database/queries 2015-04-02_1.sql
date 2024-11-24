/*Creacion de tablas de Oferta para creacion de combos*/
CREATE TABLE offer
(
id serial NOT NULL,
description VARCHAR(30),
price real NOT NULL DEFAULT 0,
date timestamp without time zone NOT NULL DEFAULT now(),
active boolean NOT NULL DEFAULT true,
CONSTRAINT "PK_offer_id" PRIMARY KEY(id)
)

CREATE TABLE offer_detail
(
id serial NOT NULL,
product_details_id integer NOT NULL,
offer_id integer NOT NULL,
price real NOT NULL DEFAULT 0,
CONSTRAINT "PK_offer_detail_id" PRIMARY KEY(id),
CONSTRAINT "FK_offer_detail_product_details" FOREIGN KEY(product_details_id)
	REFERENCES product_details(id) MATCH SIMPLE
	ON UPDATE NO ACTION ON DELETE NO ACTION,
CONSTRAINT "FK_offer_detail_offer" FOREIGN KEY(offer_id) 
	REFERENCES offer(id) MATCH SIMPLE
	ON UPDATE NO ACTION ON DELETE NO ACTION
)