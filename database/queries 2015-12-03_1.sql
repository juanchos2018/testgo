/* Agregando campos a cliente*/
ALTER TABLE customers ADD COLUMN serie_inticard smallint;
ALTER TABLE customers ADD COLUMN associate_dni character varying(15);
ALTER TABLE customers ADD COLUMN associate_name character varying(300);
ALTER TABLE customers ADD COLUMN associate_relationship character varying(20);