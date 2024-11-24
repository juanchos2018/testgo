/* Agregar campo branch_id a campaigns en caso que solo sea válido para una sucursal */
ALTER TABLE campaigns ADD COLUMN branch_id INTEGER;
ALTER TABLE campaigns ADD CONSTRAINT fk_campaigns_branch_id FOREIGN KEY (branch_id) REFERENCES branches(id);
