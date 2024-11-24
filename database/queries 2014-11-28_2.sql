ALTER TABLE sales RENAME COLUMN refund_id TO refund_origin_id;

ALTER TABLE sales ADD COLUMN refund_target_id integer;
ALTER TABLE sales
 ADD CONSTRAINT FK_sales_refund_target_id
  FOREIGN KEY (refund_target_id)
  REFERENCES sales(id);
