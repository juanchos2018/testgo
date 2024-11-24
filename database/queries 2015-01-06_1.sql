CREATE TABLE shuttle_reasons
(
 id serial NOT NULL,
 description character varying(70),
 CONSTRAINT "PK_shuttle_reasons_id" PRIMARY KEY (id)
);
INSERT INTO shuttle_reasons (description) VALUES ('Venta');
INSERT INTO shuttle_reasons (description) VALUES ('Venta sujeta a confirmacion por el comprador');
INSERT INTO shuttle_reasons (description) VALUES ('Recojo de bienes');
INSERT INTO shuttle_reasons (description) VALUES ('Traslado zona primaria');
INSERT INTO shuttle_reasons (description) VALUES ('Compra');
INSERT INTO shuttle_reasons (description) VALUES ('Traslado entre establecimientos de la misma empresa');
INSERT INTO shuttle_reasons (description) VALUES ('Importación');
INSERT INTO shuttle_reasons (description) VALUES ('Traslado por emisor itinerante');
INSERT INTO shuttle_reasons (description) VALUES ('Consignación');
INSERT INTO shuttle_reasons (description) VALUES ('Devolución');
INSERT INTO shuttle_reasons (description) VALUES ('Exportación');
INSERT INTO shuttle_reasons (description) VALUES ('Traslado de bienes para transformación');
INSERT INTO shuttle_reasons (description) VALUES ('Venta con entrega a terceros');
INSERT INTO shuttle_reasons (description) VALUES ('Otros');

CREATE TABLE inputs
(
  id serial NOT NULL,
  alias character varying(70),
  input_date timestamp without time zone NOT NULL DEFAULT now(),
  quantity integer,
  shuttle_reason_id integer,
  CONSTRAINT "PK_inputs_id" PRIMARY KEY (id),
  CONSTRAINT "FK_inputs_shuttle_reason_id" FOREIGN KEY(shuttle_reason_id) REFERENCES shuttle_reasons(id)
);


CREATE TABLE outputs
(
  id serial NOT NULL,
  alias character varying(70),
  output_date timestamp without time zone NOT NULL DEFAULT now(),
  quantity integer,
  shuttle_reason_id integer,
  CONSTRAINT "PK_outputs_id" PRIMARY KEY (id),
  CONSTRAINT "FK_outputs_shuttle_reason_id" FOREIGN KEY(shuttle_reason_id) REFERENCES shuttle_reasons(id)
);


CREATE TABLE inputs_details
(
 id serial NOT NULL,
 input_id integer,
 product_detail_id integer,
 quantity integer,
 CONSTRAINT "PK_inputs_details_id" PRIMARY KEY (id),
 CONSTRAINT "FK_inputs_id" FOREIGN KEY(input_id) REFERENCES inputs(id),
 CONSTRAINT "FK_inputs_products_detail_id" FOREIGN KEY(product_detail_id) REFERENCES product_details(id)
);
CREATE TABLE outputs_details
(
 id serial NOT NULL,
 output_id integer,
 product_detail_id integer,
 quantity integer,
 CONSTRAINT "PK_outputs_details_id" PRIMARY KEY (id),
 CONSTRAINT "FK_outputs_id" FOREIGN KEY(output_id) REFERENCES outputs(id),
 CONSTRAINT "FK_outputs_products_detail_id" FOREIGN KEY(product_detail_id) REFERENCES product_details(id)
);

