DROP TRIGGER IF EXISTS bu_packs ON packs;
DROP FUNCTION IF EXISTS fbu_packs();
DROP TRIGGER IF EXISTS au_packs ON packs;
DROP FUNCTION IF EXISTS fau_packs();

DROP TRIGGER IF EXISTS bu_pack_lists ON pack_lists;
DROP TRIGGER IF EXISTS bi_pack_lists ON pack_lists;
DROP FUNCTION IF EXISTS fbi_pack_lists();
ALTER FUNCTION fbu_pack_lists() RENAME TO fb_pack_lists;
CREATE TRIGGER bi_pack_lists BEFORE INSERT ON pack_lists FOR EACH ROW EXECUTE PROCEDURE fb_pack_lists();
CREATE TRIGGER bu_pack_lists BEFORE UPDATE ON pack_lists FOR EACH ROW EXECUTE PROCEDURE fb_pack_lists();

ALTER TABLE packs DROP COLUMN combinations;
ALTER TABLE pack_lists
  ALTER COLUMN quantity SET DEFAULT 1,
  ALTER COLUMN quantity SET NOT NULL;

ALTER TABLE pack_lists DROP COLUMN description;
ALTER TABLE packs ADD COLUMN description CHARACTER VARYING(255) NOT NULL;
ALTER TABLE packs ADD COLUMN company_id INTEGER NOT NULL REFERENCES companies (id);
ALTER TABLE packs ADD COLUMN regime regime_type NOT NULL;

ALTER TABLE sale_details ADD COLUMN pack_list_id INTEGER REFERENCES pack_lists (id);
/*ALTER TABLE sale_details DROP COLUMN offer_detail_id;*/
