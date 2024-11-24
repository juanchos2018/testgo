CREATE TABLE companies (
id serial,
name varchar(80) NOT NULL,
CONSTRAINT "PK_companies_id" PRIMARY KEY(id)    
);

CREATE TABLE banks (
id serial,
name varchar(50) NOT NULL,
CONSTRAINT "PK_banks_id" PRIMARY KEY(id)
);

CREATE TABLE credit_card (
id serial,
banks_id int4 NOT NULL,
sales_id int4 NOT NULL,
verification_code varchar(5),
card_number varchar(5),
CONSTRAINT "PK_credit_card_id" PRIMARY KEY(id)
);

CREATE TABLE employees (
id serial,
name varchar(80),
last_name varchar(80),
CONSTRAINT "PK_employees_id" PRIMARY KEY(id)
);

CREATE TABLE users (
id serial,
email varchar(50) NOT NULL,
password varchar(50) NOT NULL,
name varchar(50) NOT NULL,
last_name varchar(50) NOT NULL,
username varchar(50) NOT NULL,
id_employees int4,
CONSTRAINT "PK_users_id" PRIMARY KEY(id)
);

CREATE TABLE vouchers (
id serial,
code varchar(15) NOT NULL,
amount float(5) NOT NULL,
creation_date timestamp NOT NULL,
used_date timestamp NOT NULL,
state varchar(15) NOT NULL,
CONSTRAINT "PK_vouchers_id" PRIMARY KEY(id)
);

CREATE TABLE customers (
id serial,
name varchar(120) NOT NULL,
last_name varchar(120) NOT NULL,
id_number varchar(15) NOT NULL,
email varchar(50),
last_purchase timestamp,
level varchar(80),
CONSTRAINT "PK_customers_id" PRIMARY KEY(id)
);

CREATE TABLE tipo_comprobante (
id serial,
description varchar(25),
CONSTRAINT "PK_tipo_comprobante_id" PRIMARY KEY(id)
);

CREATE TABLE sales (
id serial,
salesman_id int4 NOT NULL,
cashiers_id int4 NOT NULL,
customers_id int4 NOT NULL,
tipo_comprobante_id int4 NOT NULL,
vouchers_id int4 NOT NULL,
sale_date timestamp NOT NULL,
igv float(8),
total_amount float(12),
CONSTRAINT "PK_sales_id" PRIMARY KEY(id)
);

CREATE TABLE sale_details(
id serial,
sales_id int4 NOT NULL,
products_id int4 NOT NULL,
size_id int4,
quantity integer NOT NULL,
subtotal float(8),
igv float(8),
precio float(8),
CONSTRAINT "PK_sales_details_id" PRIMARY KEY(id)
);

CREATE TABLE categories (
id serial,
description varchar (60) NOT NULL,
CONSTRAINT "PK_categories_id" PRIMARY KEY(id)
);

CREATE TABLE subcategories (
id serial,
description varchar(60) NOT NULL,
categories_id int4,
CONSTRAINT "PK_subcategories_id" PRIMARY KEY(id)
);

CREATE TABLE offer_price (
id serial,
products_id int4,
price float(8),
start_date timestamp,
end_date timestamp,
CONSTRAINT "PK_offer_price_id" PRIMARY KEY(id)
);

CREATE TABLE brands (
id serial,
description varchar (60) NOT NULL,
CONSTRAINT "PK_brands_id" PRIMARY KEY(id)
);

CREATE TABLE size (
id serial,
description varchar(60) NOT NULL,
description2 varchar(12),
CONSTRAINT "PK_size_id" PRIMARY KEY(id)
);

CREATE TABLE depots (
id serial,
name varchar(80) NOT NULL,
location varchar(220),
CONSTRAINT "PK_depots_id" PRIMARY KEY(id)
);

CREATE TABLE stock (
id serial,
products_id int4 NOT NULL,
depots_id int4 NOT NULL,
size_id int4 NOT NULL,
stock integer,
state varchar(25),
first_entry timestamp,
last_entry timestamp,
last_sale timestamp,
CONSTRAINT "PK_stock_id" PRIMARY KEY(id)
);

