DO
$do$
DECLARE
   productos JSON[] = ARRAY[
	'{"code":"1254123-001","size":"XL"}'::JSON, 
	'{"code":"1254123-040","size":"XL"}'::JSON, 
	'{"code":"1242627-002","size":"M"}'::JSON, 
	'{"code":"1242627-002","size":"L"}'::JSON, 
	'{"code":"1242627-002","size":"XL"}'::JSON, 
	'{"code":"1242627-019","size":"M"}'::JSON, 
	'{"code":"1242627-019","size":"L"}'::JSON, 
	'{"code":"1242627-019","size":"XL"}'::JSON, 
	'{"code":"1257748-035","size":"NS"}'::JSON, 
	'{"code":"1258958-810","size":"S"}'::JSON, 
	'{"code":"1258958-810","size":"M"}'::JSON, 
	'{"code":"1258958-810","size":"L"}'::JSON, 
	'{"code":"1258958-810","size":"XL"}'::JSON, 
	'{"code":"1218006-100","size":"NS"}'::JSON, 
	'{"code":"1253690-035","size":"S"}'::JSON, 
	'{"code":"1253690-035","size":"M"}'::JSON, 
	'{"code":"1253690-035","size":"L"}'::JSON, 
	'{"code":"1254599-001","size":"NS"}'::JSON, 
	'{"code":"1257616-420","size":"S"}'::JSON, 
	'{"code":"1257616-420","size":"M"}'::JSON, 
	'{"code":"1257616-420","size":"L"}'::JSON, 
	'{"code":"1257616-420","size":"XL"}'::JSON, 
	'{"code":"1253688-001","size":"S"}'::JSON, 
	'{"code":"1253688-001","size":"M"}'::JSON, 
	'{"code":"1253688-001","size":"L"}'::JSON, 
	'{"code":"1253688-035","size":"S"}'::JSON, 
	'{"code":"1253688-035","size":"M"}'::JSON, 
	'{"code":"1253688-035","size":"L"}'::JSON, 
	'{"code":"1257748-001","size":"NS"}'::JSON, 
	'{"code":"1262157-001","size":"M"}'::JSON, 
	'{"code":"1262157-001","size":"L"}'::JSON, 
	'{"code":"1262157-001","size":"XL"}'::JSON, 
	'{"code":"1263963-041","size":"NS"}'::JSON, 
	'{"code":"1272183-001","size":"NS"}'::JSON, 
	'{"code":"1273276-001","size":"NS"}'::JSON, 
	'{"code":"1273276-428","size":"NS"}'::JSON, 
	'{"code":"1276842-984","size":"M"}'::JSON, 
	'{"code":"1276842-984","size":"L"}'::JSON, 
	'{"code":"1276842-984","size":"XL"}'::JSON, 
	'{"code":"1257616-601","size":"S"}'::JSON, 
	'{"code":"1257616-601","size":"M"}'::JSON, 
	'{"code":"1257616-601","size":"L"}'::JSON, 
	'{"code":"1257616-601","size":"XL"}'::JSON, 
	'{"code":"1257748-100","size":"NS"}'::JSON, 
	'{"code":"1263963-001","size":"NS"}'::JSON, 
	'{"code":"1218006-001","size":"NS"}'::JSON, 
	'{"code":"1252132-001","size":"ST"}'::JSON, 
	'{"code":"1252132-408","size":"ST"}'::JSON, 
	'{"code":"1253690-003","size":"S"}'::JSON, 
	'{"code":"1253690-003","size":"M"}'::JSON, 
	'{"code":"1253690-003","size":"L"}'::JSON, 
	'{"code":"1254123-410","size":"M"}'::JSON, 
	'{"code":"1254123-410","size":"L"}'::JSON, 
	'{"code":"1254123-410","size":"XL"}'::JSON, 
	'{"code":"1254599-913","size":"NS"}'::JSON, 
	'{"code":"1257536-010","size":"ST"}'::JSON, 
	'{"code":"1262157-025","size":"M"}'::JSON, 
	'{"code":"1262157-025","size":"L"}'::JSON, 
	'{"code":"1262157-025","size":"XL"}'::JSON, 
	'{"code":"1272178-001","size":"NS"}'::JSON, 
	'{"code":"1272178-002","size":"NS"}'::JSON, 
	'{"code":"1272178-913","size":"NS"}'::JSON, 
	'{"code":"1275965-001","size":"S"}'::JSON, 
	'{"code":"1275965-001","size":"L"}'::JSON, 
	'{"code":"1279896-913","size":"NS"}'::JSON
   ];
   stocks INTEGER[];
   registro JSON;
   stock_id INTEGER;
   store_stock INTEGER;
BEGIN
	/* Recorriendo todos los productos que tienen el stock correcto (en total 65) */
	FOREACH registro IN ARRAY productos
	LOOP
		SELECT sto.id, sto.store_stock INTO stock_id, store_stock FROM stock sto
		INNER JOIN product_barcodes pb ON sto.product_barcode_id = pb.id
		INNER JOIN size s ON pb.size_id = s.id
		INNER JOIN product_details pd ON pb.product_detail_id = pd.id
		INNER JOIN products p ON pd.product_id = p.id
		WHERE s.description = registro->>'size' AND p.code = registro->>'code';

		/* Guardando en el arreglo stock los stocks correctos */
		stocks := array_append(stocks, stock_id);
		RAISE NOTICE 'stock_id: %, store_stock: %', stock_id, store_stock;
	END LOOP;

	/* Reseteando el stock de todos los productos SIN CONSIDERAR los stocks correctos */
	UPDATE stock st SET store_stock = ((((st.store_stock - 18) - 6) - 6) - 6) - 6 WHERE NOT (st.id = ANY(stocks));

	/* Incrementando el stock de los productos que ya existían (en total 5) con su talla */
	UPDATE stock st SET store_stock = st.store_stock + 18 WHERE st.id = 24197;
	UPDATE stock st SET store_stock = st.store_stock + 6 WHERE st.id = 24236;
	UPDATE stock st SET store_stock = st.store_stock + 6 WHERE st.id = 24237;
	UPDATE stock st SET store_stock = st.store_stock + 6 WHERE st.id = 24238;
	UPDATE stock st SET store_stock = st.store_stock + 6 WHERE st.id = 24239;

	/* Haciendo CERO los stocks negativos */
	UPDATE stock st SET store_stock = 0 WHERE st.store_stock < 0;
END
$do$


