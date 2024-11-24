/* Eliminar vista materializada */
DROP VIEW IF EXISTS mv_offers;

/* Eliminar vista de ofertas */
DROP VIEW IF EXISTS v_offers;

/* Eliminar la columan offer_detail_id de la tabla ventas */
ALTER TABLE sale_details DROP COLUMN IF EXISTS offer_detail_id;

/* Eliminar las campañas sin paquetes */
DELETE FROM campaigns WHERE (SELECT COUNT(*) FROM packs WHERE packs.campaign_id = campaigns.id) = 0;
