--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.5
-- Dumped by pg_dump version 9.3.5
-- Started on 2015-12-02 13:11:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 275 (class 3079 OID 11750)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2690 (class 0 OID 0)
-- Dependencies: 275
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 629 (class 1247 OID 63402)
-- Name: approved_state_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE approved_state_type AS ENUM (
    'RECHAZADO',
    'PENDIENTE',
    'A. CONTABILIDAD',
    'A. MARKETING',
    'A. LOGISTICA',
    'A. GERENCIA'
);


ALTER TYPE public.approved_state_type OWNER TO postgres;

--
-- TOC entry 632 (class 1247 OID 63416)
-- Name: customer_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE customer_type AS ENUM (
    'PERSONA',
    'EMPRESA'
);


ALTER TYPE public.customer_type OWNER TO postgres;

--
-- TOC entry 635 (class 1247 OID 63422)
-- Name: money_abbrevs; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE money_abbrevs AS ENUM (
    'USD',
    'CLP'
);


ALTER TYPE public.money_abbrevs OWNER TO postgres;

--
-- TOC entry 638 (class 1247 OID 63428)
-- Name: regime_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE regime_type AS ENUM (
    'General',
    'ZOFRA'
);


ALTER TYPE public.regime_type OWNER TO postgres;

--
-- TOC entry 641 (class 1247 OID 63434)
-- Name: state_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE state_type AS ENUM (
    'DRAFT',
    'DONE',
    'SOLD',
    'REFUNDED',
    'CANCELED'
);


ALTER TYPE public.state_type OWNER TO postgres;

--
-- TOC entry 644 (class 1247 OID 63446)
-- Name: voucher_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE voucher_type AS ENUM (
    'BOLETA',
    'FACTURA',
    'NOTA DE CREDITO',
    'TICKET'
);


ALTER TYPE public.voucher_type OWNER TO postgres;

