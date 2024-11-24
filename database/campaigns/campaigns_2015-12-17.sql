TRUNCATE TABLE campaigns RESTART IDENTITY CASCADE;
TRUNCATE TABLE campaign_places RESTART IDENTITY CASCADE;
TRUNCATE TABLE offers RESTART IDENTITY CASCADE;
TRUNCATE TABLE offer_details RESTART IDENTITY CASCADE;

/* Ingresando Campaña */

INSERT INTO campaigns (description,start_date,end_date,branch_id) VALUES ('Campaña Navidad','2015-12-15','2016-01-1',1);

/*Ingresando places*/

INSERT INTO campaign_places(campaign_id,branch_id) VALUES(1,1);

