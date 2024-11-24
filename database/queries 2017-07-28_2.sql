/* Crear la tabla para ofertas por paquetes */
CREATE TABLE packs
(
    id SERIAL NOT NULL,
    is_combination BOOLEAN NOT NULL DEFAULT FALSE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    campaign_id INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    CONSTRAINT pk_packs_id PRIMARY KEY (id),
    CONSTRAINT fk_packs_campaing_id FOREIGN KEY (campaign_id)
       REFERENCES campaigns (id) MATCH SIMPLE
       ON UPDATE CASCADE ON DELETE CASCADE
);

/* Crear tabla para almacenar listas de paquetes */
CREATE TABLE pack_lists
(
    id SERIAL NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    pack_id INTEGER NOT NULL,
    description CHARACTER VARYING(255),
    CONSTRAINT pk_pack_lists_id PRIMARY KEY (id),
    CONSTRAINT fk_pack_lists_pack_id FOREIGN KEY (pack_id)
       REFERENCES packs (id) MATCH SIMPLE
       ON UPDATE CASCADE ON DELETE CASCADE
);

/* Crear tabla para almacenar listas de paquetes */
CREATE TABLE pack_list_details
(
    id SERIAL NOT NULL,
    pack_list_id INTEGER NOT NULL,
    product_detail_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT pk_pack_list_details_id PRIMARY KEY (id),
    CONSTRAINT fk_pack_list_details_product_details_id FOREIGN KEY (product_detail_id)
        REFERENCES product_details (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE,
    CONSTRAINT fk_pack_list_details_pack_lists_id FOREIGN KEY (pack_list_id)
        REFERENCES pack_lists (id) MATCH SIMPLE
        ON UPDATE NO ACTION ON DELETE CASCADE
);