--
-- TOC entry 288 (class 1255 OID 63455)
-- Name: increase_store_stock(json[], boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION increase_store_stock(json[], boolean) RETURNS void
    LANGUAGE plpgsql
    AS $_$
DECLARE
	stock_json JSON;
BEGIN
	FOREACH stock_json IN ARRAY $1
	LOOP
		IF $2 = TRUE THEN
			UPDATE stock SET store_stock = store_stock + (stock_json->>'increment')::INTEGER,
			 last_sale = NOW()
			WHERE product_barcode_id = (stock_json->>'product_barcode_id')::INTEGER
			 AND branch_id = (stock_json->>'branch_id')::INTEGER;
		ELSE
			UPDATE stock SET store_stock = store_stock + (stock_json->>'increment')::INTEGER
			WHERE product_barcode_id = (stock_json->>'product_barcode_id')::INTEGER
			 AND branch_id = (stock_json->>'branch_id')::INTEGER;
		END IF;
	END LOOP;
END;
$_$;


ALTER FUNCTION public.increase_store_stock(json[], boolean) OWNER TO postgres;

--
-- TOC entry 289 (class 1255 OID 63456)
-- Name: on_change_barcodes(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION on_change_barcodes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF NEW.barcode IS NULL AND NEW.product_detail_id IS NOT NULL AND NEW.size_id IS NOT NULL THEN
		NEW.barcode := (SELECT LPAD(product_details.company_id::TEXT, 2, '0') || LPAD(product_details.product_id::TEXT, 10, '0') FROM product_details WHERE product_details.id = NEW.product_detail_id LIMIT 1) || LPAD(NEW.size_id::TEXT, 3, '0');
	END IF;
 
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.on_change_barcodes() OWNER TO postgres;

--
-- TOC entry 290 (class 1255 OID 63457)
-- Name: on_change_exchange_rates(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION on_change_exchange_rates() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.updated_at := NOW()::TIMESTAMP WITHOUT TIME ZONE;
 
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.on_change_exchange_rates() OWNER TO postgres;

--
-- TOC entry 291 (class 1255 OID 63458)
-- Name: on_change_sale_details(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION on_change_sale_details() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	NEW.utility := NEW.price - NEW.cost;
	NEW.subtotal := NEW.price * NEW.quantity;
	
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.on_change_sale_details() OWNER TO postgres;

--
-- TOC entry 292 (class 1255 OID 63459)
-- Name: on_change_sales(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION on_change_sales() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF NEW.total_amount > NEW.credit_card_amount THEN
		NEW.cash_amount := NEW.total_amount - NEW.credit_card_amount;
	END IF;
 
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.on_change_sales() OWNER TO postgres;

--
-- TOC entry 293 (class 1255 OID 63460)
-- Name: on_new_sales(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION on_new_sales() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	IF(NEW.voucher = 'NOTA DE CREDITO') THEN
		UPDATE sale_points SET cash_amount = (cash_amount - NEW.cash_amount)
		WHERE id = NEW.sale_point_id;
	ELSE
		UPDATE sale_points SET cash_amount = (cash_amount + NEW.cash_amount)
		WHERE id = NEW.sale_point_id;
	END IF;
	--INSERT INTO sale_points (description,active,cash_amount) VALUES ('Nuevo',TRUE,NEW.cash_amount);
	RETURN NULL;
END;
$$;


ALTER FUNCTION public.on_new_sales() OWNER TO postgres;

--
-- TOC entry 294 (class 1255 OID 63461)
-- Name: save_sale(json[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION save_sale(json[]) RETURNS text
    LANGUAGE plpgsql
    AS $_$
DECLARE
	sale JSON;
	sale_id INTEGER;
	serie_found INTEGER;
	serie_serie INTEGER;
	serie_serial INTEGER;
	serie_printer_name TEXT;
	serie_printer_serial TEXT;
	result JSON[];
BEGIN
	FOREACH sale IN ARRAY $1
	LOOP
		IF (sale->>'sale_point_id') IS NOT NULL THEN
			-- Se trata de un TICKET para un PUNTO DE VENTA
			SELECT series.id INTO serie_found FROM series INNER JOIN branch_details ON series.branch_detail_id = branch_details.id INNER JOIN sale_points ON series.sale_point_id = sale_points.id
			WHERE branch_details.branch_id = (sale->>'branch_id')::INTEGER AND branch_details.company_id = (sale->>'company_id')::INTEGER
			AND sale_points.id = (sale->>'sale_point_id')::INTEGER AND sale_points.active = TRUE AND series.voucher = (sale->>'voucher')::voucher_type;

			IF serie_found IS NULL THEN
				-- No se encontró una ticketera para esta empresa, se debe tomar el de otra empresa
				SELECT series.id INTO serie_found FROM series INNER JOIN branch_details ON series.branch_detail_id = branch_details.id INNER JOIN sale_points ON series.sale_point_id = sale_points.id
				WHERE branch_details.branch_id = (sale->>'branch_id')::INTEGER AND branch_details.company_id = (sale->>'company_id')::INTEGER
				AND sale_points.active = TRUE AND series.voucher = (sale->>'voucher')::voucher_type;			
			END IF;
		ELSE
			-- Se trata de una VENTA manual o DEVOLUCION, no se considera un PUNTO DE VENTA
			SELECT series.id INTO serie_found FROM series INNER JOIN branch_details ON series.branch_detail_id = branch_details.id
			WHERE branch_details.branch_id = (sale->>'branch_id')::INTEGER AND branch_details.company_id = (sale->>'company_id')::INTEGER
			AND series.voucher = (sale->>'voucher')::voucher_type;			
		END IF;

		IF serie_found IS NOT NULL THEN
			SELECT serie INTO serie_serie FROM series WHERE id = serie_found;
			-- Incrementamos el correlativo y lo almacenamos en la variable serie_serial
			UPDATE series SET serial_number = serial_number + 1 WHERE id = serie_found RETURNING serial_number - 1 INTO serie_serial;
			SELECT printer_name INTO serie_printer_name FROM ticket_printers WHERE serie_id = serie_found;
			SELECT printer_serial INTO serie_printer_serial FROM ticket_printers WHERE serie_id = serie_found;
		END IF;
		
		INSERT INTO sales (
			salesman_id,
			cashier_id,
			customer_id,
			coupon_id,
			igv,
			total_amount,
			state,
			voucher,
			regime,
			serie,
			serial_number,
			refund_origin_id,
			refund_target_id,
			sale_point_id,
			total_cash_amount,
			credit_card_amount,
			branch_id,
			company_id
		) VALUES (
			CASE WHEN (sale->>'salesman_id') IS NULL THEN NULL ELSE (sale->>'salesman_id')::INTEGER END,
			CASE WHEN (sale->>'cashier_id') IS NULL THEN NULL ELSE (sale->>'cashier_id')::INTEGER END,
			CASE WHEN (sale->>'customer_id') IS NULL THEN NULL ELSE (sale->>'customer_id')::INTEGER END,
			CASE WHEN (sale->>'coupon_id') IS NULL THEN NULL ELSE (sale->>'coupon_id')::INTEGER END,
			(sale->>'igv')::REAL,
			(sale->>'total_amount')::REAL,
			(sale->>'state')::state_type,
			(sale->>'voucher')::voucher_type,
			(sale->>'regime')::regime_type,
			serie_serie,
			serie_serial,
			CASE WHEN (sale->>'refund_origin_id') IS NULL THEN NULL ELSE (sale->>'refund_origin_id')::INTEGER END,
			CASE WHEN (sale->>'refund_target_id') IS NULL THEN NULL ELSE (sale->>'refund_target_id')::INTEGER END,
			CASE WHEN (sale->>'sale_point_id') IS NULL THEN NULL ELSE (sale->>'sale_point_id')::INTEGER END,
			(sale->>'total_cash_amount')::REAL,
			(sale->>'credit_card_amount')::REAL,
			CASE WHEN (sale->>'branch_id') IS NULL THEN NULL ELSE (sale->>'branch_id')::INTEGER END,
			CASE WHEN (sale->>'company_id') IS NULL THEN NULL ELSE (sale->>'company_id')::INTEGER END
		) RETURNING id INTO sale_id;

		IF serie_printer_name IS NULL THEN
			result := array_append(result, ('{"id":' || sale_id ||  ',"serie":' || COALESCE(serie_serie::TEXT, 'null') ||',"serial":' || COALESCE(serie_serial::TEXT, 'null') || '}')::JSON);
		ELSE
			result := array_append(result, ('{"id":' || sale_id ||  ',"serie":' || COALESCE(serie_serie::TEXT, 'null') ||',"serial":' || COALESCE(serie_serial::TEXT, 'null') || ',"printer":"' || serie_printer_name || '","printer_serial":"' || serie_printer_serial || '"}')::JSON);
		END IF;
	END LOOP;

	RETURN '[' || array_to_string(result, ',') || ']';
END;
$_$;


ALTER FUNCTION public.save_sale(json[]) OWNER TO postgres;

--
-- TOC entry 295 (class 1255 OID 63462)
-- Name: truncate_tables(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION truncate_tables(username character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    statements CURSOR FOR
        SELECT tablename FROM pg_tables
        WHERE tableowner = username AND schemaname = 'public';
BEGIN
    FOR stmt IN statements LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
    END LOOP;
END;
$$;


ALTER FUNCTION public.truncate_tables(username character varying) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 170 (class 1259 OID 63463)
-- Name: access_control; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE access_control (
    id integer NOT NULL,
    role_id integer,
    module_id integer,
    action_id integer
);


ALTER TABLE public.access_control OWNER TO postgres;

--
-- TOC entry 171 (class 1259 OID 63466)
-- Name: access_control_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE access_control_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.access_control_id_seq OWNER TO postgres;

--
-- TOC entry 2691 (class 0 OID 0)
-- Dependencies: 171
-- Name: access_control_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE access_control_id_seq OWNED BY access_control.id;


--
-- TOC entry 172 (class 1259 OID 63468)
-- Name: actions; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE actions (
    id integer NOT NULL,
    description character varying(20)
);


ALTER TABLE public.actions OWNER TO postgres;

--
-- TOC entry 173 (class 1259 OID 63471)
-- Name: actions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.actions_id_seq OWNER TO postgres;

--
-- TOC entry 2692 (class 0 OID 0)
-- Dependencies: 173
-- Name: actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE actions_id_seq OWNED BY actions.id;


--
-- TOC entry 174 (class 1259 OID 63473)
-- Name: ages; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE ages (
    id integer NOT NULL,
    description character varying(90),
    active boolean DEFAULT true
);


ALTER TABLE public.ages OWNER TO postgres;

--
-- TOC entry 175 (class 1259 OID 63477)
-- Name: ages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE ages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ages_id_seq OWNER TO postgres;

--
-- TOC entry 2693 (class 0 OID 0)
-- Dependencies: 175
-- Name: ages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE ages_id_seq OWNED BY ages.id;


--
-- TOC entry 176 (class 1259 OID 63479)
-- Name: banks; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE banks (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    active boolean DEFAULT true
);


ALTER TABLE public.banks OWNER TO postgres;

--
-- TOC entry 177 (class 1259 OID 63483)
-- Name: banks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE banks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.banks_id_seq OWNER TO postgres;

--
-- TOC entry 2694 (class 0 OID 0)
-- Dependencies: 177
-- Name: banks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE banks_id_seq OWNED BY banks.id;


--
-- TOC entry 178 (class 1259 OID 63485)
-- Name: product_barcodes; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE product_barcodes (
    id integer NOT NULL,
    size_id integer NOT NULL,
    old_barcode character varying(15),
    barcode character varying(15),
    product_detail_id integer
);


ALTER TABLE public.product_barcodes OWNER TO postgres;

--
-- TOC entry 179 (class 1259 OID 63488)
-- Name: barcodes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE barcodes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.barcodes_id_seq OWNER TO postgres;

--
-- TOC entry 2695 (class 0 OID 0)
-- Dependencies: 179
-- Name: barcodes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE barcodes_id_seq OWNED BY product_barcodes.id;


--
-- TOC entry 180 (class 1259 OID 63490)
-- Name: branch_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE branch_details (
    id integer NOT NULL,
    branch_id integer NOT NULL,
    company_id integer NOT NULL
);


ALTER TABLE public.branch_details OWNER TO postgres;

--
-- TOC entry 181 (class 1259 OID 63493)
-- Name: branch_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE branch_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.branch_details_id_seq OWNER TO postgres;

--
-- TOC entry 2696 (class 0 OID 0)
-- Dependencies: 181
-- Name: branch_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE branch_details_id_seq OWNED BY branch_details.id;


--
-- TOC entry 182 (class 1259 OID 63495)
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE branches (
    id integer NOT NULL,
    company_id integer NOT NULL,
    address character varying(80),
    alias character varying(20),
    active boolean DEFAULT true NOT NULL,
    province character varying(250) NOT NULL,
    district character varying(250) NOT NULL,
    department character varying(250) NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- TOC entry 183 (class 1259 OID 63502)
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE branches_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.branches_id_seq OWNER TO postgres;

--
-- TOC entry 2697 (class 0 OID 0)
-- Dependencies: 183
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE branches_id_seq OWNED BY branches.id;


--
-- TOC entry 184 (class 1259 OID 63504)
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE brands (
    id integer NOT NULL,
    description character varying(60) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 63508)
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE brands_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.brands_id_seq OWNER TO postgres;

--
-- TOC entry 2698 (class 0 OID 0)
-- Dependencies: 185
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE brands_id_seq OWNED BY brands.id;


--
-- TOC entry 186 (class 1259 OID 63510)
-- Name: campaings; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE campaings (
    id integer NOT NULL,
    description character varying(100) NOT NULL,
    start_date timestamp without time zone DEFAULT now() NOT NULL,
    end_date timestamp without time zone,
    active boolean DEFAULT false NOT NULL,
    approved_state approved_state_type DEFAULT 'PENDIENTE'::approved_state_type,
    rejected_by integer,
    branch_id integer,
    marketing_user_id integer,
    accounting_user_id integer
);


ALTER TABLE public.campaings OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 63516)
-- Name: campaings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE campaings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.campaings_id_seq OWNER TO postgres;

--
-- TOC entry 2699 (class 0 OID 0)
-- Dependencies: 187
-- Name: campaings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE campaings_id_seq OWNED BY campaings.id;


--
-- TOC entry 188 (class 1259 OID 63518)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE categories (
    id integer NOT NULL,
    description character varying(60) NOT NULL,
    image character varying(255),
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 63522)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 2700 (class 0 OID 0)
-- Dependencies: 189
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE categories_id_seq OWNED BY categories.id;


--
-- TOC entry 190 (class 1259 OID 63524)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE companies (
    id integer NOT NULL,
    name character varying(80) NOT NULL,
    active boolean DEFAULT true,
    company_name character varying(100) DEFAULT ''::character varying NOT NULL,
    address character varying(250) DEFAULT ''::character varying NOT NULL,
    department character varying(250) DEFAULT 'TACNA'::character varying NOT NULL,
    province character varying(250) DEFAULT 'TACNA'::character varying NOT NULL,
    district character varying(250) DEFAULT 'TACNA'::character varying NOT NULL,
    ruc character varying(11) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 63537)
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.companies_id_seq OWNER TO postgres;

--
-- TOC entry 2701 (class 0 OID 0)
-- Dependencies: 191
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE companies_id_seq OWNED BY companies.id;


--
-- TOC entry 192 (class 1259 OID 63539)
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE coupons (
    id integer NOT NULL,
    code character varying(15) NOT NULL,
    amount real NOT NULL,
    creation_date date DEFAULT ('now'::text)::date NOT NULL,
    used_date timestamp without time zone,
    active boolean DEFAULT true,
    expiry_date date
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 63544)
-- Name: credit_card_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE credit_card_types (
    id integer NOT NULL,
    description character varying(25),
    abbrev character varying(10),
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.credit_card_types OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 63548)
-- Name: credit_cards; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE credit_cards (
    id integer NOT NULL,
    sale_id integer,
    operation_code character varying(5),
    verification_code character varying(5) NOT NULL,
    amount real NOT NULL,
    credit_card_type_id integer NOT NULL
);


ALTER TABLE public.credit_cards OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 63551)
-- Name: credit_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE credit_cards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.credit_cards_id_seq OWNER TO postgres;

--
-- TOC entry 2702 (class 0 OID 0)
-- Dependencies: 195
-- Name: credit_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE credit_cards_id_seq OWNED BY credit_cards.id;


--
-- TOC entry 196 (class 1259 OID 63553)
-- Name: currencies; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE currencies (
    id integer NOT NULL,
    description character varying(90),
    active boolean DEFAULT true,
    exchange_rate real DEFAULT 1 NOT NULL
);


ALTER TABLE public.currencies OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 63558)
-- Name: currencies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE currencies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.currencies_id_seq OWNER TO postgres;

--
-- TOC entry 2703 (class 0 OID 0)
-- Dependencies: 197
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE currencies_id_seq OWNED BY currencies.id;


--
-- TOC entry 198 (class 1259 OID 63560)
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE customers (
    id integer NOT NULL,
    nro_inticard character varying(15),
    barcode_inticard character varying(12),
    barcode_card2 character varying(6),
    name character varying(150),
    last_name character varying(150),
    id_number character varying(15),
    address character varying(250),
    born_date date,
    city character varying(150),
    phone_number character varying(20),
    mobile_phone_number character varying(20),
    mobile_phone_number2 character varying(20),
    email character varying(80),
    web character varying(120),
    workplace character varying(150),
    registered_at timestamp without time zone DEFAULT now(),
    last_purchase timestamp without time zone,
    level character varying(30),
    gender character(1),
    points integer,
    current_points integer,
    active boolean DEFAULT true,
    type customer_type DEFAULT 'PERSONA'::customer_type NOT NULL,
    registered_by integer,
    registered_in integer,
    country character varying(150),
    facebook character varying(255)
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 63569)
-- Name: customer_cities; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW customer_cities AS
 SELECT DISTINCT upper(btrim((customers.city)::text)) AS city
   FROM customers
  WHERE (((customers.city IS NOT NULL) AND (length((customers.city)::text) > 1)) AND ((customers.city)::text !~ similar_escape('%[\d\.]%'::text, NULL::text)))
  ORDER BY upper(btrim((customers.city)::text));


ALTER TABLE public.customer_cities OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 63573)
-- Name: customer_countries; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW customer_countries AS
 SELECT DISTINCT upper(btrim((customers.country)::text)) AS country
   FROM customers
  WHERE (((customers.country IS NOT NULL) AND (length((customers.country)::text) > 1)) AND ((customers.country)::text !~ similar_escape('%[\d\.]%'::text, NULL::text)))
  ORDER BY upper(btrim((customers.country)::text));


ALTER TABLE public.customer_countries OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 63577)
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO postgres;

--
-- TOC entry 2704 (class 0 OID 0)
-- Dependencies: 201
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE customers_id_seq OWNED BY customers.id;


--
-- TOC entry 202 (class 1259 OID 63579)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE employees (
    id integer NOT NULL,
    name character varying(80),
    last_name character varying(80),
    user_id integer,
    active boolean DEFAULT true,
    born_date date DEFAULT '1900-01-01'::date,
    mobile_number character varying(15),
    entry_date timestamp without time zone DEFAULT now(),
    code character varying(5)
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 63585)
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE employees_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.employees_id_seq OWNER TO postgres;

--
-- TOC entry 2705 (class 0 OID 0)
-- Dependencies: 203
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE employees_id_seq OWNED BY employees.id;


--
-- TOC entry 204 (class 1259 OID 63587)
-- Name: exchange_rates; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE exchange_rates (
    id integer NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    purchase_value real DEFAULT 0 NOT NULL,
    sale_value real DEFAULT 0 NOT NULL,
    money_abbrev money_abbrevs NOT NULL,
    unit real NOT NULL
);


ALTER TABLE public.exchange_rates OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 63593)
-- Name: exchange_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE exchange_rates_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.exchange_rates_id_seq OWNER TO postgres;

--
-- TOC entry 2706 (class 0 OID 0)
-- Dependencies: 205
-- Name: exchange_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE exchange_rates_id_seq OWNED BY exchange_rates.id;


--
-- TOC entry 206 (class 1259 OID 63595)
-- Name: genders; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE genders (
    id integer NOT NULL,
    description character varying(90) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.genders OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 63599)
-- Name: genders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE genders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genders_id_seq OWNER TO postgres;

--
-- TOC entry 2707 (class 0 OID 0)
-- Dependencies: 207
-- Name: genders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE genders_id_seq OWNED BY genders.id;


--
-- TOC entry 208 (class 1259 OID 63601)
-- Name: inputs; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE inputs (
    id integer NOT NULL,
    alias character varying(70),
    input_date timestamp without time zone DEFAULT now() NOT NULL,
    quantity integer,
    shuttle_reason_id integer
);


ALTER TABLE public.inputs OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 63605)
-- Name: inputs_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE inputs_details (
    id integer NOT NULL,
    input_id integer,
    product_barcode_id integer,
    quantity integer
);


ALTER TABLE public.inputs_details OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 63608)
-- Name: inputs_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE inputs_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inputs_details_id_seq OWNER TO postgres;

--
-- TOC entry 2708 (class 0 OID 0)
-- Dependencies: 210
-- Name: inputs_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE inputs_details_id_seq OWNED BY inputs_details.id;


--
-- TOC entry 211 (class 1259 OID 63610)
-- Name: inputs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE inputs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inputs_id_seq OWNER TO postgres;

--
-- TOC entry 2709 (class 0 OID 0)
-- Dependencies: 211
-- Name: inputs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE inputs_id_seq OWNED BY inputs.id;


--
-- TOC entry 212 (class 1259 OID 63612)
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE invoices (
    id integer NOT NULL,
    serie integer NOT NULL,
    serial integer NOT NULL,
    date timestamp without time zone NOT NULL,
    amount real DEFAULT 0 NOT NULL,
    file character varying(255),
    update_date timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 63617)
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE invoices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.invoices_id_seq OWNER TO postgres;

--
-- TOC entry 2710 (class 0 OID 0)
-- Dependencies: 213
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE invoices_id_seq OWNED BY invoices.id;


--
-- TOC entry 214 (class 1259 OID 63619)
-- Name: measurements; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE measurements (
    id integer NOT NULL,
    code character varying(6),
    description character varying(90),
    active boolean DEFAULT true
);


ALTER TABLE public.measurements OWNER TO postgres;

--
-- TOC entry 2711 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE measurements; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE measurements IS 'Español
Tabla para Unidades de Medida
ej.
U Unidad
P Par
C/U Cada uno';


--
-- TOC entry 215 (class 1259 OID 63623)
-- Name: measurements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE measurements_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.measurements_id_seq OWNER TO postgres;

--
-- TOC entry 2712 (class 0 OID 0)
-- Dependencies: 215
-- Name: measurements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE measurements_id_seq OWNED BY measurements.id;


--
-- TOC entry 216 (class 1259 OID 63625)
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE modules (
    id integer NOT NULL,
    description character varying(50)
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 63628)
-- Name: modules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE modules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.modules_id_seq OWNER TO postgres;

--
-- TOC entry 2713 (class 0 OID 0)
-- Dependencies: 217
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE modules_id_seq OWNED BY modules.id;


--
-- TOC entry 218 (class 1259 OID 63630)
-- Name: offer_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE offer_details (
    id integer NOT NULL,
    offer_id integer NOT NULL,
    price real DEFAULT 0 NOT NULL,
    product_details_id integer NOT NULL
);


ALTER TABLE public.offer_details OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 63634)
-- Name: offer_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE offer_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offer_details_id_seq OWNER TO postgres;

--
-- TOC entry 2714 (class 0 OID 0)
-- Dependencies: 219
-- Name: offer_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE offer_details_id_seq OWNED BY offer_details.id;


--
-- TOC entry 220 (class 1259 OID 63636)
-- Name: offer_places; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE offer_places (
    id integer NOT NULL,
    offer_id integer NOT NULL,
    global boolean DEFAULT false NOT NULL,
    company_id integer,
    branch_id integer
);


ALTER TABLE public.offer_places OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 63640)
-- Name: offer_places_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE offer_places_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offer_places_id_seq OWNER TO postgres;

--
-- TOC entry 2715 (class 0 OID 0)
-- Dependencies: 221
-- Name: offer_places_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE offer_places_id_seq OWNED BY offer_places.id;


--
-- TOC entry 222 (class 1259 OID 63642)
-- Name: offers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE offers (
    id integer NOT NULL,
    description character varying(255),
    price real DEFAULT 0 NOT NULL,
    start_date timestamp without time zone DEFAULT now() NOT NULL,
    end_date timestamp without time zone,
    active boolean DEFAULT true NOT NULL,
    collected_amount real DEFAULT 0,
    campaing_id integer
);


ALTER TABLE public.offers OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 63649)
-- Name: offers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE offers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offers_id_seq OWNER TO postgres;

