/* Eliminar anterior vista v_purchase_orders */
DROP VIEW v_purchase_orders;

/* En v_purchase_orders mostrar la cantidad de productos que llegaron */
CREATE VIEW v_purchase_orders
AS
SELECT 
  po.id,
  po.code,
  po.description,
  po.paid_date,
  po.finish_date,
  po.active,
  po.registered_at,
  s.id AS supplier_id,
  s.name AS supplier,
  c.id AS company_id,
  c.name AS company,
  bd.branch_id,
  SUM(pod.quantity) AS quantity,
  SUM(pod.arrived_quantity) AS arrived_quantity
FROM purchase_orders po
LEFT OUTER JOIN purchase_order_details pod ON po.id = pod.purchase_order_id
INNER JOIN suppliers s ON po.supplier_id = s.id
INNER JOIN branch_details bd ON po.branch_detail_id = bd.id
INNER JOIN companies c ON bd.company_id = c.id
GROUP BY po.id, po.code, po.description, po.paid_date, po.finish_date, po.active, po.registered_at, s.id, s.name, c.id, c.name, bd.branch_id;
