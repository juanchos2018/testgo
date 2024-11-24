/* Crear vista para mostrar el detalle de las pre-compras */
CREATE VIEW v_purchase_order_details
AS
SELECT
	pod.id,
	pod.purchase_order_id,
	p.id AS product_id,
	p.code,
	pod.quantity,
	pd.id AS product_detail_id,
	pd.cost,
	pd.cost_currency,
	pd.invoice_cost,
	pd.invoice_currency,
	p.description,
	cat.description AS category,
	gen.description AS gender,
	age.description AS age,
	use.description AS use,
	bra.description AS brand,
	sub.description AS subcategory,
	p.regime
FROM purchase_order_details pod
INNER JOIN product_details pd ON pod.product_detail_id = pd.id
INNER JOIN products p ON pd.product_id = p.id
LEFT OUTER JOIN categories cat ON p.category_id = cat.id
LEFT OUTER JOIN genders gen ON p.gender_id = gen.id
LEFT OUTER JOIN ages age ON p.ages_id = age.id
LEFT OUTER JOIN uses use ON p.uses_id = use.id
LEFT OUTER JOIN brands bra ON p.brand_id = bra.id
LEFT OUTER JOIN subcategories sub ON p.subcategory_id = sub.id;
