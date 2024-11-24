/* Creando la tabla para stocks iniciales */
CREATE TABLE initial_stocks
(
 id serial NOT NULL,
 branch_detail_id INTEGER NOT NULL,
 product_id INTEGER NOT NULL,
 year SMALLINT NOT NULL,
 store_stock INTEGER NOT NULL,
 last_modified TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
 CONSTRAINT fk_initial_stocks_branch_detail_id FOREIGN KEY (branch_detail_id) REFERENCES branch_details(id),
 CONSTRAINT fk_initial_stocks_product_id FOREIGN KEY (product_id) REFERENCES products(id)
);