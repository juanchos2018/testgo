UPDATE stock SET store_stock = GREATEST(store_stock - ${this.cantidad2}, 0) WHERE id = ${this.anterior};
UPDATE stock SET store_stock = GREATEST(store_stock, 0) + ${this.cantidad2} WHERE id = ${this.nuevo};
/* --- */
