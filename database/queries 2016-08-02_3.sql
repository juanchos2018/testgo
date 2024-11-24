/* Editando vista v_purchases_details para mostrar detalle de compra con talla */
DROP VIEW v_purchase_details;
CREATE OR REPLACE VIEW v_purchase_details
AS
SELECT
	pud.id,
	pud.purchase_id,
	p.id AS product_id,
	p.code,
	s.description AS size,
	pud.quantity,
	pd.id AS product_detail_id,
	pd.cost,
	pd.cost_currency,
	pud.price,
	pud.offer_price,
	pud.invoice_cost,
	pd.invoice_currency,
	p.description,
	cat.description AS category,
	gen.description AS gender,
	age.description AS age,
	use.description AS use,
	bra.description AS brand,
	sub.description AS subcategory,
	p.regime
FROM purchase_details pud
INNER JOIN product_barcodes pb ON pud.product_barcode_id = pb.id
INNER JOIN size s ON pb.size_id = s.id
INNER JOIN product_details pd ON pb.product_detail_id = pd.id
INNER JOIN products p ON pd.product_id = p.id
LEFT OUTER JOIN categories cat ON p.category_id = cat.id
LEFT OUTER JOIN genders gen ON p.gender_id = gen.id
LEFT OUTER JOIN ages age ON p.ages_id = age.id
LEFT OUTER JOIN uses use ON p.uses_id = use.id
LEFT OUTER JOIN brands bra ON p.brand_id = bra.id
LEFT OUTER JOIN subcategories sub ON p.subcategory_id = sub.id;