--
-- TOC entry 2716 (class 0 OID 0)
-- Dependencies: 223
-- Name: offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE offers_id_seq OWNED BY offers.id;


--
-- TOC entry 224 (class 1259 OID 63651)
-- Name: outputs; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE outputs (
    id integer NOT NULL,
    alias character varying(70),
    output_date timestamp without time zone DEFAULT now() NOT NULL,
    quantity integer,
    shuttle_reason_id integer
);


ALTER TABLE public.outputs OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 63655)
-- Name: outputs_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE outputs_details (
    id integer NOT NULL,
    output_id integer,
    product_barcode_id integer,
    quantity integer
);


ALTER TABLE public.outputs_details OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 63658)
-- Name: outputs_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE outputs_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.outputs_details_id_seq OWNER TO postgres;

--
-- TOC entry 2717 (class 0 OID 0)
-- Dependencies: 226
-- Name: outputs_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE outputs_details_id_seq OWNED BY outputs_details.id;


--
-- TOC entry 227 (class 1259 OID 63660)
-- Name: outputs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE outputs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.outputs_id_seq OWNER TO postgres;

--
-- TOC entry 2718 (class 0 OID 0)
-- Dependencies: 227
-- Name: outputs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE outputs_id_seq OWNED BY outputs.id;


--
-- TOC entry 228 (class 1259 OID 63662)
-- Name: product_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE product_details (
    id integer NOT NULL,
    product_id integer NOT NULL,
    company_id integer NOT NULL,
    price real DEFAULT 0 NOT NULL,
    cost real DEFAULT 0 NOT NULL,
    offer_price real DEFAULT 0 NOT NULL
);


ALTER TABLE public.product_details OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 63668)
-- Name: size; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE size (
    id integer NOT NULL,
    description character varying(15) NOT NULL,
    code character varying(5),
    active boolean DEFAULT true
);


ALTER TABLE public.size OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 63672)
-- Name: product_sizes; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW product_sizes AS
 SELECT DISTINCT product_details.product_id,
    product_barcodes.size_id,
    size.code,
    size.description
   FROM ((product_barcodes
     JOIN product_details ON ((product_barcodes.product_detail_id = product_details.id)))
     JOIN size ON ((product_barcodes.size_id = size.id)))
  WHERE (size.active = true);


ALTER TABLE public.product_sizes OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 63676)
-- Name: product_values_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE product_values_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.product_values_id_seq OWNER TO postgres;

--
-- TOC entry 2719 (class 0 OID 0)
-- Dependencies: 231
-- Name: product_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE product_values_id_seq OWNED BY product_details.id;


--
-- TOC entry 232 (class 1259 OID 63678)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE products (
    id integer NOT NULL,
    description character varying(60),
    brand_id integer,
    subcategory_id integer,
    category_id integer,
    uses_id integer,
    ages_id integer,
    measurement_id integer,
    currency_id integer,
    currency_cost integer,
    code character varying(20),
    description2 character varying(220),
    cost double precision,
    replenishment_cost double precision,
    last_input timestamp without time zone,
    last_output timestamp without time zone,
    profit_margin double precision,
    min_profit_margin double precision,
    consignment boolean,
    comments character varying(220),
    image character varying(255),
    price real DEFAULT 0.00 NOT NULL,
    active boolean DEFAULT true,
    regime regime_type DEFAULT 'General'::regime_type NOT NULL,
    output_statement character varying(20),
    gender_id integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 63687)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 2720 (class 0 OID 0)
-- Dependencies: 233
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE products_id_seq OWNED BY products.id;


--
-- TOC entry 234 (class 1259 OID 63689)
-- Name: purchase_order_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE purchase_order_details (
    id integer NOT NULL,
    product_id integer,
    purchase_order_id integer,
    sales_intro date,
    quantity integer
);


ALTER TABLE public.purchase_order_details OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 63692)
-- Name: purchase_order_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE purchase_order_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchase_order_details_id_seq OWNER TO postgres;

--
-- TOC entry 2721 (class 0 OID 0)
-- Dependencies: 235
-- Name: purchase_order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE purchase_order_details_id_seq OWNED BY purchase_order_details.id;


--
-- TOC entry 236 (class 1259 OID 63694)
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE purchase_orders (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    description character varying(100),
    start_date date,
    finish_date date,
    paid_date date,
    supplier_id integer,
    active boolean DEFAULT true,
    approved_state approved_state_type DEFAULT 'PENDIENTE'::approved_state_type NOT NULL,
    rejected_by integer,
    accounting_user_id integer,
    logistic_user_id integer
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 63699)
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE purchase_orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchase_orders_id_seq OWNER TO postgres;

--
-- TOC entry 2722 (class 0 OID 0)
-- Dependencies: 237
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE purchase_orders_id_seq OWNED BY purchase_orders.id;


--
-- TOC entry 238 (class 1259 OID 63701)
-- Name: purchases; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE purchases (
    id integer NOT NULL,
    description character varying(80),
    input_date timestamp without time zone,
    amount real,
    igv real,
    company_id integer,
    supplier_id integer,
    approved_state approved_state_type DEFAULT 'PENDIENTE'::approved_state_type NOT NULL,
    rejected_by integer,
    accounting_user_id integer,
    logistic_user_id integer
);


ALTER TABLE public.purchases OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 63705)
-- Name: purchases_detail; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE purchases_detail (
    id integer NOT NULL,
    purchase_id integer NOT NULL,
    product_barcode_id integer NOT NULL,
    cost real,
    price real
);


ALTER TABLE public.purchases_detail OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 63708)
-- Name: purchases_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE purchases_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchases_detail_id_seq OWNER TO postgres;

--
-- TOC entry 2723 (class 0 OID 0)
-- Dependencies: 240
-- Name: purchases_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE purchases_detail_id_seq OWNED BY purchases_detail.id;


--
-- TOC entry 241 (class 1259 OID 63710)
-- Name: purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE purchases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.purchases_id_seq OWNER TO postgres;

--
-- TOC entry 2724 (class 0 OID 0)
-- Dependencies: 241
-- Name: purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE purchases_id_seq OWNED BY purchases.id;


--
-- TOC entry 242 (class 1259 OID 63712)
-- Name: regime; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE regime (
    id integer NOT NULL,
    regime regime_type NOT NULL,
    tax real NOT NULL
);


ALTER TABLE public.regime OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 63715)
-- Name: regime_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE regime_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.regime_id_seq OWNER TO postgres;

--
-- TOC entry 2725 (class 0 OID 0)
-- Dependencies: 243
-- Name: regime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE regime_id_seq OWNED BY regime.id;


--
-- TOC entry 244 (class 1259 OID 63717)
-- Name: rewards; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE rewards (
    id integer NOT NULL,
    description character varying(25),
    abbrev character varying(10),
    earn_points integer NOT NULL,
    min_points integer,
    points_to_voucher integer NOT NULL,
    voucher_amount real NOT NULL,
    voucher_birthday real,
    company_id integer,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.rewards OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 63721)
-- Name: rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE rewards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rewards_id_seq OWNER TO postgres;

--
-- TOC entry 2726 (class 0 OID 0)
-- Dependencies: 245
-- Name: rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE rewards_id_seq OWNED BY rewards.id;


--
-- TOC entry 246 (class 1259 OID 63723)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE roles (
    id integer NOT NULL,
    description character varying(50),
    all_branches_granted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 63727)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 2727 (class 0 OID 0)
-- Dependencies: 247
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE roles_id_seq OWNED BY roles.id;


--
-- TOC entry 248 (class 1259 OID 63729)
-- Name: sale_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sale_details (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    quantity integer NOT NULL,
    subtotal real,
    price real,
    product_barcode_id integer,
    cost real DEFAULT 0 NOT NULL,
    utility real DEFAULT 0 NOT NULL
);


ALTER TABLE public.sale_details OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 63734)
-- Name: sale_details_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sale_details_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sale_details_id_seq OWNER TO postgres;

