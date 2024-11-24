/* Creando tabla para definir destino de combos */

CREATE TABLE offer_places
(
  id serial NOT NULL,
  offer_id integer NOT NULL,
  global boolean NOT NULL DEFAULT false,
  company_id integer,
  branch_id integer,
  CONSTRAINT "PK_offer_places_id" PRIMARY KEY (id),
  CONSTRAINT "FK_offer-places_company_id" FOREIGN KEY (company_id)
      REFERENCES companies (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_offer_places_branch_id" FOREIGN KEY (branch_id)
      REFERENCES branches (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);
