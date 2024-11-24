DROP VIEW IF EXISTS v_transfers;
CREATE VIEW v_transfers
AS
SELECT 
tr.id,
tr.code,
tr.total_qty,
tr.transfer_date,
tr.registered_at,
tr.registered_by,
bdo.company_id AS company_origin_id,
co.name AS company_origin,
bdo.branch_id AS branch_origin_id,
bo.alias AS branch_origin,
bdt.company_id AS company_target_id,
ct.name AS company_target,
bdt.branch_id AS branch_target_id,
bt.alias AS branch_target,
tr.shuttle_reason_id,
sr.description AS reason
FROM transfers tr
LEFT JOIN shuttle_reasons sr ON tr.shuttle_reason_id = sr.id
LEFT JOIN branch_details bdo ON tr.branch_detail_origin_id = bdo.id
LEFT JOIN branch_details bdt ON tr.branch_detail_target_id = bdt.id
LEFT JOIN companies co ON bdo.company_id = co.id
LEFT JOIN companies ct ON bdt.company_id = ct.id
LEFT JOIN branches bo ON bdo.branch_id = bo.id
LEFT JOIN branches bt ON bdt.branch_id = bt.id;