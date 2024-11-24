DROP TABLE rewards;
/*Definiendo tabla de Programa de puntos*/
CREATE TABLE rewards(
id serial NOT NULL,
description varchar(25),
abbrev varchar(10),
earn_points integer NOT NULL,
min_points integer,
points_to_voucher integer NOT NULL,
voucher_amount real NOT NULL,
voucher_birthday real, 
company_id integer,
active boolean,
CONSTRAINT "PK_rewards_id" PRIMARY KEY(id),
CONSTRAINT "FK_rewards_company" FOREIGN KEY (company_id)
	REFERENCES companies (id) MATCH SIMPLE
	ON UPDATE NO ACTION ON DELETE NO ACTION
);