ALTER TABLE users ADD COLUMN avatar_mode INTEGER;
ALTER TABLE users ADD COLUMN avatar CHARACTER VARYING(255);
UPDATE users SET avatar_mode = 1;
UPDATE users SET avatar = 'images/avatar/1.png';