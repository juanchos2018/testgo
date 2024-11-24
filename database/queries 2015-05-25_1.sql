/*Agregando campos a empleados*/
ALTER TABLE employees ADD COLUMN date born_date NULL DEFAULT '1900/01/01';
ALTER TABLE employees ADD COLUMN character varying(15) mobile_number NULL;
ALTER TABLE employees ADD COLUMN timestamp entry_date NULL DEFAULT now();