--
-- TOC entry 2728 (class 0 OID 0)
-- Dependencies: 249
-- Name: sale_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sale_details_id_seq OWNED BY sale_details.id;


--
-- TOC entry 250 (class 1259 OID 63736)
-- Name: sale_points; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sale_points (
    id integer NOT NULL,
    description character varying(50) DEFAULT ''::character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    initial_amount real,
    cash_amount real
);


ALTER TABLE public.sale_points OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 63741)
-- Name: sale_points_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sale_points_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sale_points_id_seq OWNER TO postgres;

--
-- TOC entry 2729 (class 0 OID 0)
-- Dependencies: 251
-- Name: sale_points_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sale_points_id_seq OWNED BY sale_points.id;


--
-- TOC entry 252 (class 1259 OID 63743)
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sales (
    id integer NOT NULL,
    salesman_id integer,
    cashier_id integer,
    customer_id integer,
    coupon_id integer,
    sale_date timestamp without time zone DEFAULT now() NOT NULL,
    igv real,
    total_amount real,
    state state_type DEFAULT 'DRAFT'::state_type NOT NULL,
    active boolean DEFAULT true,
    voucher voucher_type NOT NULL,
    regime regime_type,
    serie integer,
    serial_number integer,
    refund_origin_id integer,
    refund_target_id integer,
    sale_point_id integer DEFAULT 1,
    cash_amount real DEFAULT 0 NOT NULL,
    credit_card_amount real DEFAULT 0 NOT NULL,
    branch_id integer,
    total_cash_amount real DEFAULT 0 NOT NULL,
    company_id integer
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 63753)
-- Name: sales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE sales_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sales_id_seq OWNER TO postgres;

--
-- TOC entry 2730 (class 0 OID 0)
-- Dependencies: 253
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sales_id_seq OWNED BY sales.id;


--
-- TOC entry 254 (class 1259 OID 63755)
-- Name: series; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE series (
    id integer NOT NULL,
    serie integer,
    serial_number integer,
    voucher voucher_type NOT NULL,
    subsidiary_journal character varying(2),
    branch_detail_id integer,
    sale_point_id integer
);


ALTER TABLE public.series OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 63758)
-- Name: ticket_printers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE ticket_printers (
    id integer NOT NULL,
    printer_serial character varying(15),
    printer_name character varying(255),
    serie_id integer NOT NULL
);


ALTER TABLE public.ticket_printers OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 63761)
-- Name: serie_printers; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW serie_printers AS
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
   FROM (((series
     JOIN sale_points ON ((series.sale_point_id = sale_points.id)))
     JOIN branch_details ON ((series.branch_detail_id = branch_details.id)))
     JOIN ticket_printers ON ((series.id = ticket_printers.serie_id)));


ALTER TABLE public.serie_printers OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 63766)
-- Name: series_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE series_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.series_id_seq OWNER TO postgres;

--
-- TOC entry 2731 (class 0 OID 0)
-- Dependencies: 257
-- Name: series_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE series_id_seq OWNED BY series.id;


--
-- TOC entry 258 (class 1259 OID 63768)
-- Name: shuttle_reasons; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE shuttle_reasons (
    id integer NOT NULL,
    description character varying(70)
);


ALTER TABLE public.shuttle_reasons OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 63771)
-- Name: shuttle_reasons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE shuttle_reasons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shuttle_reasons_id_seq OWNER TO postgres;

--
-- TOC entry 2732 (class 0 OID 0)
-- Dependencies: 259
-- Name: shuttle_reasons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE shuttle_reasons_id_seq OWNED BY shuttle_reasons.id;


--
-- TOC entry 260 (class 1259 OID 63773)
-- Name: size_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE size_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.size_id_seq OWNER TO postgres;

--
-- TOC entry 2733 (class 0 OID 0)
-- Dependencies: 260
-- Name: size_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE size_id_seq OWNED BY size.id;


--
-- TOC entry 261 (class 1259 OID 63775)
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE stock (
    id integer NOT NULL,
    branch_id integer NOT NULL,
    product_barcode_id integer NOT NULL,
    store_stock integer DEFAULT 0 NOT NULL,
    depot_stock integer DEFAULT 0 NOT NULL,
    first_entry timestamp without time zone,
    last_entry timestamp without time zone,
    last_sale timestamp without time zone
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 63780)
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE stock_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.stock_id_seq OWNER TO postgres;

--
-- TOC entry 2734 (class 0 OID 0)
-- Dependencies: 262
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE stock_id_seq OWNED BY stock.id;


--
-- TOC entry 263 (class 1259 OID 63782)
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE subcategories (
    id integer NOT NULL,
    description character varying(60) NOT NULL,
    category_id integer,
    image character varying(255),
    active boolean DEFAULT true
);


ALTER TABLE public.subcategories OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 63786)
-- Name: subcategories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE subcategories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subcategories_id_seq OWNER TO postgres;

--
-- TOC entry 2735 (class 0 OID 0)
-- Dependencies: 264
-- Name: subcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE subcategories_id_seq OWNED BY subcategories.id;


--
-- TOC entry 265 (class 1259 OID 63788)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE suppliers (
    id integer NOT NULL,
    id_number character varying(13) NOT NULL,
    name character varying(80) NOT NULL,
    phone_number character varying(13),
    phone_number2 character varying(13),
    address character varying(250)
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 63791)
-- Name: supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE supplier_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.supplier_id_seq OWNER TO postgres;

--
-- TOC entry 2736 (class 0 OID 0)
-- Dependencies: 266
-- Name: supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE supplier_id_seq OWNED BY suppliers.id;


--
-- TOC entry 267 (class 1259 OID 63793)
-- Name: ticket_printers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE ticket_printers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.ticket_printers_id_seq OWNER TO postgres;

--
-- TOC entry 2737 (class 0 OID 0)
-- Dependencies: 267
-- Name: ticket_printers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE ticket_printers_id_seq OWNED BY ticket_printers.id;


--
-- TOC entry 268 (class 1259 OID 63795)
-- Name: type_credit_cards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE type_credit_cards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.type_credit_cards_id_seq OWNER TO postgres;

--
-- TOC entry 2738 (class 0 OID 0)
-- Dependencies: 268
-- Name: type_credit_cards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE type_credit_cards_id_seq OWNED BY credit_card_types.id;


--
-- TOC entry 269 (class 1259 OID 63797)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    username character varying(50) NOT NULL,
    role_id integer,
    avatar_mode integer,
    avatar character varying(255),
    company_id integer,
    active boolean DEFAULT true,
    branch_id integer,
    default_branch_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 63801)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2739 (class 0 OID 0)
-- Dependencies: 270
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 271 (class 1259 OID 63803)
-- Name: uses; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE uses (
    id integer NOT NULL,
    description character varying(90),
    active boolean DEFAULT true
);


ALTER TABLE public.uses OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 63807)
-- Name: uses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE uses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.uses_id_seq OWNER TO postgres;

--
-- TOC entry 2740 (class 0 OID 0)
-- Dependencies: 272
-- Name: uses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE uses_id_seq OWNED BY uses.id;


--
-- TOC entry 273 (class 1259 OID 63809)
-- Name: v_series; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW v_series AS
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
    sp.description AS sale_point_name
   FROM ((((series s
     JOIN branch_details bd ON ((s.branch_detail_id = bd.id)))
     JOIN branches b ON ((bd.branch_id = b.id)))
     JOIN companies c ON ((bd.company_id = c.id)))
     LEFT JOIN sale_points sp ON ((s.sale_point_id = sp.id)));


ALTER TABLE public.v_series OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 63814)
-- Name: vouchers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE vouchers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.vouchers_id_seq OWNER TO postgres;

--
-- TOC entry 2741 (class 0 OID 0)
-- Dependencies: 274
-- Name: vouchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE vouchers_id_seq OWNED BY coupons.id;


--
-- TOC entry 2167 (class 2604 OID 63816)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY access_control ALTER COLUMN id SET DEFAULT nextval('access_control_id_seq'::regclass);


--
-- TOC entry 2168 (class 2604 OID 63817)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY actions ALTER COLUMN id SET DEFAULT nextval('actions_id_seq'::regclass);


--
-- TOC entry 2170 (class 2604 OID 63818)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ages ALTER COLUMN id SET DEFAULT nextval('ages_id_seq'::regclass);


--
-- TOC entry 2172 (class 2604 OID 63819)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY banks ALTER COLUMN id SET DEFAULT nextval('banks_id_seq'::regclass);


--
-- TOC entry 2174 (class 2604 OID 63820)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY branch_details ALTER COLUMN id SET DEFAULT nextval('branch_details_id_seq'::regclass);


--
-- TOC entry 2176 (class 2604 OID 63821)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY branches ALTER COLUMN id SET DEFAULT nextval('branches_id_seq'::regclass);


--
-- TOC entry 2178 (class 2604 OID 63822)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY brands ALTER COLUMN id SET DEFAULT nextval('brands_id_seq'::regclass);


--
-- TOC entry 2182 (class 2604 OID 63823)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY campaings ALTER COLUMN id SET DEFAULT nextval('campaings_id_seq'::regclass);


--
-- TOC entry 2184 (class 2604 OID 63824)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- TOC entry 2192 (class 2604 OID 63825)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY companies ALTER COLUMN id SET DEFAULT nextval('companies_id_seq'::regclass);


--
-- TOC entry 2195 (class 2604 OID 63826)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY coupons ALTER COLUMN id SET DEFAULT nextval('vouchers_id_seq'::regclass);


--
-- TOC entry 2197 (class 2604 OID 63827)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY credit_card_types ALTER COLUMN id SET DEFAULT nextval('type_credit_cards_id_seq'::regclass);


--
-- TOC entry 2198 (class 2604 OID 63828)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY credit_cards ALTER COLUMN id SET DEFAULT nextval('credit_cards_id_seq'::regclass);


--
-- TOC entry 2201 (class 2604 OID 63829)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY currencies ALTER COLUMN id SET DEFAULT nextval('currencies_id_seq'::regclass);


--
-- TOC entry 2205 (class 2604 OID 63830)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customers ALTER COLUMN id SET DEFAULT nextval('customers_id_seq'::regclass);


--
-- TOC entry 2209 (class 2604 OID 63831)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY employees ALTER COLUMN id SET DEFAULT nextval('employees_id_seq'::regclass);


--
-- TOC entry 2213 (class 2604 OID 63832)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY exchange_rates ALTER COLUMN id SET DEFAULT nextval('exchange_rates_id_seq'::regclass);


--
-- TOC entry 2215 (class 2604 OID 63833)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY genders ALTER COLUMN id SET DEFAULT nextval('genders_id_seq'::regclass);


--
-- TOC entry 2217 (class 2604 OID 63834)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY inputs ALTER COLUMN id SET DEFAULT nextval('inputs_id_seq'::regclass);


--
-- TOC entry 2218 (class 2604 OID 63835)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY inputs_details ALTER COLUMN id SET DEFAULT nextval('inputs_details_id_seq'::regclass);


--
-- TOC entry 2221 (class 2604 OID 63836)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY invoices ALTER COLUMN id SET DEFAULT nextval('invoices_id_seq'::regclass);


--
-- TOC entry 2223 (class 2604 OID 63837)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY measurements ALTER COLUMN id SET DEFAULT nextval('measurements_id_seq'::regclass);


--
-- TOC entry 2224 (class 2604 OID 63838)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY modules ALTER COLUMN id SET DEFAULT nextval('modules_id_seq'::regclass);


--
-- TOC entry 2226 (class 2604 OID 63839)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offer_details ALTER COLUMN id SET DEFAULT nextval('offer_details_id_seq'::regclass);


