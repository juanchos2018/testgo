/* Agregar el campo cantidad en offer_details */
ALTER TABLE offer_details ADD COLUMN quantity INTEGER NOT NULL DEFAULT 1;