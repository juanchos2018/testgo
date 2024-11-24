/* Traslado de Leguía a Vigil, producto '1239476-001' talla 'L' */
UPDATE stock SET store_stock = store_stock - 1 WHERE id = 30277; /* Leguía (branch_id = 1) */
UPDATE stock SET store_stock = store_stock + 1, last_entry = NOW(), first_entry = COALESCE(first_entry, NOW()) WHERE id = 30558; /* Vigil (branch_id = 2) */

/* Traslado de Leguía a Vigil, producto '1265026-001' talla 'L' */
UPDATE stock SET store_stock = store_stock - 1 WHERE id = 30392; /* Leguía (branch_id = 1) */
UPDATE stock SET store_stock = store_stock + 1, last_entry = NOW(), first_entry = COALESCE(first_entry, NOW()) WHERE id = 30608; /* Vigil (branch_id = 2) */