--
-- TOC entry 2228 (class 2604 OID 63840)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offer_places ALTER COLUMN id SET DEFAULT nextval('offer_places_id_seq'::regclass);


--
-- TOC entry 2233 (class 2604 OID 63841)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offers ALTER COLUMN id SET DEFAULT nextval('offers_id_seq'::regclass);


--
-- TOC entry 2235 (class 2604 OID 63842)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY outputs ALTER COLUMN id SET DEFAULT nextval('outputs_id_seq'::regclass);


--
-- TOC entry 2236 (class 2604 OID 63843)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY outputs_details ALTER COLUMN id SET DEFAULT nextval('outputs_details_id_seq'::regclass);


--
-- TOC entry 2173 (class 2604 OID 63844)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_barcodes ALTER COLUMN id SET DEFAULT nextval('barcodes_id_seq'::regclass);


--
-- TOC entry 2240 (class 2604 OID 63845)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_details ALTER COLUMN id SET DEFAULT nextval('product_values_id_seq'::regclass);


--
-- TOC entry 2246 (class 2604 OID 63846)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products ALTER COLUMN id SET DEFAULT nextval('products_id_seq'::regclass);


--
-- TOC entry 2247 (class 2604 OID 63847)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_order_details ALTER COLUMN id SET DEFAULT nextval('purchase_order_details_id_seq'::regclass);


--
-- TOC entry 2250 (class 2604 OID 63848)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_orders ALTER COLUMN id SET DEFAULT nextval('purchase_orders_id_seq'::regclass);


--
-- TOC entry 2252 (class 2604 OID 63849)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases ALTER COLUMN id SET DEFAULT nextval('purchases_id_seq'::regclass);


--
-- TOC entry 2253 (class 2604 OID 63850)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases_detail ALTER COLUMN id SET DEFAULT nextval('purchases_detail_id_seq'::regclass);


--
-- TOC entry 2254 (class 2604 OID 63851)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY regime ALTER COLUMN id SET DEFAULT nextval('regime_id_seq'::regclass);


--
-- TOC entry 2256 (class 2604 OID 63852)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY rewards ALTER COLUMN id SET DEFAULT nextval('rewards_id_seq'::regclass);


--
-- TOC entry 2258 (class 2604 OID 63853)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);


--
-- TOC entry 2261 (class 2604 OID 63854)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sale_details ALTER COLUMN id SET DEFAULT nextval('sale_details_id_seq'::regclass);


--
-- TOC entry 2264 (class 2604 OID 63855)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sale_points ALTER COLUMN id SET DEFAULT nextval('sale_points_id_seq'::regclass);


--
-- TOC entry 2272 (class 2604 OID 63856)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales ALTER COLUMN id SET DEFAULT nextval('sales_id_seq'::regclass);


--
-- TOC entry 2273 (class 2604 OID 63857)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY series ALTER COLUMN id SET DEFAULT nextval('series_id_seq'::regclass);


--
-- TOC entry 2275 (class 2604 OID 63858)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY shuttle_reasons ALTER COLUMN id SET DEFAULT nextval('shuttle_reasons_id_seq'::regclass);


--
-- TOC entry 2242 (class 2604 OID 63859)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY size ALTER COLUMN id SET DEFAULT nextval('size_id_seq'::regclass);


--
-- TOC entry 2278 (class 2604 OID 63860)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock ALTER COLUMN id SET DEFAULT nextval('stock_id_seq'::regclass);


--
-- TOC entry 2280 (class 2604 OID 63861)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY subcategories ALTER COLUMN id SET DEFAULT nextval('subcategories_id_seq'::regclass);


--
-- TOC entry 2281 (class 2604 OID 63862)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY suppliers ALTER COLUMN id SET DEFAULT nextval('supplier_id_seq'::regclass);


--
-- TOC entry 2274 (class 2604 OID 63863)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ticket_printers ALTER COLUMN id SET DEFAULT nextval('ticket_printers_id_seq'::regclass);


--
-- TOC entry 2283 (class 2604 OID 63864)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2285 (class 2604 OID 63865)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY uses ALTER COLUMN id SET DEFAULT nextval('uses_id_seq'::regclass);


--
-- TOC entry 2583 (class 0 OID 63463)
-- Dependencies: 170
-- Data for Name: access_control; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2742 (class 0 OID 0)
-- Dependencies: 171
-- Name: access_control_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('access_control_id_seq', 1, false);


--
-- TOC entry 2585 (class 0 OID 63468)
-- Dependencies: 172
-- Data for Name: actions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO actions VALUES (1, 'view');
INSERT INTO actions VALUES (2, 'add');
INSERT INTO actions VALUES (3, 'edit');
INSERT INTO actions VALUES (4, 'remove');
INSERT INTO actions VALUES (5, 'delete');


--
-- TOC entry 2743 (class 0 OID 0)
-- Dependencies: 173
-- Name: actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('actions_id_seq', 5, true);


--
-- TOC entry 2587 (class 0 OID 63473)
-- Dependencies: 174
-- Data for Name: ages; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2744 (class 0 OID 0)
-- Dependencies: 175
-- Name: ages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('ages_id_seq', 1, false);


--
-- TOC entry 2589 (class 0 OID 63479)
-- Dependencies: 176
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2745 (class 0 OID 0)
-- Dependencies: 177
-- Name: banks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('banks_id_seq', 1, false);


--
-- TOC entry 2746 (class 0 OID 0)
-- Dependencies: 179
-- Name: barcodes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('barcodes_id_seq', 1, false);


--
-- TOC entry 2593 (class 0 OID 63490)
-- Dependencies: 180
-- Data for Name: branch_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO branch_details VALUES (1, 1, 1);
INSERT INTO branch_details VALUES (2, 1, 2);
INSERT INTO branch_details VALUES (3, 2, 1);
INSERT INTO branch_details VALUES (4, 2, 2);


--
-- TOC entry 2747 (class 0 OID 0)
-- Dependencies: 181
-- Name: branch_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('branch_details_id_seq', 4, true);


--
-- TOC entry 2595 (class 0 OID 63495)
-- Dependencies: 182
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO branches VALUES (2, 2, 'PJ. Vigil N 53', 'Vigil', true, 'TACNA', 'TACNA', 'TACNA');
INSERT INTO branches VALUES (1, 1, 'AV. LEGUIA N 1690', 'Leguia', true, 'TACNA', 'TACNA', 'TACNA');


--
-- TOC entry 2748 (class 0 OID 0)
-- Dependencies: 183
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('branches_id_seq', 2, true);


--
-- TOC entry 2597 (class 0 OID 63504)
-- Dependencies: 184
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2749 (class 0 OID 0)
-- Dependencies: 185
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('brands_id_seq', 1, false);


--
-- TOC entry 2599 (class 0 OID 63510)
-- Dependencies: 186
-- Data for Name: campaings; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2750 (class 0 OID 0)
-- Dependencies: 187
-- Name: campaings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('campaings_id_seq', 1, false);


--
-- TOC entry 2601 (class 0 OID 63518)
-- Dependencies: 188
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2751 (class 0 OID 0)
-- Dependencies: 189
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('categories_id_seq', 1, false);


--
-- TOC entry 2603 (class 0 OID 63524)
-- Dependencies: 190
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO companies VALUES (1, 'LFA', true, 'LFA TACNA EIRL', 'Pje. Vigil Nro 53', 'TACNA', 'TACNA', 'TACNA', '20532437548');
INSERT INTO companies VALUES (2, 'Gafco', true, 'GAFCO SAC', 'Av. Coronel Mendonza N° 1880', 'TACNA', 'TACNA', 'TACNA', '20302573086');


--
-- TOC entry 2752 (class 0 OID 0)
-- Dependencies: 191
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('companies_id_seq', 2, true);


--
-- TOC entry 2605 (class 0 OID 63539)
-- Dependencies: 192
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2606 (class 0 OID 63544)
-- Dependencies: 193
-- Data for Name: credit_card_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO credit_card_types VALUES (1, 'Visa', 'VIS', true);
INSERT INTO credit_card_types VALUES (2, 'Master Card', 'MTC', true);
INSERT INTO credit_card_types VALUES (3, 'American Express', 'A.EXPRESS', true);


--
-- TOC entry 2607 (class 0 OID 63548)
-- Dependencies: 194
-- Data for Name: credit_cards; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2753 (class 0 OID 0)
-- Dependencies: 195
-- Name: credit_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('credit_cards_id_seq', 1, false);


--
-- TOC entry 2609 (class 0 OID 63553)
-- Dependencies: 196
-- Data for Name: currencies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO currencies VALUES (2, 'Dólares', true, 2.93199992);
INSERT INTO currencies VALUES (1, 'Soles', true, 1);


--
-- TOC entry 2754 (class 0 OID 0)
-- Dependencies: 197
-- Name: currencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('currencies_id_seq', 1, false);


--
-- TOC entry 2611 (class 0 OID 63560)
-- Dependencies: 198
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2755 (class 0 OID 0)
-- Dependencies: 201
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('customers_id_seq', 1, false);


--
-- TOC entry 2613 (class 0 OID 63579)
-- Dependencies: 202
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2756 (class 0 OID 0)
-- Dependencies: 203
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('employees_id_seq', 1, false);


--
-- TOC entry 2615 (class 0 OID 63587)
-- Dependencies: 204
-- Data for Name: exchange_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO exchange_rates VALUES (1, '2015-11-16 17:55:17.855', 3.31999993, 3.32299995, 'USD', 1);
INSERT INTO exchange_rates VALUES (2, '2015-11-16 17:55:17.855', 4.71000004, 4.71899986, 'CLP', 1000);


--
-- TOC entry 2757 (class 0 OID 0)
-- Dependencies: 205
-- Name: exchange_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('exchange_rates_id_seq', 2, true);


--
-- TOC entry 2617 (class 0 OID 63595)
-- Dependencies: 206
-- Data for Name: genders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2758 (class 0 OID 0)
-- Dependencies: 207
-- Name: genders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('genders_id_seq', 1, false);


--
-- TOC entry 2619 (class 0 OID 63601)
-- Dependencies: 208
-- Data for Name: inputs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2620 (class 0 OID 63605)
-- Dependencies: 209
-- Data for Name: inputs_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2759 (class 0 OID 0)
-- Dependencies: 210
-- Name: inputs_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('inputs_details_id_seq', 1, false);


--
-- TOC entry 2760 (class 0 OID 0)
-- Dependencies: 211
-- Name: inputs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('inputs_id_seq', 1, false);


--
-- TOC entry 2623 (class 0 OID 63612)
-- Dependencies: 212
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2761 (class 0 OID 0)
-- Dependencies: 213
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('invoices_id_seq', 1, false);


--
-- TOC entry 2625 (class 0 OID 63619)
-- Dependencies: 214
-- Data for Name: measurements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO measurements VALUES (1, 'P', 'Par', true);
INSERT INTO measurements VALUES (2, 'UNID', 'Unidad', true);
INSERT INTO measurements VALUES (3, 'C/U', 'Cada Una', true);


--
-- TOC entry 2762 (class 0 OID 0)
-- Dependencies: 215
-- Name: measurements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('measurements_id_seq', 3, true);


--
-- TOC entry 2627 (class 0 OID 63625)
-- Dependencies: 216
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2763 (class 0 OID 0)
-- Dependencies: 217
-- Name: modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('modules_id_seq', 1, false);


--
-- TOC entry 2629 (class 0 OID 63630)
-- Dependencies: 218
-- Data for Name: offer_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2764 (class 0 OID 0)
-- Dependencies: 219
-- Name: offer_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('offer_details_id_seq', 1, false);


