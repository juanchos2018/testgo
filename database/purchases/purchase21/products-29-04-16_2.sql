UPDATE products SET description ='CLASSICS TRADITIONNELS', brand_id = (SELECT brands.id FROM brands WHERE brands.description = 'NEW BALANCE'), subcategory_id = (SELECT subcategories.id FROM subcategories WHERE subcategories.description = 'undefined'), category_id = (SELECT categories.id FROM categories WHERE categories.description = 'CALZADO'), uses_id = (SELECT uses.id FROM uses WHERE uses.description = 'CLASICS'), ages_id = (SELECT ages.id FROM ages WHERE ages.description = 'ADULTO'), gender_id = (SELECT genders.id FROM genders WHERE genders.description = 'VARON'), measurement_id = (SELECT measurements.id FROM measurements WHERE measurements.code = 'UNID'), output_statement = '002696/16-Q5' WHERE code = 'ML565PKL'; 
UPDATE products SET description ='RUNNING COURSE', brand_id = (SELECT brands.id FROM brands WHERE brands.description = 'NEW BALANCE'), subcategory_id = (SELECT subcategories.id FROM subcategories WHERE subcategories.description = 'undefined'), category_id = (SELECT categories.id FROM categories WHERE categories.description = 'CALZADO'), uses_id = (SELECT uses.id FROM uses WHERE uses.description = 'RUNNING'), ages_id = (SELECT ages.id FROM ages WHERE ages.description = 'ADULTO'), gender_id = (SELECT genders.id FROM genders WHERE genders.description = 'DAMA'), measurement_id = (SELECT measurements.id FROM measurements WHERE measurements.code = 'UNID'), output_statement = '002696/16-Q5' WHERE code = 'WR450PK3'; 