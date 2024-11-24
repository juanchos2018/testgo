ALTER TABLE product_values ADD COLUMN offer_price REAL NOT NULL DEFAULT 0;
UPDATE product_values SET offer_price = ROUND(price::NUMERIC * 0.9, 1);