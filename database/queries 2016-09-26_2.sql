/* Editando vista v_series para que muestre regime (útil si se trata de BOLETA o FACTURA manual) */
CREATE OR REPLACE VIEW v_series AS
SELECT s.id,
    s.serie,
    s.serial_number,
    s.voucher,
    s.subsidiary_journal,
    b.id AS branch_id,
    b.alias AS branch_name,
    c.id AS company_id,
    c.name AS company_name,
    sp.id AS sale_point_id,
    sp.description AS sale_point_name,
    s.regime
FROM series s
JOIN branch_details bd ON s.branch_detail_id = bd.id
JOIN branches b ON bd.branch_id = b.id
JOIN companies c ON bd.company_id = c.id
LEFT JOIN sale_points sp ON s.sale_point_id = sp.id;
