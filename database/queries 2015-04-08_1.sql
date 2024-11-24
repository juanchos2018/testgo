UPDATE ages SET description = 'ADULTO' WHERE id = 1;
UPDATE ages SET description = 'JUNIOR' WHERE id = 2;
UPDATE ages SET description = 'INFANTE' WHERE id = 3;

UPDATE products SET ages_id = 1 WHERE ages_id = 4;
UPDATE products SET ages_id = 2 WHERE ages_id = 5;
UPDATE products SET ages_id = 3 WHERE ages_id = 6;

DELETE FROM ages WHERE id > 3;
