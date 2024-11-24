/* Considerar solo los combos que estén activos */
CREATE OR REPLACE VIEW v_offers AS 
 SELECT o.id,
    o.description,
    o.price,
    o.collected_amount,
    o.campaign_id,
    ARRAY( SELECT (((((od.id || ','::text) || od.price) || ','::text) || od.product_detail_id) || ','::text) || od.quantity
           FROM offer_details od
          WHERE od.offer_id = o.id) AS details
   FROM offers o WHERE o.active = TRUE;