CREATE TABLE genders
(
  id serial NOT NULL,
  description character varying(90) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  CONSTRAINT "PK_genders_id" PRIMARY KEY (id)
);

INSERT INTO genders (description) VALUES ('HOMBRE'), ('MUJER'), ('UNISEX');

ALTER TABLE products ADD COLUMN gender_id INTEGER;

ALTER TABLE products ADD CONSTRAINT FK_products_genders_id 
FOREIGN KEY (gender_id) REFERENCES genders(id);

UPDATE products SET gender_id = 1 WHERE id < 1000;
UPDATE products SET gender_id = 2 WHERE id >= 1000 AND id < 2000;
UPDATE products SET gender_id = 3 WHERE id >= 2000;
