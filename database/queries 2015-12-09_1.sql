/* Sale Point - Cierre de Caja */
/* Creando tipo para cierre de caja */
CREATE TYPE closing_states AS ENUM ('NINGUNO', 'CIERRE PARCIAL', 'CIERRE TOTAL');

/* Agregando campo dedicado al cierre de caja */
ALTER TABLE sales ADD COLUMN closing_state closing_states NOT NULL DEFAULT 'NINGUNO';