--
-- TOC entry 2631 (class 0 OID 63636)
-- Dependencies: 220
-- Data for Name: offer_places; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2765 (class 0 OID 0)
-- Dependencies: 221
-- Name: offer_places_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('offer_places_id_seq', 1, false);


--
-- TOC entry 2633 (class 0 OID 63642)
-- Dependencies: 222
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2766 (class 0 OID 0)
-- Dependencies: 223
-- Name: offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('offers_id_seq', 1, false);


--
-- TOC entry 2635 (class 0 OID 63651)
-- Dependencies: 224
-- Data for Name: outputs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2636 (class 0 OID 63655)
-- Dependencies: 225
-- Data for Name: outputs_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2767 (class 0 OID 0)
-- Dependencies: 226
-- Name: outputs_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('outputs_details_id_seq', 1, false);


--
-- TOC entry 2768 (class 0 OID 0)
-- Dependencies: 227
-- Name: outputs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('outputs_id_seq', 1, false);


--
-- TOC entry 2591 (class 0 OID 63485)
-- Dependencies: 178
-- Data for Name: product_barcodes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2639 (class 0 OID 63662)
-- Dependencies: 228
-- Data for Name: product_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2769 (class 0 OID 0)
-- Dependencies: 231
-- Name: product_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('product_values_id_seq', 1, false);


--
-- TOC entry 2642 (class 0 OID 63678)
-- Dependencies: 232
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2770 (class 0 OID 0)
-- Dependencies: 233
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('products_id_seq', 1, false);


--
-- TOC entry 2644 (class 0 OID 63689)
-- Dependencies: 234
-- Data for Name: purchase_order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2771 (class 0 OID 0)
-- Dependencies: 235
-- Name: purchase_order_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('purchase_order_details_id_seq', 1, false);


--
-- TOC entry 2646 (class 0 OID 63694)
-- Dependencies: 236
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2772 (class 0 OID 0)
-- Dependencies: 237
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('purchase_orders_id_seq', 1, false);


--
-- TOC entry 2648 (class 0 OID 63701)
-- Dependencies: 238
-- Data for Name: purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2649 (class 0 OID 63705)
-- Dependencies: 239
-- Data for Name: purchases_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2773 (class 0 OID 0)
-- Dependencies: 240
-- Name: purchases_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('purchases_detail_id_seq', 1, false);


--
-- TOC entry 2774 (class 0 OID 0)
-- Dependencies: 241
-- Name: purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('purchases_id_seq', 1, false);


--
-- TOC entry 2652 (class 0 OID 63712)
-- Dependencies: 242
-- Data for Name: regime; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO regime VALUES (2, 'ZOFRA', 0);
INSERT INTO regime VALUES (1, 'General', 0.180000007);


--
-- TOC entry 2775 (class 0 OID 0)
-- Dependencies: 243
-- Name: regime_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('regime_id_seq', 2, true);


--
-- TOC entry 2654 (class 0 OID 63717)
-- Dependencies: 244
-- Data for Name: rewards; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2776 (class 0 OID 0)
-- Dependencies: 245
-- Name: rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('rewards_id_seq', 1, false);


--
-- TOC entry 2656 (class 0 OID 63723)
-- Dependencies: 246
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO roles VALUES (2, 'Operador de Ventas', false);
INSERT INTO roles VALUES (1, 'Administrador', true);
INSERT INTO roles VALUES (3, 'Operador de Compras', false);
INSERT INTO roles VALUES (4, 'Contabilidad', false);


--
-- TOC entry 2777 (class 0 OID 0)
-- Dependencies: 247
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('roles_id_seq', 4, true);


--
-- TOC entry 2658 (class 0 OID 63729)
-- Dependencies: 248
-- Data for Name: sale_details; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2778 (class 0 OID 0)
-- Dependencies: 249
-- Name: sale_details_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('sale_details_id_seq', 1, false);


--
-- TOC entry 2660 (class 0 OID 63736)
-- Dependencies: 250
-- Data for Name: sale_points; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2779 (class 0 OID 0)
-- Dependencies: 251
-- Name: sale_points_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('sale_points_id_seq', 1, false);


--
-- TOC entry 2662 (class 0 OID 63743)
-- Dependencies: 252
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2780 (class 0 OID 0)
-- Dependencies: 253
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('sales_id_seq', 1, false);


--
-- TOC entry 2664 (class 0 OID 63755)
-- Dependencies: 254
-- Data for Name: series; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2781 (class 0 OID 0)
-- Dependencies: 257
-- Name: series_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('series_id_seq', 1, false);


--
-- TOC entry 2667 (class 0 OID 63768)
-- Dependencies: 258
-- Data for Name: shuttle_reasons; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO shuttle_reasons VALUES (1, 'Venta');
INSERT INTO shuttle_reasons VALUES (2, 'Venta sujeta a confirmacion por el comprador');
INSERT INTO shuttle_reasons VALUES (3, 'Recojo de bienes');
INSERT INTO shuttle_reasons VALUES (4, 'Traslado zona primaria');
INSERT INTO shuttle_reasons VALUES (5, 'Compra');
INSERT INTO shuttle_reasons VALUES (6, 'Traslado entre establecimientos de la misma empresa');
INSERT INTO shuttle_reasons VALUES (7, 'Importación');
INSERT INTO shuttle_reasons VALUES (8, 'Traslado por emisor itinerante');
INSERT INTO shuttle_reasons VALUES (9, 'Consignación');
INSERT INTO shuttle_reasons VALUES (10, 'Devolución');
INSERT INTO shuttle_reasons VALUES (11, 'Exportación');
INSERT INTO shuttle_reasons VALUES (12, 'Traslado de bienes para transformación');
INSERT INTO shuttle_reasons VALUES (13, 'Venta con entrega a terceros');
INSERT INTO shuttle_reasons VALUES (14, 'Otros');


--
-- TOC entry 2782 (class 0 OID 0)
-- Dependencies: 259
-- Name: shuttle_reasons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('shuttle_reasons_id_seq', 14, true);


--
-- TOC entry 2640 (class 0 OID 63668)
-- Dependencies: 229
-- Data for Name: size; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2783 (class 0 OID 0)
-- Dependencies: 260
-- Name: size_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('size_id_seq', 1, false);


--
-- TOC entry 2670 (class 0 OID 63775)
-- Dependencies: 261
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2784 (class 0 OID 0)
-- Dependencies: 262
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('stock_id_seq', 1, false);


--
-- TOC entry 2672 (class 0 OID 63782)
-- Dependencies: 263
-- Data for Name: subcategories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2785 (class 0 OID 0)
-- Dependencies: 264
-- Name: subcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('subcategories_id_seq', 1, false);


--
-- TOC entry 2786 (class 0 OID 0)
-- Dependencies: 266
-- Name: supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('supplier_id_seq', 1, false);


--
-- TOC entry 2674 (class 0 OID 63788)
-- Dependencies: 265
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2665 (class 0 OID 63758)
-- Dependencies: 255
-- Data for Name: ticket_printers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2787 (class 0 OID 0)
-- Dependencies: 267
-- Name: ticket_printers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('ticket_printers_id_seq', 1, false);


--
-- TOC entry 2788 (class 0 OID 0)
-- Dependencies: 268
-- Name: type_credit_cards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('type_credit_cards_id_seq', 3, true);


--
-- TOC entry 2678 (class 0 OID 63797)
-- Dependencies: 269
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2789 (class 0 OID 0)
-- Dependencies: 270
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('users_id_seq', 1, false);


--
-- TOC entry 2680 (class 0 OID 63803)
-- Dependencies: 271
-- Data for Name: uses; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2790 (class 0 OID 0)
-- Dependencies: 272
-- Name: uses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('uses_id_seq', 1, false);


--
-- TOC entry 2791 (class 0 OID 0)
-- Dependencies: 274
-- Name: vouchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('vouchers_id_seq', 1, false);


--
-- TOC entry 2287 (class 2606 OID 63867)
-- Name: PK_access_control_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY access_control
    ADD CONSTRAINT "PK_access_control_id" PRIMARY KEY (id);


--
-- TOC entry 2289 (class 2606 OID 63869)
-- Name: PK_actions_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY actions
    ADD CONSTRAINT "PK_actions_id" PRIMARY KEY (id);


--
-- TOC entry 2291 (class 2606 OID 63871)
-- Name: PK_ages_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ages
    ADD CONSTRAINT "PK_ages_id" PRIMARY KEY (id);


--
-- TOC entry 2293 (class 2606 OID 63873)
-- Name: PK_banks_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY banks
    ADD CONSTRAINT "PK_banks_id" PRIMARY KEY (id);


--
-- TOC entry 2297 (class 2606 OID 63875)
-- Name: PK_branch_detail_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY branch_details
    ADD CONSTRAINT "PK_branch_detail_id" PRIMARY KEY (id);


--
-- TOC entry 2299 (class 2606 OID 63877)
-- Name: PK_branch_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY branches
    ADD CONSTRAINT "PK_branch_id" PRIMARY KEY (id);


--
-- TOC entry 2301 (class 2606 OID 63879)
-- Name: PK_brands_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY brands
    ADD CONSTRAINT "PK_brands_id" PRIMARY KEY (id);


--
-- TOC entry 2305 (class 2606 OID 63881)
-- Name: PK_categories_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT "PK_categories_id" PRIMARY KEY (id);


--
-- TOC entry 2307 (class 2606 OID 63883)
-- Name: PK_companies_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY companies
    ADD CONSTRAINT "PK_companies_id" PRIMARY KEY (id);


--
-- TOC entry 2313 (class 2606 OID 63885)
-- Name: PK_credit_cards_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY credit_cards
    ADD CONSTRAINT "PK_credit_cards_id" PRIMARY KEY (id);


--
-- TOC entry 2315 (class 2606 OID 63887)
-- Name: PK_currencies_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY currencies
    ADD CONSTRAINT "PK_currencies_id" PRIMARY KEY (id);


--
-- TOC entry 2317 (class 2606 OID 63889)
-- Name: PK_customers_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT "PK_customers_id" PRIMARY KEY (id);


--
-- TOC entry 2319 (class 2606 OID 63891)
-- Name: PK_employees_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY employees
    ADD CONSTRAINT "PK_employees_id" PRIMARY KEY (id);


--
-- TOC entry 2323 (class 2606 OID 63893)
-- Name: PK_genders_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY genders
    ADD CONSTRAINT "PK_genders_id" PRIMARY KEY (id);


--
-- TOC entry 2327 (class 2606 OID 63895)
-- Name: PK_inputs_details_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY inputs_details
    ADD CONSTRAINT "PK_inputs_details_id" PRIMARY KEY (id);


--
-- TOC entry 2325 (class 2606 OID 63897)
-- Name: PK_inputs_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY inputs
    ADD CONSTRAINT "PK_inputs_id" PRIMARY KEY (id);


--
-- TOC entry 2329 (class 2606 OID 63899)
-- Name: PK_invoices_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY invoices
    ADD CONSTRAINT "PK_invoices_id" PRIMARY KEY (id);


--
-- TOC entry 2331 (class 2606 OID 63901)
-- Name: PK_measurement_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY measurements
    ADD CONSTRAINT "PK_measurement_id" PRIMARY KEY (id);


--
-- TOC entry 2333 (class 2606 OID 63903)
-- Name: PK_modules_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY modules
    ADD CONSTRAINT "PK_modules_id" PRIMARY KEY (id);


--
-- TOC entry 2335 (class 2606 OID 63905)
-- Name: PK_offer_details_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY offer_details
    ADD CONSTRAINT "PK_offer_details_id" PRIMARY KEY (id);


