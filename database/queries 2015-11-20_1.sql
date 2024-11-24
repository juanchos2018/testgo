/* Redondear las cifras a 1 dígito o perderé la razón con los pagos */
UPDATE product_details SET price = ROUND(price::NUMERIC, 1), offer_price = ROUND(offer_price::NUMERIC, 1);
