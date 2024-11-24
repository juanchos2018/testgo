/* Eliminar la vista materializada anterior */
DROP MATERIALIZED VIEW mv_offers;

/* Crear nueva vista materializada incluyendo el costo de los productos */
CREATE MATERIALIZED VIEW mv_offers AS 
 SELECT o.id,
    o.description,
    o.price,
    o.collected_amount,
    o.campaign_id,
    o.active,
    get_offer_company(o.id) AS company_id,
    get_offer_regime(o.id) AS regime,
    ARRAY( SELECT (((((od.id || ','::text) || od.price) || ','::text) || od.product_detail_id) || ','::text) || od.quantity || ',' || pd.cost
           FROM offer_details od INNER JOIN product_details pd ON od.product_detail_id = pd.id
          WHERE od.offer_id = o.id) AS details
   FROM offers o;
   