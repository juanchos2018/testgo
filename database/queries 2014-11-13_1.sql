/*Consultas para crear tarjetas de credito para cada venta*/
CREATE TYPE TYPE_CARD AS ENUM ('VISA', 'MTC','AMERICAN E.');
CREATE TABLE credit_cards(
id serial NOT NULL,
sale_id integer,
card_number varchar(5),
verification_code varchar(5) NOT NULL,
amount real NOT NULL,
credit_card TYPE_CARD NOT NULL DEFAULT 'VISA',
CONSTRAINT "PK_credits_cards_id" PRIMARY KEY (id),
CONSTRAINT "FK_credit_cards_sales" FOREIGN KEY (sale_id)
	REFERENCES sales (id) MATCH SIMPLE
	ON UPDATE NO ACTION ON DELETE NO ACTION
);

ALTER TABLE sales ADD COLUMN total_cash real;
ALTER TABLE sales ADD COLUMN total_credit_card real;