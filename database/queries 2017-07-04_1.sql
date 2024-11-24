/* Agregando Cargo a empleado */
CREATE TYPE employee_type AS ENUM ('VENDEDOR', 'ADMINISTRADOR','LOGISTICA','LIMPIEZA','CAJERO','EXTERNO');
ALTER TABLE employees ADD COLUMN position employee_type;