/* Eliminar company_id de offers porque jalaremos la compañia desde el producto */
ALTER TABLE offers DROP COLUMN company_id;

/* ELiminar relacion de product_id en offer_details */
ALTER TABLE offer_details DROP COLUMN product_id;

/* Agregar la relación product_details_id en offer_details para obtener la compañia y precio directamente */
ALTER TABLE offer_details ADD COLUMN product_details_id integer NOT NULL;
ALTER TABLE offer_details ADD CONSTRAINT fk_offers_details_product_details_id FOREIGN KEY (product_details_id) REFERENCES product_details(id);

/* Agregar relacion de branch a campaings */
ALTER TABLE	campaings ADD COLUMN branch_id integer;
ALTER TABLE campaings ADD CONSTRAINT fk_campaings_branch_id FOREIGN KEY (branch_id) REFERENCES branches(id);

/* Gestion de elaboracion de usarios en Campañas */

/* Agregar relacion de marketing user a campaings */
ALTER TABLE campaings ADD COLUMN marketing_user_id integer;
ALTER TABLE campaings ADD CONSTRAINT fk_campaings_marketing_user_id FOREIGN KEY (marketing_user_id) REFERENCES users(id);

/* Agregar relacion de accounting user a campaings */
ALTER TABLE campaings ADD COLUMN accounting_user_id integer;
ALTER TABLE campaings ADD CONSTRAINT fk_campaings_accounting_user_id FOREIGN KEY (accounting_user_id) REFERENCES users(id);

/* Gestion de elaboracion de usarios en Pedidos de compras */

/* Agregar relacion de accounting user a purchases_orders */
ALTER TABLE purchase_orders ADD COLUMN accounting_user_id integer;
ALTER TABLE purchase_orders ADD CONSTRAINT fk_purchase_orders_accounting_user_id FOREIGN KEY (accounting_user_id) REFERENCES users(id);

/* Agregar relacion de logistic user a purchase_orders */
ALTER TABLE purchase_orders ADD COLUMN logistic_user_id integer;
ALTER TABLE purchase_orders ADD CONSTRAINT fk_purchase_orders_logistic_user_id FOREIGN KEY (logistic_user_id) REFERENCES users(id);

/* Gestion de elaboracion de usarios en Compras */

/* Agregar relacion de accounting user a purchases */
ALTER TABLE purchases ADD COLUMN accounting_user_id integer;
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_accounting_user_id FOREIGN KEY (accounting_user_id) REFERENCES users(id);

/* Agregar relacion de logistic user a purchases */
ALTER TABLE purchases ADD COLUMN logistic_user_id integer;
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_logistic_user_id FOREIGN KEY (logistic_user_id) REFERENCES users(id);



