UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'AB7727' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'AB7727' AND si.description = 'L'
);


UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'AB7727' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'AB7727' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 4, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'A98424' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 4, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'A98424' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'AB5914' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'AB5914' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 3, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'AJ4580' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 6, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'AJ4580' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1270525-001' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1270525-001' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1269181-001' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1269181-001' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259709-043' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259709-043' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259709-009' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259709-009' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259709-009' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259709-009' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259931-008' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259931-008' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259931-008' AND si.description = 'XL'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259931-008' AND si.description = 'XL'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259931-008' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259931-008' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1260115-420' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1260115-420' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1264719-420' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1264719-420' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1264719-420' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1264719-420' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1272435-001' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1272435-001' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1272435-001' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1272435-001' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1272435-001' AND si.description = 'XL'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1272435-001' AND si.description = 'XL'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1272435-040' AND si.description = 'XL'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1272435-040' AND si.description = 'XL'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1272435-040' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1272435-040' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1272435-040' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1272435-040' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1272435-997' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1272435-997' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1272435-997' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1272435-997' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1250783-001' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1250783-001' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1250783-001' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1250783-001' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259869-420' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259869-420' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259869-420' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259869-420' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259931-420' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259931-420' AND si.description = 'S'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1250784-090' AND si.description = 'XL'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1250784-090' AND si.description = 'XL'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259869-408' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259869-408' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = '1259869-408' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = '1259869-408' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'AB7726' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'AB7726' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'AB7726' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'AB7726' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'AK1434' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'AK1434' AND si.description = 'L'
);

UPDATE stock SET store_stock = GREATEST(store_stock + 4, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 1
	AND products.code = 'AK1434' AND si.description = 'M'
);

UPDATE stock SET store_stock = GREATEST(store_stock - 4, 0) WHERE id = (SELECT s.id FROM stock s INNER JOIN product_barcodes pb ON s.product_barcode_id = pb.id INNER JOIN product_details pd ON pb.product_detail_id = pd.id INNER JOIN products ON pd.product_id = products.id INNER JOIN size si ON pb.size_id = si.id
	WHERE s.branch_id = 2
	AND products.code = 'AK1434' AND si.description = 'M'
);
