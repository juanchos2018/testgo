/* CREAR LA TABLA branch_details */

CREATE TABLE branch_details
(
  id serial NOT NULL,
  branch_id integer NOT NULL,
  company_id integer NOT NULL,
  CONSTRAINT "PK_branch_detail_id" PRIMARY KEY (id),
  CONSTRAINT "FK_branch_detail_branch_id" FOREIGN KEY (branch_id)
      REFERENCES branches (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_branch_detail_company_id" FOREIGN KEY (company_id)
      REFERENCES companies (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

/* ELIMINAR EL CAMPO regime EN company PORQUE UNA EMPRESA YA NO ESTARÁ LIGADA A UN RÉGIMEN */

ALTER TABLE companies DROP COLUMN regime;

/* AGREGAR DATOS A TABLA branch_details RELACIONANDO CADA SUCURSAL CON CADA EMPRESA */

INSERT INTO branch_details
(branch_id, company_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2);