CREATE TABLE suppliers (
id serial,
description varchar(60),
ruc varchar(11),
direction varchar(120),
contacto varchar(120),
tlf1 varchar(12),
tlf2 varchar(12),
email varchar(20),
CONSTRAINT "PK_suppliers_id" PRIMARY KEY(id)
);

CREATE TABLE products (
id serial,
description varchar(60) NOT NULL,
brands_id int4,
subcategories_id int4,
categories_id int4,
CONSTRAINT "PK_products_id" PRIMARY KEY (id)
);

CREATE TABLE purchase_orders (
id serial,
codigo varchar(10) NOT NULL UNIQUE,
description varchar (100),
start_date date,
finish_date date,
paid_date date,
suppliers_id int4,
CONSTRAINT "PK_purchase_orders_id" PRIMARY KEY(id)
);

CREATE TABLE purchase_order_details(
id serial,
products_id int4,
purchase_orders_id int4,
sales_intro date,
quantity integer,
CONSTRAINT "PK_purchase_order_details_id" PRIMARY KEY(id)
);




ALTER TABLE products ADD CONSTRAINT FK_products_brands_id 
FOREIGN KEY (brands_id)  REFERENCES brands(id);

ALTER TABLE purchase_orders ADD CONSTRAINT FK_suppliers_id 
FOREIGN KEY (suppliers_id)  REFERENCES suppliers(id);

ALTER TABLE purchase_order_details ADD CONSTRAINT FK_purchase_orders_id 
FOREIGN KEY (purchase_orders_id)  REFERENCES purchase_orders(id);

ALTER TABLE purchase_order_details ADD CONSTRAINT FK_products_id 
FOREIGN KEY (products_id)  REFERENCES products(id);


ALTER TABLE credit_card ADD CONSTRAINT FK_banks_id 
FOREIGN KEY (banks_id)  REFERENCES banks(id);

ALTER TABLE credit_card ADD CONSTRAINT FK_sales_id 
FOREIGN KEY (sales_id)  REFERENCES sales(id);

ALTER TABLE users ADD CONSTRAINT FK_employees_id 
FOREIGN KEY (id_employees)  REFERENCES employees(id);

ALTER TABLE sales ADD CONSTRAINT FK_vouchers_id 
FOREIGN KEY (vouchers_id)  REFERENCES vouchers(id);

ALTER TABLE sales ADD CONSTRAINT FK_salesman_id 
FOREIGN KEY (salesman_id)  REFERENCES employees(id);

ALTER TABLE sales ADD CONSTRAINT FK_cashiers_id 
FOREIGN KEY (cashiers_id)  REFERENCES users(id);

ALTER TABLE sales ADD CONSTRAINT FK_customers_id 
FOREIGN KEY (customers_id)  REFERENCES customers(id);

ALTER TABLE sales ADD CONSTRAINT FK_tipo_comprobante_id 
FOREIGN KEY (tipo_comprobante_id)  REFERENCES tipo_comprobante(id);

ALTER TABLE sale_details ADD CONSTRAINT FK_sales_id 
FOREIGN KEY (sales_id)  REFERENCES sales(id);

ALTER TABLE sale_details ADD CONSTRAINT FK_products_id 
FOREIGN KEY (products_id)  REFERENCES products(id);

ALTER TABLE sale_details ADD CONSTRAINT FK_size_id 
FOREIGN KEY (size_id)  REFERENCES size(id);

ALTER TABLE products ADD CONSTRAINT FK_subcategories_id 
FOREIGN KEY (subcategories_id)  REFERENCES subcategories(id);

ALTER TABLE products ADD CONSTRAINT FK_categories_id 
FOREIGN KEY (categories_id)  REFERENCES categories(id);

ALTER TABLE subcategories ADD CONSTRAINT FK_categories_id 
FOREIGN KEY (categories_id)  REFERENCES categories(id);

ALTER TABLE offer_price ADD CONSTRAINT FK_products_id 
FOREIGN KEY (products_id)  REFERENCES products(id);

ALTER TABLE stock ADD CONSTRAINT FK_products_id 
FOREIGN KEY (products_id)  REFERENCES products(id);

ALTER TABLE stock ADD CONSTRAINT FK_size_id 
FOREIGN KEY (size_id)  REFERENCES size(id);

ALTER TABLE stock ADD CONSTRAINT FK_depots_id 
FOREIGN KEY (depots_id)  REFERENCES depots(id);