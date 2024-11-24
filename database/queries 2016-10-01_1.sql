
/* Crear la tabla para los movimientos de mercaderia */
CREATE TABLE transfer_details
(
    id serial NOT NULL,
    product_barcode_id integer NOT NULL,
    quantity integer NOT NULL,
    transfer_id integer NOT NULL,
    guide_id integer,
    CONSTRAINT pk_transfer_detail_id PRIMARY KEY (id),
    CONSTRAINT fk_transfer_details_tranfers_id FOREIGN KEY (transfer_id)
       REFERENCES transfers (id) MATCH SIMPLE
       ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_transfer_details_guide_id FOREIGN KEY (guide_id)
        REFERENCES guides (id) MATCH SIMPLE
        ON UPDATE CASCADE ON DELETE CASCADE
);