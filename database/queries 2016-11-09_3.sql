/* Mostrando proveedor si esta enlazado a pedido*/
DROP VIEW v_purchases;
CREATE VIEW v_purchases
AS
SELECT
pu.id,
pu.code,
pu.registered_at,
CASE pu.purchase_order_id WHEN NULL THEN s.id
ELSE po.supplier_id
END AS supplier_id,
CASE pu.purchase_order_id WHEN NULL THEN s.name
ELSE s.name
END AS supplier,
c.id AS company_id,
c.name AS company,
bd.branch_id,
SUM(pud.quantity) AS quantity,
SUM(pud.quantity * invoice_cost) AS total_cost,
SUM(pud.quantity * price) AS total_value,
po.id AS purchase_order_id,
po.code AS purchase_order
FROM purchases pu
LEFT OUTER JOIN purchase_details pud ON pu.id = pud.purchase_id
LEFT JOIN purchase_orders po ON pu.purchase_order_id = po.id
LEFT JOIN suppliers s ON pu.supplier_id = s.id OR po.supplier_id = s.id
INNER JOIN branch_details bd ON pu.branch_detail_id = bd.id
INNER JOIN companies c ON bd.company_id = c.id
GROUP BY pu.id, pu.code, pu.registered_at, po.supplier_id,supplier, c.id, c.name, bd.branch_id, po.id, purchase_order_id, purchase_order, s.id;
