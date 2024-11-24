/* Crear la vista para ver el detalle de los pedidos */
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
  b.id AS branch_id,
  b.alias AS branch
FROM purchase_orders po
INNER JOIN suppliers s ON po.supplier_id = s.id
INNER JOIN branch_details bd ON po.branch_detail_id = bd.id
INNER JOIN companies c ON bd.company_id = c.id
INNER JOIN branches b ON bd.branch_id = b.id;