ALTER TABLE type_credit_cards RENAME TO credit_card_types;
ALTER TABLE credit_card_types ADD COLUMN active BOOLEAN NOT NULL DEFAULT 't';
DROP TABLE card_types;
ALTER TABLE credit_cards RENAME COLUMN type_credit_card_id TO credit_card_type_id;