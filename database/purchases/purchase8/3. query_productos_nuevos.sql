DO
$do$
DECLARE
   v_product_id INTEGER;
   v_product_detail_id INTEGER;
   v_product_barcode_id INTEGER;
BEGIN

/* Registsrar los productos */
INSERT INTO products 
(description, brand_id, subcategory_id, category_id, uses_id, ages_id, gender_id, measurement_id, code, regime, output_statement)
VALUES
(
'${this["DESCRIPCION"]}',
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
) RETURNING id INTO v_product_id;

/* Registrar los product_details */
INSERT INTO product_details
(company_id, price, offer_price, cost, cost_currency, currency_cost, invoice_currency, invoice_cost, product_id)
VALUES
(
  1,
  ${ this['P ANTES'] },
  ${ this['P OFERRTA'] },
  ${ this['C.U. A REPONER LFA'] },
  '${ this['MONEDA REPO'] }',
  '${ this['MONEDA REPO'] }',
  '${ this['MONEDAFACT'] }',
  ${ this['C.U. SEGUN FACTURA LFA'] },
  v_product_id
) RETURNING id INTO v_product_detail_id;


/* Ingresar los códigos de barra */
INSERT INTO product_barcodes
(size_id, old_barcode, product_detail_id)
VALUES
(
(SELECT size.id FROM size WHERE size.description = '${this.TALLA}'),
  '${this["CODIGO DE BARRAS"]}',
  v_product_detail_id
) RETURNING id INTO v_product_barcode_id;

/* Ingresar stock */
INSERT INTO stock (branch_id, product_barcode_id, store_stock, last_entry)
VALUES
(
  1,
  v_product_barcode_id,
  ${this["CANT."]},
  NOW()::TIMESTAMP WITHOUT TIME ZONE
);

END
$do$
