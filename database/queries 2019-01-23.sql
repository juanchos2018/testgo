/* LIMPIAMOS LA BD */

DROP VIEW public.v_series;
DROP VIEW public.serie_printers;

/* CONSULTAS FACTURACIÓN SUNAT */
ALTER TABLE customers ADD COLUMN doc_type INTEGER NOT NULL DEFAULT '1';
ALTER TABLE series ALTER COLUMN serie TYPE CHARACTER VARYING(4);

/* CREAMOS LAS TABLAS */

CREATE OR REPLACE VIEW public.v_series AS 
 SELECT s.id,
    s.serie,
    s.serial_number,
    s.voucher,
    s.subsidiary_journal,
    b.id AS branch_id,
    b.alias AS branch_name,
    c.id AS company_id,
    c.name AS company_name,
    sp.id AS sale_point_id,
    sp.description AS sale_point_name,
    s.regime
   FROM series s
     JOIN branch_details bd ON s.branch_detail_id = bd.id
     JOIN branches b ON bd.branch_id = b.id
     JOIN companies c ON bd.company_id = c.id
     LEFT JOIN sale_points sp ON s.sale_point_id = sp.id;

ALTER TABLE public.v_series
  OWNER TO postgres;


CREATE OR REPLACE VIEW public.serie_printers AS 
 SELECT sale_points.id AS sale_point_id,
    sale_points.description AS sale_point,
    sale_points.active,
    series.serie,
    series.serial_number,
    series.voucher,
    series.subsidiary_journal,
    branch_details.branch_id,
    branch_details.company_id,
    ticket_printers.printer_serial,
    ticket_printers.printer_name
   FROM series
     JOIN sale_points ON series.sale_point_id = sale_points.id
     JOIN branch_details ON series.branch_detail_id = branch_details.id
     JOIN ticket_printers ON series.id = ticket_printers.serie_id;

ALTER TABLE public.serie_printers
  OWNER TO postgres;

