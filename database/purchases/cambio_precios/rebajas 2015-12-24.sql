/* Rebajas de Precios de combos*/
UPDATE product_details SET price=price + 10, offer_price= offer_price +10 WHERE id = (SELECT product_details.id FROM products 
INNER JOIN product_details ON products.id = product_details.product_id
WHERE products.code = '1260101-002');
UPDATE product_details SET price=price + 10, offer_price= offer_price +10 WHERE id = (SELECT product_details.id FROM products 
INNER JOIN product_details ON products.id = product_details.product_id
WHERE products.code = '1260102-002');
UPDATE product_details SET price=price + 10, offer_price= offer_price +10 WHERE id = (SELECT product_details.id FROM products 
INNER JOIN product_details ON products.id = product_details.product_id
WHERE products.code = '1260101-540');
UPDATE product_details SET price=price + 10, offer_price= offer_price +10 WHERE id = (SELECT product_details.id FROM products 
INNER JOIN product_details ON products.id = product_details.product_id
WHERE products.code = '1260102-540');