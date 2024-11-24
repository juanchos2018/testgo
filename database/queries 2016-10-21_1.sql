/* Enlazando Traslados con tabla usuarios */
ALTER TABLE transfers ADD CONSTRAINT fk_transfers_registered_by FOREIGN KEY (registered_by) REFERENCES users(id);
