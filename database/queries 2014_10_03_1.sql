/***** CAMBIANDO A SINGULAR TODAS LAS LLAVES FORANEAS *****/

-- TABLA credit_card
ALTER TABLE credit_card RENAME COLUMN banks_id TO bank_id;
ALTER TABLE credit_card RENAME COLUMN sales_id TO sale_id;
-- TABLA offer_price
ALTER TABLE offer_price RENAME COLUMN products_id TO product_id;
-- TABLA products
ALTER TABLE products RENAME COLUMN categories_id TO category_id;
ALTER TABLE products RENAME COLUMN brands_id TO brand_id;
ALTER TABLE products RENAME COLUMN subcategories_id TO subcategory_id;
-- TABLA purchase_order_details
ALTER TABLE purchase_order_details RENAME COLUMN products_id TO product_id;
ALTER TABLE purchase_order_details RENAME COLUMN purchase_orders_id TO purchase_order_id;
-- TABLA purchase_orders
ALTER TABLE purchase_orders RENAME COLUMN suppliers_id TO supplier_id;
-- TABLA sale_details
ALTER TABLE sale_details RENAME COLUMN products_id TO product_id;
ALTER TABLE sale_details RENAME COLUMN sales_id TO sale_id;
-- TABLA sales
ALTER TABLE sales RENAME COLUMN cashiers_id TO cashier_id;
ALTER TABLE sales RENAME COLUMN customers_id TO customer_id;
ALTER TABLE sales RENAME COLUMN vouchers_id TO voucher_id;
-- TABLA stock
ALTER TABLE stock RENAME COLUMN depots_id TO depot_id;
ALTER TABLE stock RENAME COLUMN products_id TO product_id;
-- TABLA subcategories
ALTER TABLE subcategories RENAME COLUMN categories_id TO category_id;
-- TABLA users
ALTER TABLE users RENAME COLUMN id_employees TO employee_id;


/***** CAMBIANDO DE ESPAÑOL A INGLES *****/

-- TABLA purchase_orders
ALTER TABLE purchase_orders RENAME COLUMN codigo TO code;
-- TABLA sales
ALTER TABLE sales RENAME COLUMN tipo_comprobante_id TO voucher_type_id;
-- TABLA tipo_comprobante
ALTER TABLE tipo_comprobante RENAME TO voucher_types


/***** CAMBIANDO ESTRUCTURA DE USUARIOS *****/

-- LAS DOS SIGUIENTES LINEAS TIENEN QUE EJECUTARSE JUNTAS Y SOLO UNA VEZ EN LA VIDA, LUEGO PUEDEN PRODUCIR DUPLICIDAD DE DATOS
INSERT INTO employees (name, last_name) VALUES ('Rodolfo', 'Gomez');
UPDATE users SET employee_id = LASTVAL();
-- TABLA users
ALTER TABLE users ALTER COLUMN employee_id SET NOT NULL;
ALTER TABLE users DROP COLUMN name;
ALTER TABLE users DROP COLUMN last_name;
-- AGREGANDO CAMPO PARA DESIGNAR EMPRESA POR DEFECTO EN TABLA users
ALTER TABLE users ADD COLUMN default_company_id INTEGER;
ALTER TABLE users ADD CONSTRAINT fk_default_company_id FOREIGN KEY (default_company_id) REFERENCES companies(id);


/***** CREANDO TABLA PARA ACCESO DE USUARIOS A EMPRESAS *****/

CREATE TABLE access_to_companies
(
  id serial NOT NULL,
  user_id integer NOT NULL,
  company_id integer NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  CONSTRAINT access_to_companies_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT access_to_companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
);


/***** LLENANDO DATOS PARA EL ACCESO A EMPRESAS *****/

-- LAS SIGUIENTES LINEAS SE DEBEN EJECUTAR JUNTAS Y SOLO UNA VEZ EN LA VIDA, DE LO CONTRARIO TERRIBLES COSAS PODRIAN PASAR
INSERT INTO companies (name) VALUES ('LFA'), ('Gafco');
INSERT INTO access_to_companies (user_id, company_id) VALUES (1, 1), (1, 2);