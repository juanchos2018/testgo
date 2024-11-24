/* Relacionando purchase y purchase_details con eliminación en cascada */
ALTER TABLE purchase_details
DROP CONSTRAINT "FK_purchase_detail_purchase",
ADD CONSTRAINT "FK_purchase_detail_purchase"
FOREIGN KEY (purchase_id) REFERENCES purchases(id)
ON DELETE CASCADE;
