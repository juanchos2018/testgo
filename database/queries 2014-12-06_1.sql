﻿ALTER TABLE sales DROP COLUMN IF EXISTS total_cash;
ALTER TABLE sales DROP COLUMN IF EXISTS total_credit_card;
ALTER TABLE sales ADD COLUMN credit_card_amount REAL NOT NULL DEFAULT 0;