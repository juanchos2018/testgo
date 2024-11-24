ALTER TABLE users ADD COLUMN branch_id INTEGER;
ALTER TABLE users ADD COLUMN default_branch_id INTEGER;
ALTER TABLE users ADD CONSTRAINT fk_users_branch_id FOREIGN KEY (branch_id) REFERENCES branches(id);
ALTER TABLE users ADD CONSTRAINT fk_users_default_branch_id FOREIGN KEY (default_branch_id) REFERENCES branches(id);
