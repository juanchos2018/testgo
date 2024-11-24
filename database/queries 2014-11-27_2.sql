 ALTER TABLE sales DROP CONSTRAINT FK_sales_refound_id;
 ALTER TABLE sales DROP COLUMN refound_id;

ALTER TABLE sales ADD COLUMN refund_id integer DEFAULT NULL;
ALTER TABLE sales
 ADD CONSTRAINT FK_sales_refund_id
  FOREIGN KEY (refund_id)
  REFERENCES sales(id);

 