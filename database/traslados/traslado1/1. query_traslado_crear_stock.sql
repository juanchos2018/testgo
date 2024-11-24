INSERT INTO stock
(branch_id, product_barcode_id, store_stock, first_entry, last_entry)
VALUES (
  2,
  (
    SELECT pb.id FROM product_barcodes pb
    INNER JOIN product_details pd ON pb.product_detail_id = pd.id
    INNER JOIN products p ON pd.product_id = p.id
    INNER JOIN size s ON pb.size_id = s.id
    WHERE p.code = '${this.codigo}' AND s.description = '${this.talla}'
  ),
  ${this.cantidad2},
  NOW()::TIMESTAMP WITHOUT TIME ZONE,
  NOW()::TIMESTAMP WITHOUT TIME ZONE
);

UPDATE stock SET store_stock = store_stock - ${this.cantidad2} WHERE id = ${this.anterior};
/* --- */