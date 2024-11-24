/* Función para obtener régimen de una oferta */
CREATE OR REPLACE FUNCTION get_offer_regime(INTEGER)
  RETURNS regime_type AS
$BODY$
DECLARE
	v_regime regime_type;
BEGIN
	SELECT p.regime INTO v_regime
	FROM product_details pd INNER JOIN products p ON pd.product_id = p.id
	WHERE pd.id = (SELECT od.product_detail_id FROM offers o INNER JOIN offer_details od ON o.id = od.offer_id WHERE o.id = $1 LIMIT 1);

	RETURN v_regime;
END;
$BODY$
  LANGUAGE plpgsql;

/* Función para obtener el ID de empresa de una oferta */
CREATE OR REPLACE FUNCTION get_offer_company(INTEGER)
  RETURNS INTEGER AS
$BODY$
DECLARE
	v_company INTEGER;
BEGIN
	SELECT pd.company_id INTO v_company
	FROM product_details pd
	WHERE pd.id = (SELECT od.product_detail_id FROM offers o INNER JOIN offer_details od ON o.id = od.offer_id WHERE o.id = $1 LIMIT 1);

	RETURN v_company;
END;
$BODY$
  LANGUAGE plpgsql;

