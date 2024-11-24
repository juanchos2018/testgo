CREATE TABLE stock_logs
(
  id SERIAL NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()::TIMESTAMP WITHOUT TIME ZONE,
  action CHARACTER VARYING(10) NOT NULL,
  diff_stock SMALLINT NOT NULL,
  old_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  product_barcode_id INTEGER NOT NULL REFERENCES product_barcodes (id),
  branch_id INTEGER NOT NULL REFERENCES branches (id)
);

CREATE OR REPLACE FUNCTION fa_log_stock() RETURNS TRIGGER AS
$BODY$
BEGIN
  INSERT INTO stock_logs (action, diff_stock, old_stock, new_stock, product_barcode_id, branch_id)
  VALUES (TG_OP, NEW.store_stock - OLD.store_stock, OLD.store_stock, NEW.store_stock, NEW.product_barcode_id, NEW.branch_id);

  RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER au_log_stock AFTER UPDATE ON stock FOR EACH ROW EXECUTE PROCEDURE fa_log_stock();
CREATE TRIGGER ai_log_stock AFTER INSERT ON stock FOR EACH ROW EXECUTE PROCEDURE fa_log_stock();
