/* Creando restricción para tener series únicas por sucursal/empresa/regimen */
CREATE UNIQUE INDEX uq_serie_voucher_branch_detail_id ON series (serie, voucher, branch_detail_id) WHERE regime IS NULL;
CREATE UNIQUE INDEX uq_serie_voucher_regime_branch_detail_id ON series (serie, voucher, branch_detail_id, regime) WHERE regime IS NOT NULL;