--
-- TOC entry 2337 (class 2606 OID 63907)
-- Name: PK_offer_places_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY offer_places
    ADD CONSTRAINT "PK_offer_places_id" PRIMARY KEY (id);


--
-- TOC entry 2339 (class 2606 OID 63909)
-- Name: PK_offers_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY offers
    ADD CONSTRAINT "PK_offers_id" PRIMARY KEY (id);


--
-- TOC entry 2343 (class 2606 OID 63911)
-- Name: PK_outputs_details_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY outputs_details
    ADD CONSTRAINT "PK_outputs_details_id" PRIMARY KEY (id);


--
-- TOC entry 2341 (class 2606 OID 63913)
-- Name: PK_outputs_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY outputs
    ADD CONSTRAINT "PK_outputs_id" PRIMARY KEY (id);


--
-- TOC entry 2345 (class 2606 OID 63915)
-- Name: PK_product_value_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product_details
    ADD CONSTRAINT "PK_product_value_id" PRIMARY KEY (id);


--
-- TOC entry 2349 (class 2606 OID 63917)
-- Name: PK_products_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY products
    ADD CONSTRAINT "PK_products_id" PRIMARY KEY (id);


--
-- TOC entry 2359 (class 2606 OID 63919)
-- Name: PK_purchase_detail_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY purchases_detail
    ADD CONSTRAINT "PK_purchase_detail_id" PRIMARY KEY (id);


--
-- TOC entry 2357 (class 2606 OID 63921)
-- Name: PK_purchase_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT "PK_purchase_id" PRIMARY KEY (id);


--
-- TOC entry 2351 (class 2606 OID 63923)
-- Name: PK_purchase_order_details_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY purchase_order_details
    ADD CONSTRAINT "PK_purchase_order_details_id" PRIMARY KEY (id);


--
-- TOC entry 2353 (class 2606 OID 63925)
-- Name: PK_purchase_orders_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT "PK_purchase_orders_id" PRIMARY KEY (id);


--
-- TOC entry 2361 (class 2606 OID 63927)
-- Name: PK_regime_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY regime
    ADD CONSTRAINT "PK_regime_id" PRIMARY KEY (id);


--
-- TOC entry 2363 (class 2606 OID 63929)
-- Name: PK_rewards_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY rewards
    ADD CONSTRAINT "PK_rewards_id" PRIMARY KEY (id);


--
-- TOC entry 2365 (class 2606 OID 63931)
-- Name: PK_roles_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT "PK_roles_id" PRIMARY KEY (id);


--
-- TOC entry 2321 (class 2606 OID 63933)
-- Name: PK_sale_rate_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY exchange_rates
    ADD CONSTRAINT "PK_sale_rate_id" PRIMARY KEY (id);


--
-- TOC entry 2367 (class 2606 OID 63935)
-- Name: PK_sales_details_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sale_details
    ADD CONSTRAINT "PK_sales_details_id" PRIMARY KEY (id);


--
-- TOC entry 2371 (class 2606 OID 63937)
-- Name: PK_sales_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT "PK_sales_id" PRIMARY KEY (id);


--
-- TOC entry 2377 (class 2606 OID 63939)
-- Name: PK_shuttle_reasons_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY shuttle_reasons
    ADD CONSTRAINT "PK_shuttle_reasons_id" PRIMARY KEY (id);


--
-- TOC entry 2347 (class 2606 OID 63941)
-- Name: PK_size_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY size
    ADD CONSTRAINT "PK_size_id" PRIMARY KEY (id);


--
-- TOC entry 2379 (class 2606 OID 63943)
-- Name: PK_stock_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT "PK_stock_id" PRIMARY KEY (id);


--
-- TOC entry 2381 (class 2606 OID 63945)
-- Name: PK_subcategories_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY subcategories
    ADD CONSTRAINT "PK_subcategories_id" PRIMARY KEY (id);


--
-- TOC entry 2375 (class 2606 OID 63947)
-- Name: PK_ticket_printer_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ticket_printers
    ADD CONSTRAINT "PK_ticket_printer_id" PRIMARY KEY (id);


--
-- TOC entry 2311 (class 2606 OID 63949)
-- Name: PK_type_credit_cards_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY credit_card_types
    ADD CONSTRAINT "PK_type_credit_cards_id" PRIMARY KEY (id);


--
-- TOC entry 2385 (class 2606 OID 63951)
-- Name: PK_users_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT "PK_users_id" PRIMARY KEY (id);


--
-- TOC entry 2387 (class 2606 OID 63953)
-- Name: PK_uses_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY uses
    ADD CONSTRAINT "PK_uses_id" PRIMARY KEY (id);


--
-- TOC entry 2309 (class 2606 OID 63955)
-- Name: PK_vouchers_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY coupons
    ADD CONSTRAINT "PK_vouchers_id" PRIMARY KEY (id);


--
-- TOC entry 2295 (class 2606 OID 63957)
-- Name: pk_barcode_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY product_barcodes
    ADD CONSTRAINT pk_barcode_id PRIMARY KEY (id);


--
-- TOC entry 2303 (class 2606 OID 63959)
-- Name: pk_campaings_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY campaings
    ADD CONSTRAINT pk_campaings_id PRIMARY KEY (id);


--
-- TOC entry 2369 (class 2606 OID 63961)
-- Name: pk_sale_point_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sale_points
    ADD CONSTRAINT pk_sale_point_id PRIMARY KEY (id);


--
-- TOC entry 2373 (class 2606 OID 63963)
-- Name: pk_serie_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY series
    ADD CONSTRAINT pk_serie_id PRIMARY KEY (id);


--
-- TOC entry 2383 (class 2606 OID 63965)
-- Name: pk_supplier_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY suppliers
    ADD CONSTRAINT pk_supplier_id PRIMARY KEY (id);


--
-- TOC entry 2355 (class 2606 OID 63967)
-- Name: purchase_orders_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT purchase_orders_codigo_key UNIQUE (code);


--
-- TOC entry 2468 (class 2620 OID 63968)
-- Name: ai_cash_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER ai_cash_update AFTER INSERT ON sales FOR EACH ROW EXECUTE PROCEDURE on_new_sales();


--
-- TOC entry 2463 (class 2620 OID 63969)
-- Name: bi_barcodes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER bi_barcodes BEFORE INSERT ON product_barcodes FOR EACH ROW EXECUTE PROCEDURE on_change_barcodes();


--
-- TOC entry 2466 (class 2620 OID 63970)
-- Name: bi_sale_details; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER bi_sale_details BEFORE INSERT ON sale_details FOR EACH ROW EXECUTE PROCEDURE on_change_sale_details();


--
-- TOC entry 2469 (class 2620 OID 63971)
-- Name: bi_sales; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER bi_sales BEFORE INSERT ON sales FOR EACH ROW EXECUTE PROCEDURE on_change_sales();


--
-- TOC entry 2464 (class 2620 OID 63972)
-- Name: bu_barcodes; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER bu_barcodes BEFORE UPDATE ON product_barcodes FOR EACH ROW EXECUTE PROCEDURE on_change_barcodes();


--
-- TOC entry 2465 (class 2620 OID 63973)
-- Name: bu_exchange_rates; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER bu_exchange_rates BEFORE UPDATE ON exchange_rates FOR EACH ROW EXECUTE PROCEDURE on_change_exchange_rates();


--
-- TOC entry 2467 (class 2620 OID 63974)
-- Name: bu_sale_details; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER bu_sale_details BEFORE UPDATE ON sale_details FOR EACH ROW EXECUTE PROCEDURE on_change_sale_details();


--
-- TOC entry 2470 (class 2620 OID 63975)
-- Name: bu_sales; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER bu_sales BEFORE UPDATE ON sales FOR EACH ROW EXECUTE PROCEDURE on_change_sales();


--
-- TOC entry 2388 (class 2606 OID 63976)
-- Name: FK_access_control_action; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY access_control
    ADD CONSTRAINT "FK_access_control_action" FOREIGN KEY (action_id) REFERENCES actions(id);


--
-- TOC entry 2389 (class 2606 OID 63981)
-- Name: FK_access_control_module; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY access_control
    ADD CONSTRAINT "FK_access_control_module" FOREIGN KEY (module_id) REFERENCES modules(id);


--
-- TOC entry 2390 (class 2606 OID 63986)
-- Name: FK_access_control_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY access_control
    ADD CONSTRAINT "FK_access_control_role" FOREIGN KEY (role_id) REFERENCES roles(id);


--
-- TOC entry 2393 (class 2606 OID 63991)
-- Name: FK_branch_detail_branch_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY branch_details
    ADD CONSTRAINT "FK_branch_detail_branch_id" FOREIGN KEY (branch_id) REFERENCES branches(id);


--
-- TOC entry 2394 (class 2606 OID 63996)
-- Name: FK_branch_detail_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY branch_details
    ADD CONSTRAINT "FK_branch_detail_company_id" FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2395 (class 2606 OID 64001)
-- Name: FK_branches_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY branches
    ADD CONSTRAINT "FK_branches_company_id" FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2416 (class 2606 OID 64006)
-- Name: FK_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_details
    ADD CONSTRAINT "FK_company_id" FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2400 (class 2606 OID 64011)
-- Name: FK_credit_cards_sales; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY credit_cards
    ADD CONSTRAINT "FK_credit_cards_sales" FOREIGN KEY (sale_id) REFERENCES sales(id);


--
-- TOC entry 2401 (class 2606 OID 64016)
-- Name: FK_credit_cards_type_credit_cards; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY credit_cards
    ADD CONSTRAINT "FK_credit_cards_type_credit_cards" FOREIGN KEY (credit_card_type_id) REFERENCES credit_card_types(id);


--
-- TOC entry 2406 (class 2606 OID 64021)
-- Name: FK_inputs_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY inputs_details
    ADD CONSTRAINT "FK_inputs_id" FOREIGN KEY (input_id) REFERENCES inputs(id);


--
-- TOC entry 2407 (class 2606 OID 64026)
-- Name: FK_inputs_product_barcode_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY inputs_details
    ADD CONSTRAINT "FK_inputs_product_barcode_id" FOREIGN KEY (product_barcode_id) REFERENCES product_barcodes(id);


--
-- TOC entry 2405 (class 2606 OID 64031)
-- Name: FK_inputs_shuttle_reason_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY inputs
    ADD CONSTRAINT "FK_inputs_shuttle_reason_id" FOREIGN KEY (shuttle_reason_id) REFERENCES shuttle_reasons(id);


--
-- TOC entry 2410 (class 2606 OID 64036)
-- Name: FK_offer-places_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offer_places
    ADD CONSTRAINT "FK_offer-places_company_id" FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2408 (class 2606 OID 64041)
-- Name: FK_offer_details_offer_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offer_details
    ADD CONSTRAINT "FK_offer_details_offer_id" FOREIGN KEY (offer_id) REFERENCES offers(id);


--
-- TOC entry 2411 (class 2606 OID 64046)
-- Name: FK_offer_places_branch_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offer_places
    ADD CONSTRAINT "FK_offer_places_branch_id" FOREIGN KEY (branch_id) REFERENCES branches(id);


--
-- TOC entry 2414 (class 2606 OID 64051)
-- Name: FK_outputs_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY outputs_details
    ADD CONSTRAINT "FK_outputs_id" FOREIGN KEY (output_id) REFERENCES outputs(id);


--
-- TOC entry 2415 (class 2606 OID 64056)
-- Name: FK_outputs_product_barcode_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY outputs_details
    ADD CONSTRAINT "FK_outputs_product_barcode_id" FOREIGN KEY (product_barcode_id) REFERENCES product_barcodes(id);


