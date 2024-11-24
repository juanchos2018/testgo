/* Agregar la columna offer_detail_id en sale_details */
ALTER TABLE sale_details ADD COLUMN offer_detail_id INTEGER;
ALTER TABLE sale_details ADD CONSTRAINT fk_sale_details_offer_detail_id FOREIGN KEY (offer_detail_id) REFERENCES offer_details(id);
