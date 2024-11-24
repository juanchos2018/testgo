/* Renombrar la columna product_details_id a product_detail_id (las llaves foráneas siempre deben ir en singular) */
ALTER TABLE offer_details RENAME COLUMN product_details_id TO product_detail_id;