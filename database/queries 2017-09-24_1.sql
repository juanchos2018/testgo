/* Agregando llave foránea a transfer_details */
ALTER TABLE transfer_details 
  ADD CONSTRAINT fk_transfer_details_product_barcode_id
  FOREIGN KEY (product_barcode_id) 
  REFERENCES product_barcodes(id) MATCH SIMPLE
  ON UPDATE CASCADE ON DELETE CASCADE;
