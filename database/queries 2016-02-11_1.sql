/* Convirtiendo vista de ofertas como vista materializada */
CREATE MATERIALIZED VIEW mv_offers AS 
 SELECT o.id,
    o.description,
    o.price,
    o.collected_amount,
    o.campaign_id,
    ARRAY( SELECT (((((od.id || ','::text) || od.price) || ','::text) || od.product_detail_id) || ','::text) || od.quantity
           FROM offer_details od
          WHERE od.offer_id = o.id) AS details
   FROM offers o
  WHERE o.active = true;
