/*Tabla para la creacion de control de Puntos*/
CREATE TABLE rewards(
	id serial NOT NULL,
	description character varying(30),
	requeriments_points integer,
	cash_to_points integer DEFAULT 0,
	points_to_voucher integer DEFAULT 0,
	company_id integer,
	CONSTRAINT "PK_rewards_id" PRIMARY KEY (id),
	CONSTRAINT "FK_rewards_companny" FOREIGN KEY (company_id)
		REFERENCES companies(id)
);
