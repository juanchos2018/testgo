/* Crear una vista de offers que muestre su detalles */
CREATE VIEW v_offers
AS
SELECT
o.id,
o.description,
o.price,
o.collected_amount,
o.campaign_id,
array(
	select od.id ||','||
	 od.price ||','||
	 od.product_detail_id ||','||
	 od.quantity
	from offer_details od WHERE od.offer_id = o.id
) AS details
FROM offers o;
