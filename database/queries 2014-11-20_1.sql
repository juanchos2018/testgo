DROP TABLE IF EXISTS credit_card;
DROP TABLE IF EXISTS credit_cards;
DROP TYPE IF EXISTS TYPE_CARD;

CREATE TABLE type_credit_cards(
	id serial NOT NULL,
	description varchar(25),
	abbrev varchar(10),
	CONSTRAINT "PK_type_credit_cards_id" PRIMARY KEY(id)
);
CREATE TABLE credit_cards(
id serial NOT NULL,
sale_id integer,
card_number varchar(5),
verification_code varchar(5) NOT NULL,
amount real NOT NULL,
type_credit_card_id integer NOT NULL,
CONSTRAINT "PK_credit_cards_id" PRIMARY KEY (id),
CONSTRAINT "FK_credit_cards_type_credit_cards" FOREIGN KEY (type_credit_card_id)
	REFERENCES type_credit_cards (id) MATCH SIMPLE
	ON UPDATE NO ACTION ON DELETE NO ACTION,
CONSTRAINT "FK_credit_cards_sales" FOREIGN KEY (sale_id)
	REFERENCES sales (id) MATCH SIMPLE
	ON UPDATE NO ACTION ON DELETE NO ACTION
);
INSERT INTO type_credit_cards (description, abbrev) VALUES ('Visa', 'VIS');
INSERT INTO type_credit_cards (description, abbrev) VALUES ('Master Card', 'MTC');
INSERT INTO type_credit_cards (description, abbrev) VALUES ('American Express', 'A.EXPRESS');
