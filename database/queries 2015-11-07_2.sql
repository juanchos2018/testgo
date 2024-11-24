/* Consultas para modulo compras pre-compras */

/* Crear tipo de dato APPROVE_STATE*/
CREATE TYPE approved_state_type AS ENUM ('RECHAZADO', 'PENDIENTE','A. CONTABILIDAD','A. MARKETING','A. LOGISTICA','A. GERENCIA');

/* Eliminar el campo state en purchases */
ALTER TABLE purchases DROP COLUMN state;

/* Crear campo approve_state para estado de la compra */
ALTER TABLE purchases ADD COLUMN approved_state approved_state_type NOT NULL DEFAULT 'PENDIENTE'; 

/* Agregar la relacion user_id en purchase del campo rejected*/
ALTER TABLE purchases ADD COLUMN rejected_by INTEGER;
ALTER TABLE purchases ADD CONSTRAINT fk_purchases_user_id FOREIGN KEY (rejected_by) REFERENCES users(id);

/* Crear campos approve state para estado de la orden de compra */
ALTER TABLE purchase_orders ADD COLUMN approved_state approved_state_type NOT NULL DEFAULT 'PENDIENTE'; 

/* Agregar la relacion user_id en purchase_order del campo rejected*/
ALTER TABLE purchase_orders ADD COLUMN rejected_by INTEGER;
ALTER TABLE purchase_orders ADD CONSTRAINT fk_purchase_orders_user_id FOREIGN KEY (rejected_by) REFERENCES users(id);

/* Consultas para modulo de marketing */

/* Crear tabla campañas para agrupar las ofertas */
CREATE TABLE campaings 
(
 id serial NOT NULL,
 description varchar(100) NOT NULL,
 start_date timestamp without time zone NOT NULL DEFAULT now(),
 end_date timestamp without time zone,
 active bool NOT NULL DEFAULT FALSE,
 approved_state approved_state_type DEFAULT 'PENDIENTE',
 rejected_by integer,
 CONSTRAINT pk_campaings_id PRIMARY KEY (id),
 CONSTRAINT fk_campaings_user_id FOREIGN KEY (rejected_by) REFERENCES users(id)
);

/* Crear campo Monto recaudado para ofers */
ALTER TABLE offers ADD COLUMN collected_amount real default 0;

/* Agregando relacion de campaing a offers para agrupar ofertas */
ALTER TABLE offers ADD COLUMN campaing_id integer;
ALTER TABLE offers ADD CONSTRAINT fk_offers_campaing_id FOREIGN KEY (campaing_id) REFERENCES campaings(id);

/* Agregando relacion company_id a offers */
ALTER TABLE offers ADD COLUMN company_id integer;
ALTER TABLE offers ADD CONSTRAINT fk_offers_company_id FOREIGN KEY (company_id) REFERENCES companies(id);