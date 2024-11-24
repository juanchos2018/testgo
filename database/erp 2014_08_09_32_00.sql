
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

CREATE TABLE companies (
id serial,
name varchar(80);
);

CREATE TABLE purchase_orders (
id serial,
codigo varchar(10) NOT NULL UNIQUE,
description varchar (100),
start_date date,
finish_date date,
paid_date date,
CONSTRAINT "PK_purchase_orders_id" PRIMARY KEY(id)
);

CREATE TABLE products (
id serial,
description varchar(60) NOT NULL,
CONSTRAINT "PK_products_id" PRIMARY KEY (id)
);

ALTER TABLE libros
 ADD CONSTRAINT FK_products_brands_id
  FOREIGN KEY (brands_id)
  REFERENCES brands(id);
