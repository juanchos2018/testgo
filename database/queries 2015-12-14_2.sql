/* Crear la vista v_available_campaigns que muestre las campañas activas y con fecha vigente */
CREATE VIEW v_available_campaigns
AS
SELECT * FROM campaigns
WHERE active = TRUE
AND (end_date IS NULL
OR end_date >= NOW()::DATE);
