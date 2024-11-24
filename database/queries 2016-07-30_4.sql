/* Agregamos Codigo para las compras (ingreso) */

ALTER TABLE purchases ADD COLUMN code character varying(10) NOT NULL;
