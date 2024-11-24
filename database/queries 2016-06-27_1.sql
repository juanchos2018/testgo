/* Crear la tabla para guardar las configuraciones globales */
CREATE TABLE settings
(
    id serial NOT NULL,
    description character varying(255) NOT NULL,
    text_value text,
    numeric_value numeric,
    boolean_value boolean,
    CONSTRAINT "PK_setting_id" PRIMARY KEY (id)
);

INSERT INTO settings (description, text_value)
VALUES ('sale_ticket_message', 'DESCUENTOS ESPECIALES VALIDOS DEL 29 DE ABRIL AL 8 DE MAYO CON SU TARJETA LFA SPORTS');
