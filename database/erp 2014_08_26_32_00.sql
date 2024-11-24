
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
);




ALTER TABLE products ADD CONSTRAINT FK_products_brands_id 
FOREIGN KEY (brands_id)  REFERENCES brands(id);

ALTER TABLE purchase_orders ADD CONSTRAINT FK_suppliers_id 
FOREIGN KEY (suppliers_id)  REFERENCES suppliers(id);

ALTER TABLE purchase_orders_details ADD CONSTRAINT FK_purchase_orders_iers_id 
FOREIGN KEY (purchase_orders_id)  REFERENCES purchase_orders(id);

ALTER TABLE purchase_orders_details ADD CONSTRAINT FK_products_id 
FOREIGN KEY (products_id)  REFERENCES products(id);