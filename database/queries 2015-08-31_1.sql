/* Agregamos el campo código a tabla EMPLOYEES */
ALTER TABLE employees ADD COLUMN code CHARACTER VARYING(5);
UPDATE employees SET code = LPAD(id::TEXT, 4, '0');
ALTER TABLE employees ALTER COLUMN code DROP NOT NULL;