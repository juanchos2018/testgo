/* Crear la vista de departamentos o ciudades de clientes */
CREATE VIEW customer_cities
AS
SELECT DISTINCT UPPER(TRIM(city::TEXT)) AS city
FROM customers
WHERE city IS NOT NULL AND LENGTH(city) > 1 AND city NOT SIMILAR TO '%[\d\.]%'
ORDER BY UPPER(TRIM(city::TEXT)) ASC;

/* Crear la vista de países de clientes */
CREATE VIEW customer_countries
AS
SELECT DISTINCT UPPER(TRIM(country::TEXT)) AS country
FROM customers
WHERE country IS NOT NULL AND LENGTH(country) > 1 AND country NOT SIMILAR TO '%[\d\.]%'
ORDER BY UPPER(TRIM(country::TEXT)) ASC;
