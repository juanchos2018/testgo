/* Vinculando en cascada la tabla campaign_places a campaigns */
ALTER TABLE campaign_places DROP CONSTRAINT fk_campaigns_places_campaign_id,
ADD CONSTRAINT fk_campaigns_places_campaign_id
   FOREIGN KEY (campaign_id)
   REFERENCES campaigns(id)
   ON DELETE CASCADE;

/* Vinculando en cascada la tabla campaign_places a branches */
ALTER TABLE campaign_places DROP CONSTRAINT fk_campaign_places_branch_id,
ADD CONSTRAINT fk_campaign_places_branch_id
   FOREIGN KEY (branch_id)
   REFERENCES branches(id)
   ON DELETE CASCADE;

/* Vinculando en cascada la tabla offers a campaigns */
ALTER TABLE offers DROP CONSTRAINT fk_offers_campaing_id,
ADD CONSTRAINT fk_offers_campaing_id
   FOREIGN KEY (campaign_id)
   REFERENCES campaigns(id)
   ON DELETE CASCADE;

/* Vinculando en cascada la tabla offer_details a offers */
ALTER TABLE offer_details DROP CONSTRAINT FK_offer_details_offer_id,
ADD CONSTRAINT offer_details_offer_id_fkey
   FOREIGN KEY (offer_id)
   REFERENCES offers(id)
   ON DELETE CASCADE;

/* Vinculando en cascada la tabla offer_details a product_details */
ALTER TABLE offer_details DROP CONSTRAINT fk_offers_details_product_details_id,
ADD CONSTRAINT fk_offers_details_product_details_id
   FOREIGN KEY (product_detail_id)
   REFERENCES product_details(id)
   ON DELETE CASCADE;
