ALTER TABLE users ADD COLUMN company_id INTEGER;
ALTER TABLE users ADD CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id);