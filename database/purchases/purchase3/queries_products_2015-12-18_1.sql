INSERT INTO products 
(description, brand_id, subcategory_id, category_id, uses_id, ages_id, gender_id, measurement_id, code, regime, output_statement)
VALUES
(
'${this.DESCRIPCION}',
 (SELECT brands.id FROM brands WHERE brands.description = '${this.MARCA}'),
  (SELECT subcategories.id FROM subcategories WHERE subcategories.description = '${this.TIPO}'),
  (SELECT categories.id FROM categories WHERE categories.description = '${this.LINEA}'),
  (SELECT uses.id FROM uses WHERE uses.description = '${this.DEPORTE}'),
  (SELECT ages.id FROM ages WHERE ages.description = '${this.EDAD}'),
  (SELECT genders.id FROM genders WHERE genders.description = '${this.GENERO}'),
  (SELECT measurements.id FROM measurements WHERE measurements.code = 'UNID'),
  '${this.CODIGO}',
  'ZOFRA',
  '${this["DECLARACION DE SALIDA"]}'
);