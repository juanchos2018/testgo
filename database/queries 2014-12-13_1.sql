ALTER TABLE regime ALTER COLUMN tax TYPE real;
UPDATE regime SET tax = 0.18 WHERE regime = 'General';