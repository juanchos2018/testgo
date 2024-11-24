/* Permitir valores NULOS de sale_origin_id en sale_refunds */
ALTER TABLE sale_refunds ALTER COLUMN sale_origin_id DROP NOT NULL;
