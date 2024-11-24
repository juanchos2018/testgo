ALTER TABLE sales ADD COLUMN sale_points_id integer;
ALTER TABLE sales
 ADD CONSTRAINT FK_sales_sale_points_id
  FOREIGN KEY (sale_points_id)
  REFERENCES sale_points(id);
