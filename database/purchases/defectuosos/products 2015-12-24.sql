INSERT INTO products (description, brand_id, category_id, uses_id, ages_id, gender_id, measurement_id, code, regime) VALUES ( 'BOL. CHIMPUNERA', (SELECT brands.id FROM brands WHERE brands.description = 'LFA'), (SELECT categories.id FROM categories WHERE categories.description = 'ACCESORIO'), (SELECT uses.id FROM uses WHERE uses.description = 'RUNNING'), (SELECT ages.id FROM ages WHERE ages.description = 'ADULTO'), (SELECT genders.id FROM genders WHERE genders.description = 'UNISEX'), (SELECT measurements.id FROM measurements WHERE measurements.code = 'UNID'), 'BOL CHIMP', 'General' );
INSERT INTO products (description, brand_id, category_id, uses_id, ages_id, gender_id, measurement_id, code, regime) VALUES ( 'BOLS. DE MOCHILA', (SELECT brands.id FROM brands WHERE brands.description = 'LFA'), (SELECT categories.id FROM categories WHERE categories.description = 'ACCESORIO'), (SELECT uses.id FROM uses WHERE uses.description = 'RUNNING'), (SELECT ages.id FROM ages WHERE ages.description = 'ADULTO'), (SELECT genders.id FROM genders WHERE genders.description = 'UNISEX'), (SELECT measurements.id FROM measurements WHERE measurements.code = 'UNID'), 'BOL MOCH', 'General' );
INSERT INTO products (description, brand_id, category_id, uses_id, ages_id, gender_id, measurement_id, code, regime) VALUES ( 'N011935', (SELECT brands.id FROM brands WHERE brands.description = 'LFA'), (SELECT categories.id FROM categories WHERE categories.description = 'ACCESORIO'), (SELECT uses.id FROM uses WHERE uses.description = 'RUNNING'), (SELECT ages.id FROM ages WHERE ages.description = 'ADULTO'), (SELECT genders.id FROM genders WHERE genders.description = 'UNISEX'), (SELECT measurements.id FROM measurements WHERE measurements.code = 'UNID'), 'N011935', 'General' );