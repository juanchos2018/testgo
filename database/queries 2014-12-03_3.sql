ALTER TABLE sales ADD COLUMN sale_point_id INTEGER NOT NULL DEFAULT 1;
ALTER TABLE sales ADD CONSTRAINT fk_sales_sale_point_id FOREIGN KEY (sale_point_id) REFERENCES sale_points(id);
ALTER TABLE sales ADD COLUMN cash_amount REAL NOT NULL DEFAULT 0;
