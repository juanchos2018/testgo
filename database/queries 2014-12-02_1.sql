CREATE TABLE regime
(
  id serial NOT NULL,
  regime regime_type NOT NULL,
  tax integer NOT NULL,
  CONSTRAINT "PK_regime_id" PRIMARY KEY (id)
);

INSERT INTO regime (regime, tax) VALUES ('General', 18);
INSERT INTO regime (regime, tax) VALUES ('ZOFRA', 0);