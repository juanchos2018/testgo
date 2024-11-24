-- El còdigo de barras
ALTER TABLE products ADD COLUMN barcode CHARACTER VARYING (20);
-- Una imagen opcional para cada producto, categoría o subcategoría
ALTER TABLE products ADD COLUMN image CHARACTER VARYING(255);
ALTER TABLE categories ADD COLUMN image CHARACTER VARYING(255);
ALTER TABLE subcategories ADD COLUMN image CHARACTER VARYING(255);