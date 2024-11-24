CREATE OR REPLACE VIEW v_available_campaigns
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
        CASE
            WHEN (count(campaign_places.id) = 0) THEN NULL::integer[]
            ELSE (array_agg((campaign_places.branch_id)::text))::integer[]
        END AS branches
   FROM (campaigns
     LEFT JOIN campaign_places ON ((campaigns.id = campaign_places.campaign_id)))
  WHERE ((campaigns.active = true) AND ((campaigns.end_date IS NULL) OR (campaigns.start_date <= (now())::date AND campaigns.end_date >= (now())::date)))
  GROUP BY campaigns.id;
