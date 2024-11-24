/* En v_purchases mostrar cantidad,costo y valor de compra */
CREATE VIEW v_purchases
AS
SELECT 
  pu.id,
  pu.code,
  pu.registered_at,
  s.id AS supplier_id,
  s.name AS supplier,
  c.id AS company_id,
  c.name AS company,
  bd.branch_id,
  SUM(pud.quantity) AS quantity,
  SUM(pud.quantity * invoice_cost) AS total_cost,
  SUM(pud.quantity * price) AS total_value
FROM purchases pu
LEFT OUTER JOIN purchase_details pud ON pu.id = pud.purchase_id
INNER JOIN suppliers s ON pu.supplier_id = s.id
INNER JOIN branch_details bd ON pu.branch_detail_id = bd.id
INNER JOIN companies c ON bd.company_id = c.id
GROUP BY pu.id, pu.code, pu.registered_at, s.id, s.name, c.id, c.name, bd.branch_id;