--
-- TOC entry 2413 (class 2606 OID 64061)
-- Name: FK_outputs_shuttle_reason_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY outputs
    ADD CONSTRAINT "FK_outputs_shuttle_reason_id" FOREIGN KEY (shuttle_reason_id) REFERENCES shuttle_reasons(id);


--
-- TOC entry 2391 (class 2606 OID 64066)
-- Name: FK_product_barcodes_product_detail_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_barcodes
    ADD CONSTRAINT "FK_product_barcodes_product_detail_id" FOREIGN KEY (product_detail_id) REFERENCES product_details(id);


--
-- TOC entry 2417 (class 2606 OID 64071)
-- Name: FK_product_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_details
    ADD CONSTRAINT "FK_product_id" FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 2433 (class 2606 OID 64076)
-- Name: FK_purchase_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT "FK_purchase_company_id" FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2439 (class 2606 OID 64081)
-- Name: FK_purchase_detail_purchase; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases_detail
    ADD CONSTRAINT "FK_purchase_detail_purchase" FOREIGN KEY (purchase_id) REFERENCES purchases(id);


--
-- TOC entry 2434 (class 2606 OID 64086)
-- Name: FK_purchase_supplier_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT "FK_purchase_supplier_id" FOREIGN KEY (supplier_id) REFERENCES suppliers(id);


--
-- TOC entry 2440 (class 2606 OID 64091)
-- Name: FK_purchases_detail_product_barcode_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases_detail
    ADD CONSTRAINT "FK_purchases_detail_product_barcode_id" FOREIGN KEY (product_barcode_id) REFERENCES product_barcodes(id);


--
-- TOC entry 2441 (class 2606 OID 64096)
-- Name: FK_rewards_company; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY rewards
    ADD CONSTRAINT "FK_rewards_company" FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2456 (class 2606 OID 64101)
-- Name: FK_stock_branch_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT "FK_stock_branch_id" FOREIGN KEY (branch_id) REFERENCES branches(id);


--
-- TOC entry 2457 (class 2606 OID 64106)
-- Name: FK_stock_product_barcode_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT "FK_stock_product_barcode_id" FOREIGN KEY (product_barcode_id) REFERENCES product_barcodes(id) ON DELETE CASCADE;


--
-- TOC entry 2402 (class 2606 OID 64111)
-- Name: customers_registered_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_registered_by_fkey FOREIGN KEY (registered_by) REFERENCES users(id);


--
-- TOC entry 2403 (class 2606 OID 64116)
-- Name: customers_registered_in_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_registered_in_fkey FOREIGN KEY (registered_in) REFERENCES branches(id);


--
-- TOC entry 2418 (class 2606 OID 64121)
-- Name: fk_age_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_age_id FOREIGN KEY (ages_id) REFERENCES ages(id);


--
-- TOC entry 2396 (class 2606 OID 64126)
-- Name: fk_campaings_accounting_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY campaings
    ADD CONSTRAINT fk_campaings_accounting_user_id FOREIGN KEY (accounting_user_id) REFERENCES users(id);


--
-- TOC entry 2397 (class 2606 OID 64131)
-- Name: fk_campaings_branch_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY campaings
    ADD CONSTRAINT fk_campaings_branch_id FOREIGN KEY (branch_id) REFERENCES branches(id);


--
-- TOC entry 2398 (class 2606 OID 64136)
-- Name: fk_campaings_marketing_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY campaings
    ADD CONSTRAINT fk_campaings_marketing_user_id FOREIGN KEY (marketing_user_id) REFERENCES users(id);


--
-- TOC entry 2399 (class 2606 OID 64141)
-- Name: fk_campaings_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY campaings
    ADD CONSTRAINT fk_campaings_user_id FOREIGN KEY (rejected_by) REFERENCES users(id);


--
-- TOC entry 2444 (class 2606 OID 64146)
-- Name: fk_cashiers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_cashiers_id FOREIGN KEY (cashier_id) REFERENCES users(id);


--
-- TOC entry 2419 (class 2606 OID 64151)
-- Name: fk_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_categories_id FOREIGN KEY (category_id) REFERENCES categories(id);


--
-- TOC entry 2458 (class 2606 OID 64156)
-- Name: fk_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY subcategories
    ADD CONSTRAINT fk_categories_id FOREIGN KEY (category_id) REFERENCES categories(id);


--
-- TOC entry 2459 (class 2606 OID 64161)
-- Name: fk_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2420 (class 2606 OID 64166)
-- Name: fk_currency_cost_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_currency_cost_id FOREIGN KEY (currency_cost) REFERENCES currencies(id);


--
-- TOC entry 2421 (class 2606 OID 64171)
-- Name: fk_currency_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_currency_id FOREIGN KEY (currency_id) REFERENCES currencies(id);


--
-- TOC entry 2445 (class 2606 OID 64176)
-- Name: fk_customers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_customers_id FOREIGN KEY (customer_id) REFERENCES customers(id);


--
-- TOC entry 2422 (class 2606 OID 64181)
-- Name: fk_measurement_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_measurement_id FOREIGN KEY (measurement_id) REFERENCES measurements(id);


--
-- TOC entry 2412 (class 2606 OID 64186)
-- Name: fk_offers_campaing_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offers
    ADD CONSTRAINT fk_offers_campaing_id FOREIGN KEY (campaing_id) REFERENCES campaings(id);


--
-- TOC entry 2409 (class 2606 OID 64191)
-- Name: fk_offers_details_product_details_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offer_details
    ADD CONSTRAINT fk_offers_details_product_details_id FOREIGN KEY (product_details_id) REFERENCES product_details(id);


--
-- TOC entry 2423 (class 2606 OID 64196)
-- Name: fk_products_brands_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_products_brands_id FOREIGN KEY (brand_id) REFERENCES brands(id);


--
-- TOC entry 2424 (class 2606 OID 64201)
-- Name: fk_products_genders_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_products_genders_id FOREIGN KEY (gender_id) REFERENCES genders(id);


--
-- TOC entry 2427 (class 2606 OID 64206)
-- Name: fk_products_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_order_details
    ADD CONSTRAINT fk_products_id FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 2429 (class 2606 OID 64211)
-- Name: fk_purchase_order_supplier_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT fk_purchase_order_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id);


--
-- TOC entry 2430 (class 2606 OID 64216)
-- Name: fk_purchase_orders_accounting_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT fk_purchase_orders_accounting_user_id FOREIGN KEY (accounting_user_id) REFERENCES users(id);


--
-- TOC entry 2428 (class 2606 OID 64221)
-- Name: fk_purchase_orders_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_order_details
    ADD CONSTRAINT fk_purchase_orders_id FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id);


--
-- TOC entry 2431 (class 2606 OID 64226)
-- Name: fk_purchase_orders_logistic_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT fk_purchase_orders_logistic_user_id FOREIGN KEY (logistic_user_id) REFERENCES users(id);


--
-- TOC entry 2432 (class 2606 OID 64231)
-- Name: fk_purchase_orders_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT fk_purchase_orders_user_id FOREIGN KEY (rejected_by) REFERENCES users(id);


--
-- TOC entry 2435 (class 2606 OID 64236)
-- Name: fk_purchase_supplier_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT fk_purchase_supplier_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id);


--
-- TOC entry 2436 (class 2606 OID 64241)
-- Name: fk_purchases_accounting_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT fk_purchases_accounting_user_id FOREIGN KEY (accounting_user_id) REFERENCES users(id);


--
-- TOC entry 2437 (class 2606 OID 64246)
-- Name: fk_purchases_logistic_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT fk_purchases_logistic_user_id FOREIGN KEY (logistic_user_id) REFERENCES users(id);


--
-- TOC entry 2438 (class 2606 OID 64251)
-- Name: fk_purchases_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchases
    ADD CONSTRAINT fk_purchases_user_id FOREIGN KEY (rejected_by) REFERENCES users(id);


--
-- TOC entry 2460 (class 2606 OID 64256)
-- Name: fk_role_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id);


--
-- TOC entry 2442 (class 2606 OID 64261)
-- Name: fk_sale_details_product_barcode_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sale_details
    ADD CONSTRAINT fk_sale_details_product_barcode_id FOREIGN KEY (product_barcode_id) REFERENCES product_barcodes(id);


--
-- TOC entry 2446 (class 2606 OID 64266)
-- Name: fk_sales_branch_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_sales_branch_id FOREIGN KEY (branch_id) REFERENCES branches(id);


--
-- TOC entry 2447 (class 2606 OID 64271)
-- Name: fk_sales_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_sales_company_id FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2443 (class 2606 OID 64276)
-- Name: fk_sales_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sale_details
    ADD CONSTRAINT fk_sales_id FOREIGN KEY (sale_id) REFERENCES sales(id);


--
-- TOC entry 2448 (class 2606 OID 64281)
-- Name: fk_sales_refund_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_sales_refund_id FOREIGN KEY (refund_origin_id) REFERENCES sales(id);


--
-- TOC entry 2449 (class 2606 OID 64286)
-- Name: fk_sales_refund_target_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_sales_refund_target_id FOREIGN KEY (refund_target_id) REFERENCES sales(id);


--
-- TOC entry 2450 (class 2606 OID 64291)
-- Name: fk_sales_sale_point_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_sales_sale_point_id FOREIGN KEY (sale_point_id) REFERENCES sale_points(id);


--
-- TOC entry 2451 (class 2606 OID 64296)
-- Name: fk_salesman_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_salesman_id FOREIGN KEY (salesman_id) REFERENCES employees(id);


--
-- TOC entry 2453 (class 2606 OID 64301)
-- Name: fk_serie_branch_detail_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY series
    ADD CONSTRAINT fk_serie_branch_detail_id FOREIGN KEY (branch_detail_id) REFERENCES branch_details(id);


--
-- TOC entry 2454 (class 2606 OID 64306)
-- Name: fk_series_sale_point_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY series
    ADD CONSTRAINT fk_series_sale_point_id FOREIGN KEY (sale_point_id) REFERENCES sale_points(id) ON DELETE CASCADE;


--
-- TOC entry 2392 (class 2606 OID 64311)
-- Name: fk_size_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY product_barcodes
    ADD CONSTRAINT fk_size_id FOREIGN KEY (size_id) REFERENCES size(id);


--
-- TOC entry 2425 (class 2606 OID 64316)
-- Name: fk_subcategories_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_subcategories_id FOREIGN KEY (subcategory_id) REFERENCES subcategories(id);


--
-- TOC entry 2455 (class 2606 OID 64321)
-- Name: fk_ticket_printers_serie_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ticket_printers
    ADD CONSTRAINT fk_ticket_printers_serie_id FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE CASCADE;


--
-- TOC entry 2426 (class 2606 OID 64326)
-- Name: fk_use_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_use_id FOREIGN KEY (uses_id) REFERENCES uses(id);


--
-- TOC entry 2404 (class 2606 OID 64331)
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY employees
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);


--
-- TOC entry 2461 (class 2606 OID 64336)
-- Name: fk_users_branch_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_users_branch_id FOREIGN KEY (branch_id) REFERENCES branches(id);


--
-- TOC entry 2462 (class 2606 OID 64341)
-- Name: fk_users_default_branch_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_users_default_branch_id FOREIGN KEY (default_branch_id) REFERENCES branches(id);


--
-- TOC entry 2452 (class 2606 OID 64346)
-- Name: fk_vouchers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_vouchers_id FOREIGN KEY (coupon_id) REFERENCES coupons(id);


--
-- TOC entry 2689 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2015-12-02 13:11:19

--
-- PostgreSQL database dump complete
--

