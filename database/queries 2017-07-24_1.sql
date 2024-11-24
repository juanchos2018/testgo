/* Creando índice para código de productos */
CREATE INDEX idx_product_code
ON products (code);

/* Creando índice para descripción de productos */
CREATE INDEX idx_product_description
ON products (description);
