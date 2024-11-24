/* Renombrar la tabla campaings a campaigns o.O */
ALTER TABLE campaings RENAME TO campaigns;

/* Renombrar el campo campaing_id a campaign_id en offers o.O */
ALTER TABLE offers RENAME COLUMN campaing_id TO campaign_id;

/* Eliminar la columna branch_id y crear la tabla campaign_places */
ALTER TABLE campaigns DROP COLUMN branch_id;

CREATE TABLE campaign_places
(
  id serial NOT NULL,
  campaign_id integer NOT NULL,
  branch_id integer NOT NULL,
  CONSTRAINT pk_capmaign_place_id PRIMARY KEY (id),
  CONSTRAINT fk_campaign_places_branch_id FOREIGN KEY (branch_id)
      REFERENCES branches (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT fk_campaigns_places_campaign_id FOREIGN KEY (campaign_id)
      REFERENCES campaigns (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
);

/* Eliminar la tabla offer_places */
DROP TABLE offer_places;

/* En la tabla campaigns cambiar el tipo de start_date y end_date a tipo fecha */
ALTER TABLE campaigns ALTER COLUMN start_date TYPE DATE;
ALTER TABLE campaigns ALTER COLUMN end_date TYPE DATE;

/* Crear en la tabla campaigns los campos start_time y end_time, opcionales con valor NULO por defecto */
ALTER TABLE campaigns ADD COLUMN start_time TIME WITHOUT TIME ZONE;
ALTER TABLE campaigns ADD COLUMN end_time TIME WITHOUT TIME ZONE;

/* Eliminar de combos las columnas start_date, end_time y active, ya que estas irán en la tabla de campañas */
ALTER TABLE offers DROP COLUMN start_date;
ALTER TABLE offers DROP COLUMN end_date;
ALTER TABLE offers DROP COLUMN active;
