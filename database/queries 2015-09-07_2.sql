/* Renombrar barcode a barcode_old en la tabla product_barcodes */
ALTER TABLE product_barcodes RENAME COLUMN barcode TO old_barcode;

/* En la tabla product_barcodes agregar la columna barcode */
ALTER TABLE product_barcodes ADD COLUMN barcode CHARACTER VARYING (15);

/* En la tabla product_barcodes agregar la llave foránea product_detail_id (NULO) */
ALTER TABLE product_barcodes ADD COLUMN product_detail_id INTEGER;
ALTER TABLE product_barcodes ADD CONSTRAINT "FK_product_barcodes_product_detail_id" FOREIGN KEY (product_detail_id) REFERENCES product_details (id);

/* En la tabla stock, hacer que la llave foránea product_barcode_id se elimine en cascada */
ALTER TABLE stock DROP CONSTRAINT "FK_stock_product_barcode_id",
ADD CONSTRAINT "FK_stock_product_barcode_id" FOREIGN KEY (product_barcode_id) REFERENCES product_barcodes(id) ON DELETE CASCADE;

/* En la tabla product_barcodes eliminamos los registros que no tengan asignado un producto */
DELETE FROM product_barcodes WHERE product_id IS NULL;

/* En la tabla product_barcodes, llenar la columna product_detail_id de acuerdo al valor en product_id para la empresa LFA */
UPDATE product_barcodes SET product_detail_id = (SELECT id FROM product_details WHERE product_details.product_id = product_barcodes.product_id ORDER BY RANDOM() LIMIT 1);

/* En la tabla product_barcodes hacer NO NULO el campo product_detail_id */
ALTER TABLE product_barcodes ALTER COLUMN product_detail_id DROP NOT NULL;

/* En la tabla product_barcodes eliminar la columna product_id */
ALTER TABLE product_barcodes DROP COLUMN product_id;

/* En la tabla product_barcodes llenar la columna barcode de acuerdo a los ids de producto, talla y empresa */
UPDATE product_barcodes SET barcode = (SELECT LPAD(product_details.company_id::TEXT, 2, '0') || LPAD(product_details.product_id::TEXT, 10, '0') FROM product_details WHERE product_details.id = product_barcodes.product_detail_id LIMIT 1) || LPAD(size_id::TEXT, 3, '0');

/* En la tabla product_barcodes crear un trigger para que se llene automáticamente el barcode al agregar o actualizar un registro */
CREATE OR REPLACE FUNCTION on_change_barcodes() RETURNS TRIGGER AS
$BODY$
BEGIN
	IF NEW.barcode IS NULL AND NEW.product_detail_id IS NOT NULL AND NEW.size_id IS NOT NULL THEN
		NEW.barcode := (SELECT LPAD(product_details.company_id::TEXT, 2, '0') || LPAD(product_details.product_id::TEXT, 10, '0') FROM product_details WHERE product_details.id = NEW.product_detail_id LIMIT 1) || LPAD(NEW.size_id::TEXT, 3, '0');
	END IF;
 
	RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER bi_barcodes BEFORE INSERT ON product_barcodes FOR EACH ROW EXECUTE PROCEDURE on_change_barcodes();
CREATE TRIGGER bu_barcodes BEFORE UPDATE ON product_barcodes FOR EACH ROW EXECUTE PROCEDURE on_change_barcodes();
