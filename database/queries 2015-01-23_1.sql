
CREATE TABLE supplier(
id serial NOT NULL,
id_number VARCHAR(13) NOT NULL,
name VARCHAR(80) NOT NULL,
phone_number VARCHAR(13),
phone_number2 VARCHAR(13),
address VARCHAR(250),
CONSTRAINT "PK_supplier_id" PRIMARY KEY(id)
);
CREATE TABLE purchases(
id serial,
description VARCHAR(80),
input_date TIMESTAMP,
amount REAL,
igv REAL,
company_id INTEGER,
supplier_id INTEGER,
state STATE_TYPE,
CONSTRAINT "PK_purchase_id" PRIMARY KEY(id),
CONSTRAINT "FK_purchase_company_id" FOREIGN KEY(company_id)
	REFERENCES companies(id),
CONSTRAINT "FK_purchase_supplier_id" FOREIGN KEY(supplier_id)
	REFERENCES supplier(id)
);

CREATE TABLE purchases_detail(
id SERIAL NOT NULL,
purchase_id INTEGER NOT NULL,
product_detail_id INTEGER NOT NULL,
cost real,
price real,
CONSTRAINT "PK_purchase_detail_id" PRIMARY KEY(id),
CONSTRAINT "FK_purchase_detail_purchase" FOREIGN KEY(purchase_id)
	REFERENCES purchases(id),
CONSTRAINT "FK_purchase_detail_product" FOREIGN KEY(product_detail_id)
	REFERENCES product_details(id)
);
