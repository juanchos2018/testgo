/* Cambiar nombre a columna reg_date por registered_at y asignar como valor por defecto la fecha actual */
ALTER TABLE customers RENAME COLUMN reg_date TO registered_at;
ALTER TABLE customers ALTER COLUMN registered_at SET DEFAULT NOW();
/* Eliminar la columna new_reg_date */
ALTER TABLE customers DROP COLUMN new_reg_date;
/* Agregar la columan registered_by y relacionarla con la tabla de usuarios */
ALTER TABLE customers ADD COLUMN registered_by INTEGER;
ALTER TABLE customers ADD FOREIGN KEY (registered_by) REFERENCES users(id);
/* Agregar la columna registered_in y relacionarla con la tabla de sucursales */
ALTER TABLE customers ADD COLUMN registered_in INTEGER;
ALTER TABLE customers ADD FOREIGN KEY (registered_in) REFERENCES branches(id);
/* Agregar el campo país (solicitado en formulario físico) */
ALTER TABLE customers ADD COLUMN country CHARACTER VARYING(150);
/* Agregar el campo facebook */
ALTER TABLE customers ADD COLUMN facebook CHARACTER VARYING(255);
