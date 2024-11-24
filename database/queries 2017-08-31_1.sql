/* Eliminar la vista anterior de v_available_campaigns */
DROP VIEW v_available_campaigns;

/* Eliminar la columan branch_id de campaigns */
ALTER TABLE campaigns DROP COLUMN branch_id;

/* Modificar la vista v_available_campaigns para que muestre las sucursales */
CREATE VIEW v_available_campaigns
AS
SELECT campaigns.id,
    campaigns.description,
    campaigns.start_date,
    campaigns.end_date,
    campaigns.active,
    campaigns.approved_state,
    campaigns.rejected_by,
    campaigns.marketing_user_id,
    campaigns.accounting_user_id,
    campaigns.start_time,
    campaigns.end_time,
    CASE WHEN COUNT(campaign_places.id) = 0 THEN NULL::INTEGER[] ELSE array_agg(campaign_places.branch_id::TEXT)::INTEGER[] END AS branches
   FROM campaigns
   LEFT OUTER JOIN campaign_places ON campaigns.id = campaign_places.campaign_id
  WHERE ((campaigns.active = true) AND ((campaigns.end_date IS NULL) OR (campaigns.end_date >= (now())::date)))
  GROUP BY campaigns.id;