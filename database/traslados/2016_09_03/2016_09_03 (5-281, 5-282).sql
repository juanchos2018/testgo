/* Traslado de (1) producto AY3920 talla M de Leguía a Vigil */
UPDATE stock SET store_stock = GREATEST(store_stock - 1, 0) WHERE id = 30797;
UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0), last_entry = NOW()::TIMESTAMP WITHOUT TIME ZONE WHERE id = 31169;

/* Traslado de (1) producto MRS5137CMG talla S de Leguía a Vigil */
UPDATE stock SET store_stock = GREATEST(store_stock - 1, 0) WHERE id = 12472;
UPDATE stock SET store_stock = GREATEST(store_stock + 1, 0), last_entry = NOW()::TIMESTAMP WITHOUT TIME ZONE WHERE id = 26697;

/* Traslado de (2) productos AP0492 talla 5 de Leguía a Vigil */
UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = 30883;
UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0), last_entry = NOW()::TIMESTAMP WITHOUT TIME ZONE WHERE id = 31112;

/* Traslado de (3) productos MT53062FLM talla L de Leguía a Vigil */
UPDATE stock SET store_stock = GREATEST(store_stock - 3, 0) WHERE id = 24521;
UPDATE stock SET store_stock = GREATEST(store_stock + 3, 0), last_entry = NOW()::TIMESTAMP WITHOUT TIME ZONE WHERE id = 26735;

/* Traslado de (2) productos MT53062FLM talla M de Leguía a Vigil */
UPDATE stock SET store_stock = GREATEST(store_stock - 2, 0) WHERE id = 24520;
UPDATE stock SET store_stock = GREATEST(store_stock + 2, 0), last_entry = NOW()::TIMESTAMP WITHOUT TIME ZONE WHERE id = 26736;
