INSERT INTO offer_details (offer_id,price,product_detail_id,quantity) VALUES ('${this.offer_id}','${this.price}', (SELECT product_details.id FROM products INNER JOIN product_details ON products.id = product_details.product_id WHERE code ='${this.code}'),${this.quantity});