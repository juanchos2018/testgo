/*Eliminamos Columna Regimen en SERIES y Cambiamos branch_id por branch_details */
ALTER TABLE series DROP regime;
ALTER TABLE series DROP branch_id;

ALTER TABLE series ADD COLUMN branch_detail_id INTEGER;
ALTER TABLE series ADD CONSTRAINT fk_series_branch_detail_id FOREIGN KEY (branch_detail_id) REFERENCES branch_details(id);