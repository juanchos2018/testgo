﻿/* ASIGNAR LA RAMA 1 A TODOS LOS USUARIOS CON ROL DIFERENTE A 1 (ADMIN: PUEDE ACCEDER A TODAS LAS RAMAS) */
UPDATE users SET branch_id = 1 WHERE role_id > 1;

/* ELIMINAR EL CAMPO default_company_id PORQUE NO SE ACCEDE MEDIANTE EMPRESA, SINO MEDIANTE SUCURSAL */
ALTER TABLE users DROP CONSTRAINT fk_default_company_id;
ALTER TABLE users DROP default_company_id;
