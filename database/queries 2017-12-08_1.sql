CREATE OR REPLACE VIEW public.v_refunded_sale_details AS 
 SELECT sd.id,
    sd.sale_id,
    sd.quantity AS old_quantity,
    sd.quantity - sum(sd2.quantity) AS quantity,
    sd.subtotal,
    sd.price,
    sd.product_barcode_id,
    sd.cost,
    sd.utility,
    sd2.quantity AS refunded_quantity,
    sd2.sale_id AS refund_sale_id
   FROM sale_details sd
     JOIN sale_refunds sr ON sd.sale_id = sr.sale_origin_id
     JOIN sale_details sd2 ON sr.sale_target_id = sd2.sale_id AND sd.product_barcode_id = sd2.product_barcode_id
  GROUP BY sd2.sale_id, sd.id, sd.sale_id, sd.quantity, sd.subtotal, sd.price, sd.product_barcode_id, sd.cost, sd.utility, sd2.quantity;
