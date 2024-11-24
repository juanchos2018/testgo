/*
https://hashrocket.com/blog/posts/materialized-view-strategies-using-postgresql
*/

/* Eliminar la vista materializada anterior */
DROP MATERIALIZED VIEW mv_offers;

/* Crear nueva vista materializada sin excluir ofertas inactivas y mostrando régimen/empresa */
CREATE MATERIALIZED VIEW mv_offers AS 
 SELECT o.id,
    o.description,
    o.price,
    o.collected_amount,
    o.campaign_id,
    o.active,
    get_offer_company(o.id) AS company_id,
    get_offer_regime(o.id) AS regime,
    ARRAY( SELECT (((((od.id || ','::text) || od.price) || ','::text) || od.product_detail_id) || ','::text) || od.quantity
           FROM offer_details od
          WHERE od.offer_id = o.id) AS details
   FROM offers o;

/* Crear un índice en campaign_id en vista materializada mv_offers */
CREATE INDEX ON mv_offers (campaign_id);
