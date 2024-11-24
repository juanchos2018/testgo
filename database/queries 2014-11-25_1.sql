ALTER TABLE series ADD COLUMN sale_point_id INTEGER;
UPDATE series SET sale_point_id = NULL;
ALTER TABLE sale_points ADD CONSTRAINT PK_sale_point_id PRIMARY KEY (id);
ALTER TABLE series ADD CONSTRAINT fk_series_sale_point_id FOREIGN KEY (sale_point_id) REFERENCES sale_points(id);
