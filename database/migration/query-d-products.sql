INSERT INTO products
(description, brand_id, subcategory_id, category_id, uses_id, ages_id, measurement_id, code, regime, output_statement)
VALUES
(
	'${ (/^D.? ?S.? /i .test(this.Descripcion) && this.Descripcion.indexOf("/") > 0) ? /^D.? ?S.? .+?\/(.*)$/i .exec(this.Descripcion)[1] : this.Descripcion; }',
  (SELECT id FROM brands WHERE description = '${ this.Marca }'),
  (SELECT id FROM subcategories WHERE description = '${ this.subcategories }'),
  (SELECT id FROM categories WHERE description = '${ this.Linea }'),
  (SELECT id FROM uses WHERE description = '${ this.Tipo }'),
  (SELECT id FROM ages WHERE description = '${ this.Genero }'),
  (SELECT id FROM measurements WHERE code = '${ this.measurements }'),
  '${ this.Codigo }',
  '${ parseInt(this["R/Z"]) === 0 ? "ZOFRA" : "General" }',
  ${ (/^D.? ?S.? /i .test(this.Descripcion) && this.Descripcion.indexOf("/") > 0) ? "'" : "NULL" }${ (/^D.? ?S.? /i .test(this.Descripcion) && this.Descripcion.indexOf("/") > 0) ? /^D.? ?S.? (.+) ?\//i .exec(this.Descripcion)[1] : ""; }${ (/^D.? ?S.? /i .test(this.Descripcion) && this.Descripcion.indexOf("/") > 0) ? "'" : "" }
);