/* Renombrar la tabla product_details a product_barcodes */
ALTER TABLE product_details RENAME TO product_barcodes;

/* Renombrar la tabla product_values a product_details */
ALTER TABLE product_values RENAME TO product_details;

/* Renombrar la llave foránea product_detail_id de la tabla inputs_details */
ALTER TABLE inputs_details RENAME CONSTRAINT "FK_inputs_products_detail_id" TO "FK_inputs_product_barcode_id";
ALTER TABLE inputs_details RENAME COLUMN product_detail_id TO product_barcode_id;

/* Renombrar la llave foránea product_detail_id de la tabla outputs_details */
ALTER TABLE outputs_details RENAME CONSTRAINT "FK_outputs_products_detail_id" TO "FK_outputs_product_barcode_id";
ALTER TABLE outputs_details RENAME COLUMN product_detail_id TO product_barcode_id;

/* Renombrar la llave foránea product_detail_id de la tabla purchases_detail */
ALTER TABLE purchases_detail RENAME CONSTRAINT "FK_purchase_detail_product" TO "FK_purchases_detail_product_barcode_id";
ALTER TABLE purchases_detail RENAME COLUMN product_detail_id TO product_barcode_id;

/* Renombrar la llave foránea product_detail_id de la tabla sale_details */
ALTER TABLE sale_details RENAME CONSTRAINT "fk_sale_details_product_detail_id" TO "fk_sale_details_product_barcode_id";
ALTER TABLE sale_details RENAME COLUMN product_detail_id TO product_barcode_id;

/* Renombrar la llave foránea product_detail_id de la tabla stock */
ALTER TABLE stock RENAME CONSTRAINT "FK_stock_product_detail_id" TO "FK_stock_product_barcode_id";
ALTER TABLE stock RENAME COLUMN product_detail_id TO product_barcode_id;