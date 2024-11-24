--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.5
-- Dumped by pg_dump version 9.3.5
-- Started on 2014-10-29 23:38:17

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- TOC entry 230 (class 3079 OID 11750)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2240 (class 0 OID 0)
-- Dependencies: 230
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 219 (class 1259 OID 26610)
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
-- TOC entry 218 (class 1259 OID 26608)
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
-- TOC entry 2241 (class 0 OID 0)
-- Dependencies: 218
-- Name: access_control_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE access_control_id_seq OWNED BY access_control.id;


--
-- TOC entry 217 (class 1259 OID 26602)
-- Name: actions; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE actions (
    id integer NOT NULL,
    description character varying(20)
);


ALTER TABLE public.actions OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 26600)
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
-- TOC entry 2242 (class 0 OID 0)
-- Dependencies: 216
-- Name: actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE actions_id_seq OWNED BY actions.id;


--
-- TOC entry 223 (class 1259 OID 26690)
-- Name: ages; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE ages (
    id integer NOT NULL,
    description character varying(90)
);


ALTER TABLE public.ages OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 26688)
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
-- TOC entry 2243 (class 0 OID 0)
-- Dependencies: 222
-- Name: ages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE ages_id_seq OWNED BY ages.id;


--
-- TOC entry 173 (class 1259 OID 26204)
-- Name: banks; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE banks (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.banks OWNER TO postgres;

--
-- TOC entry 172 (class 1259 OID 26202)
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
-- TOC entry 2244 (class 0 OID 0)
-- Dependencies: 172
-- Name: banks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE banks_id_seq OWNED BY banks.id;


--
-- TOC entry 197 (class 1259 OID 26303)
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE brands (
    id integer NOT NULL,
    description character varying(60) NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 26301)
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
-- TOC entry 2245 (class 0 OID 0)
-- Dependencies: 196
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE brands_id_seq OWNED BY brands.id;


--
-- TOC entry 191 (class 1259 OID 26279)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE categories (
    id integer NOT NULL,
    description character varying(60) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 26277)
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
-- TOC entry 2246 (class 0 OID 0)
-- Dependencies: 190
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE categories_id_seq OWNED BY categories.id;


--
-- TOC entry 171 (class 1259 OID 26196)
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE companies (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- TOC entry 170 (class 1259 OID 26194)
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
-- TOC entry 2247 (class 0 OID 0)
-- Dependencies: 170
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE companies_id_seq OWNED BY companies.id;


--
-- TOC entry 175 (class 1259 OID 26212)
-- Name: credit_card; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE credit_card (
    id integer NOT NULL,
    bank_id integer NOT NULL,
    sale_id integer NOT NULL,
    verification_code character varying(5),
    card_number character varying(5)
);


ALTER TABLE public.credit_card OWNER TO postgres;

--
-- TOC entry 174 (class 1259 OID 26210)
-- Name: credit_card_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE credit_card_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.credit_card_id_seq OWNER TO postgres;

--
-- TOC entry 2248 (class 0 OID 0)
-- Dependencies: 174
-- Name: credit_card_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE credit_card_id_seq OWNED BY credit_card.id;


--
-- TOC entry 229 (class 1259 OID 26724)
-- Name: currencies; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE currencies (
    id integer NOT NULL,
    description character varying(90)
);


ALTER TABLE public.currencies OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 26722)
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
-- TOC entry 2249 (class 0 OID 0)
-- Dependencies: 228
-- Name: currencies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE currencies_id_seq OWNED BY currencies.id;


--
-- TOC entry 183 (class 1259 OID 26244)
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
    reg_date timestamp without time zone,
    last_purchase timestamp without time zone,
    level character varying(30),
    new_reg_date timestamp without time zone,
    gender character(1),
    points integer,
    current_points integer
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 26242)
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
-- TOC entry 2250 (class 0 OID 0)
-- Dependencies: 182
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE customers_id_seq OWNED BY customers.id;


--
-- TOC entry 201 (class 1259 OID 26319)
-- Name: depots; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE depots (
    id integer NOT NULL,
    name character varying(80) NOT NULL,
    location character varying(220)
);


ALTER TABLE public.depots OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 26317)
-- Name: depots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE depots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.depots_id_seq OWNER TO postgres;

--
-- TOC entry 2251 (class 0 OID 0)
-- Dependencies: 200
-- Name: depots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE depots_id_seq OWNED BY depots.id;


--
-- TOC entry 177 (class 1259 OID 26220)
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE employees (
    id integer NOT NULL,
    name character varying(80),
    last_name character varying(80),
    user_id integer
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- TOC entry 176 (class 1259 OID 26218)
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
-- TOC entry 2252 (class 0 OID 0)
-- Dependencies: 176
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE employees_id_seq OWNED BY employees.id;


--
-- TOC entry 225 (class 1259 OID 26708)
-- Name: measurements; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE measurements (
    id integer NOT NULL,
    code character varying(6),
    description character varying(90)
);


ALTER TABLE public.measurements OWNER TO postgres;

--
-- TOC entry 2253 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE measurements; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE measurements IS 'Español
Tabla para Unidades de Medida
ej.
U Unidad
P Par
C/U Cada uno';


--
-- TOC entry 224 (class 1259 OID 26706)
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
-- TOC entry 2254 (class 0 OID 0)
-- Dependencies: 224
-- Name: measurements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE measurements_id_seq OWNED BY measurements.id;


--
-- TOC entry 215 (class 1259 OID 26594)
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE modules (
    id integer NOT NULL,
    description character varying(50)
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 26592)
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
-- TOC entry 2255 (class 0 OID 0)
-- Dependencies: 214
-- Name: modules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE modules_id_seq OWNED BY modules.id;


--
-- TOC entry 195 (class 1259 OID 26295)
-- Name: offer_price; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE offer_price (
    id integer NOT NULL,
    product_id integer,
    price real,
    start_date timestamp without time zone,
    end_date timestamp without time zone
);


ALTER TABLE public.offer_price OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 26293)
-- Name: offer_price_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE offer_price_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offer_price_id_seq OWNER TO postgres;

--
-- TOC entry 2256 (class 0 OID 0)
-- Dependencies: 194
-- Name: offer_price_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE offer_price_id_seq OWNED BY offer_price.id;


--
-- TOC entry 207 (class 1259 OID 26343)
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
    regime_id integer,
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
    comments character varying(220)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 26341)
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
-- TOC entry 2257 (class 0 OID 0)
-- Dependencies: 206
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE products_id_seq OWNED BY products.id;


--
-- TOC entry 211 (class 1259 OID 26361)
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
-- TOC entry 210 (class 1259 OID 26359)
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
-- TOC entry 2258 (class 0 OID 0)
-- Dependencies: 210
-- Name: purchase_order_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE purchase_order_details_id_seq OWNED BY purchase_order_details.id;


--
-- TOC entry 209 (class 1259 OID 26351)
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE purchase_orders (
    id integer NOT NULL,
    code character varying(10) NOT NULL,
    description character varying(100),
    start_date date,
    finish_date date,
    paid_date date,
    supplier_id integer
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 26349)
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
-- TOC entry 2259 (class 0 OID 0)
-- Dependencies: 208
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE purchase_orders_id_seq OWNED BY purchase_orders.id;


--
-- TOC entry 227 (class 1259 OID 26716)
-- Name: regime; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE regime (
    id integer NOT NULL,
    description character varying(90),
    tax double precision
);


ALTER TABLE public.regime OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 26714)
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
-- TOC entry 2260 (class 0 OID 0)
-- Dependencies: 226
-- Name: regime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE regime_id_seq OWNED BY regime.id;


--
-- TOC entry 213 (class 1259 OID 26586)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE roles (
    id integer NOT NULL,
    description character varying(50)
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 26584)
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
-- TOC entry 2261 (class 0 OID 0)
-- Dependencies: 212
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE roles_id_seq OWNED BY roles.id;


--
-- TOC entry 189 (class 1259 OID 26271)
-- Name: sale_details; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sale_details (
    id integer NOT NULL,
    sale_id integer NOT NULL,
    product_id integer NOT NULL,
    size_id integer,
    quantity integer NOT NULL,
    subtotal real,
    igv real,
    precio real
);


ALTER TABLE public.sale_details OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 26269)
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
-- TOC entry 2262 (class 0 OID 0)
-- Dependencies: 188
-- Name: sale_details_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sale_details_id_seq OWNED BY sale_details.id;


--
-- TOC entry 187 (class 1259 OID 26263)
-- Name: sales; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE sales (
    id integer NOT NULL,
    salesman_id integer NOT NULL,
    cashier_id integer NOT NULL,
    customer_id integer NOT NULL,
    voucher_type_id integer NOT NULL,
    voucher_id integer NOT NULL,
    sale_date timestamp without time zone NOT NULL,
    igv real,
    total_amount real
);


ALTER TABLE public.sales OWNER TO postgres;

--
-- TOC entry 186 (class 1259 OID 26261)
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
-- TOC entry 2263 (class 0 OID 0)
-- Dependencies: 186
-- Name: sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE sales_id_seq OWNED BY sales.id;


--
-- TOC entry 199 (class 1259 OID 26311)
-- Name: size; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE size (
    id integer NOT NULL,
    description character varying(60) NOT NULL,
    description2 character varying(12)
);


ALTER TABLE public.size OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 26309)
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
-- TOC entry 2264 (class 0 OID 0)
-- Dependencies: 198
-- Name: size_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE size_id_seq OWNED BY size.id;


--
-- TOC entry 203 (class 1259 OID 26327)
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE stock (
    id integer NOT NULL,
    product_id integer NOT NULL,
    depot_id integer NOT NULL,
    size_id integer NOT NULL,
    stock integer,
    state character varying(25),
    first_entry timestamp without time zone,
    last_entry timestamp without time zone,
    last_sale timestamp without time zone
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 26325)
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
-- TOC entry 2265 (class 0 OID 0)
-- Dependencies: 202
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE stock_id_seq OWNED BY stock.id;


--
-- TOC entry 193 (class 1259 OID 26287)
-- Name: subcategories; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE subcategories (
    id integer NOT NULL,
    description character varying(60) NOT NULL,
    category_id integer
);


ALTER TABLE public.subcategories OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 26285)
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
-- TOC entry 2266 (class 0 OID 0)
-- Dependencies: 192
-- Name: subcategories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE subcategories_id_seq OWNED BY subcategories.id;


--
-- TOC entry 205 (class 1259 OID 26335)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE suppliers (
    id integer NOT NULL,
    description character varying(60),
    ruc character varying(11),
    direction character varying(120),
    contacto character varying(120),
    tlf1 character varying(12),
    tlf2 character varying(12),
    email character varying(20)
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 26333)
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE suppliers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.suppliers_id_seq OWNER TO postgres;

--
-- TOC entry 2267 (class 0 OID 0)
-- Dependencies: 204
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE suppliers_id_seq OWNED BY suppliers.id;


--
-- TOC entry 185 (class 1259 OID 26255)
-- Name: voucher_types; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE voucher_types (
    id integer NOT NULL,
    description character varying(25)
);


ALTER TABLE public.voucher_types OWNER TO postgres;

--
-- TOC entry 184 (class 1259 OID 26253)
-- Name: tipo_comprobante_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE tipo_comprobante_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tipo_comprobante_id_seq OWNER TO postgres;

--
-- TOC entry 2268 (class 0 OID 0)
-- Dependencies: 184
-- Name: tipo_comprobante_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE tipo_comprobante_id_seq OWNED BY voucher_types.id;


--
-- TOC entry 179 (class 1259 OID 26228)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    username character varying(50) NOT NULL,
    default_company_id integer,
    name character varying(80),
    last_name character varying(80),
    role_id integer,
    avatar_mode integer,
    avatar character varying(255),
    company_id integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 178 (class 1259 OID 26226)
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
-- TOC entry 2269 (class 0 OID 0)
-- Dependencies: 178
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 221 (class 1259 OID 26682)
-- Name: uses; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE uses (
    id integer NOT NULL,
    description character varying(90)
);


ALTER TABLE public.uses OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 26680)
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
-- TOC entry 2270 (class 0 OID 0)
-- Dependencies: 220
-- Name: uses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE uses_id_seq OWNED BY uses.id;


--
-- TOC entry 181 (class 1259 OID 26236)
-- Name: vouchers; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE vouchers (
    id integer NOT NULL,
    code character varying(15) NOT NULL,
    amount real NOT NULL,
    creation_date timestamp without time zone NOT NULL,
    used_date timestamp without time zone NOT NULL,
    state character varying(15) NOT NULL
);


ALTER TABLE public.vouchers OWNER TO postgres;

--
-- TOC entry 180 (class 1259 OID 26234)
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
-- TOC entry 2271 (class 0 OID 0)
-- Dependencies: 180
-- Name: vouchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE vouchers_id_seq OWNED BY vouchers.id;


--
-- TOC entry 2024 (class 2604 OID 26613)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY access_control ALTER COLUMN id SET DEFAULT nextval('access_control_id_seq'::regclass);


--
-- TOC entry 2023 (class 2604 OID 26605)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY actions ALTER COLUMN id SET DEFAULT nextval('actions_id_seq'::regclass);


--
-- TOC entry 2026 (class 2604 OID 26693)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ages ALTER COLUMN id SET DEFAULT nextval('ages_id_seq'::regclass);


--
-- TOC entry 2001 (class 2604 OID 26207)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY banks ALTER COLUMN id SET DEFAULT nextval('banks_id_seq'::regclass);


--
-- TOC entry 2013 (class 2604 OID 26306)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY brands ALTER COLUMN id SET DEFAULT nextval('brands_id_seq'::regclass);


--
-- TOC entry 2010 (class 2604 OID 26282)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- TOC entry 2000 (class 2604 OID 26199)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY companies ALTER COLUMN id SET DEFAULT nextval('companies_id_seq'::regclass);


--
-- TOC entry 2002 (class 2604 OID 26215)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY credit_card ALTER COLUMN id SET DEFAULT nextval('credit_card_id_seq'::regclass);


--
-- TOC entry 2029 (class 2604 OID 26727)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY currencies ALTER COLUMN id SET DEFAULT nextval('currencies_id_seq'::regclass);


--
-- TOC entry 2006 (class 2604 OID 26247)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY customers ALTER COLUMN id SET DEFAULT nextval('customers_id_seq'::regclass);


--
-- TOC entry 2015 (class 2604 OID 26322)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY depots ALTER COLUMN id SET DEFAULT nextval('depots_id_seq'::regclass);


--
-- TOC entry 2003 (class 2604 OID 26223)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY employees ALTER COLUMN id SET DEFAULT nextval('employees_id_seq'::regclass);


--
-- TOC entry 2027 (class 2604 OID 26711)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY measurements ALTER COLUMN id SET DEFAULT nextval('measurements_id_seq'::regclass);


--
-- TOC entry 2022 (class 2604 OID 26597)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY modules ALTER COLUMN id SET DEFAULT nextval('modules_id_seq'::regclass);


--
-- TOC entry 2012 (class 2604 OID 26298)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offer_price ALTER COLUMN id SET DEFAULT nextval('offer_price_id_seq'::regclass);


--
-- TOC entry 2018 (class 2604 OID 26346)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products ALTER COLUMN id SET DEFAULT nextval('products_id_seq'::regclass);


--
-- TOC entry 2020 (class 2604 OID 26364)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_order_details ALTER COLUMN id SET DEFAULT nextval('purchase_order_details_id_seq'::regclass);


--
-- TOC entry 2019 (class 2604 OID 26354)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_orders ALTER COLUMN id SET DEFAULT nextval('purchase_orders_id_seq'::regclass);


--
-- TOC entry 2028 (class 2604 OID 26719)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY regime ALTER COLUMN id SET DEFAULT nextval('regime_id_seq'::regclass);


--
-- TOC entry 2021 (class 2604 OID 26589)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);


--
-- TOC entry 2009 (class 2604 OID 26274)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sale_details ALTER COLUMN id SET DEFAULT nextval('sale_details_id_seq'::regclass);


--
-- TOC entry 2008 (class 2604 OID 26266)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales ALTER COLUMN id SET DEFAULT nextval('sales_id_seq'::regclass);


--
-- TOC entry 2014 (class 2604 OID 26314)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY size ALTER COLUMN id SET DEFAULT nextval('size_id_seq'::regclass);


--
-- TOC entry 2016 (class 2604 OID 26330)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock ALTER COLUMN id SET DEFAULT nextval('stock_id_seq'::regclass);


--
-- TOC entry 2011 (class 2604 OID 26290)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY subcategories ALTER COLUMN id SET DEFAULT nextval('subcategories_id_seq'::regclass);


--
-- TOC entry 2017 (class 2604 OID 26338)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY suppliers ALTER COLUMN id SET DEFAULT nextval('suppliers_id_seq'::regclass);


--
-- TOC entry 2004 (class 2604 OID 26231)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2025 (class 2604 OID 26685)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY uses ALTER COLUMN id SET DEFAULT nextval('uses_id_seq'::regclass);


--
-- TOC entry 2007 (class 2604 OID 26258)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY voucher_types ALTER COLUMN id SET DEFAULT nextval('tipo_comprobante_id_seq'::regclass);


--
-- TOC entry 2005 (class 2604 OID 26239)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY vouchers ALTER COLUMN id SET DEFAULT nextval('vouchers_id_seq'::regclass);


--
-- TOC entry 2081 (class 2606 OID 26615)
-- Name: PK_access_control_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY access_control
    ADD CONSTRAINT "PK_access_control_id" PRIMARY KEY (id);


--
-- TOC entry 2079 (class 2606 OID 26607)
-- Name: PK_actions_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY actions
    ADD CONSTRAINT "PK_actions_id" PRIMARY KEY (id);


--
-- TOC entry 2085 (class 2606 OID 26695)
-- Name: PK_ages_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY ages
    ADD CONSTRAINT "PK_ages_id" PRIMARY KEY (id);


--
-- TOC entry 2033 (class 2606 OID 26209)
-- Name: PK_banks_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY banks
    ADD CONSTRAINT "PK_banks_id" PRIMARY KEY (id);


--
-- TOC entry 2057 (class 2606 OID 26308)
-- Name: PK_brands_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY brands
    ADD CONSTRAINT "PK_brands_id" PRIMARY KEY (id);


--
-- TOC entry 2051 (class 2606 OID 26284)
-- Name: PK_categories_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT "PK_categories_id" PRIMARY KEY (id);


--
-- TOC entry 2031 (class 2606 OID 26201)
-- Name: PK_companies_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY companies
    ADD CONSTRAINT "PK_companies_id" PRIMARY KEY (id);


--
-- TOC entry 2035 (class 2606 OID 26217)
-- Name: PK_credit_card_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY credit_card
    ADD CONSTRAINT "PK_credit_card_id" PRIMARY KEY (id);


--
-- TOC entry 2091 (class 2606 OID 26729)
-- Name: PK_currencies_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY currencies
    ADD CONSTRAINT "PK_currencies_id" PRIMARY KEY (id);


--
-- TOC entry 2043 (class 2606 OID 26252)
-- Name: PK_customers_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY customers
    ADD CONSTRAINT "PK_customers_id" PRIMARY KEY (id);


--
-- TOC entry 2061 (class 2606 OID 26324)
-- Name: PK_depots_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY depots
    ADD CONSTRAINT "PK_depots_id" PRIMARY KEY (id);


--
-- TOC entry 2037 (class 2606 OID 26225)
-- Name: PK_employees_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY employees
    ADD CONSTRAINT "PK_employees_id" PRIMARY KEY (id);


--
-- TOC entry 2087 (class 2606 OID 26713)
-- Name: PK_measurement_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY measurements
    ADD CONSTRAINT "PK_measurement_id" PRIMARY KEY (id);


--
-- TOC entry 2077 (class 2606 OID 26599)
-- Name: PK_modules_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY modules
    ADD CONSTRAINT "PK_modules_id" PRIMARY KEY (id);


--
-- TOC entry 2055 (class 2606 OID 26300)
-- Name: PK_offer_price_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY offer_price
    ADD CONSTRAINT "PK_offer_price_id" PRIMARY KEY (id);


--
-- TOC entry 2067 (class 2606 OID 26348)
-- Name: PK_products_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY products
    ADD CONSTRAINT "PK_products_id" PRIMARY KEY (id);


--
-- TOC entry 2073 (class 2606 OID 26366)
-- Name: PK_purchase_order_details_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY purchase_order_details
    ADD CONSTRAINT "PK_purchase_order_details_id" PRIMARY KEY (id);


--
-- TOC entry 2069 (class 2606 OID 26356)
-- Name: PK_purchase_orders_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT "PK_purchase_orders_id" PRIMARY KEY (id);


--
-- TOC entry 2089 (class 2606 OID 26721)
-- Name: PK_regime_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY regime
    ADD CONSTRAINT "PK_regime_id" PRIMARY KEY (id);


--
-- TOC entry 2075 (class 2606 OID 26591)
-- Name: PK_roles_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY roles
    ADD CONSTRAINT "PK_roles_id" PRIMARY KEY (id);


--
-- TOC entry 2049 (class 2606 OID 26276)
-- Name: PK_sales_details_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sale_details
    ADD CONSTRAINT "PK_sales_details_id" PRIMARY KEY (id);


--
-- TOC entry 2047 (class 2606 OID 26268)
-- Name: PK_sales_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT "PK_sales_id" PRIMARY KEY (id);


--
-- TOC entry 2059 (class 2606 OID 26316)
-- Name: PK_size_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY size
    ADD CONSTRAINT "PK_size_id" PRIMARY KEY (id);


--
-- TOC entry 2063 (class 2606 OID 26332)
-- Name: PK_stock_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT "PK_stock_id" PRIMARY KEY (id);


--
-- TOC entry 2053 (class 2606 OID 26292)
-- Name: PK_subcategories_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY subcategories
    ADD CONSTRAINT "PK_subcategories_id" PRIMARY KEY (id);


--
-- TOC entry 2065 (class 2606 OID 26340)
-- Name: PK_suppliers_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY suppliers
    ADD CONSTRAINT "PK_suppliers_id" PRIMARY KEY (id);


--
-- TOC entry 2045 (class 2606 OID 26260)
-- Name: PK_tipo_comprobante_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY voucher_types
    ADD CONSTRAINT "PK_tipo_comprobante_id" PRIMARY KEY (id);


--
-- TOC entry 2039 (class 2606 OID 26233)
-- Name: PK_users_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY users
    ADD CONSTRAINT "PK_users_id" PRIMARY KEY (id);


--
-- TOC entry 2083 (class 2606 OID 26687)
-- Name: PK_uses_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY uses
    ADD CONSTRAINT "PK_uses_id" PRIMARY KEY (id);


--
-- TOC entry 2041 (class 2606 OID 26241)
-- Name: PK_vouchers_id; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY vouchers
    ADD CONSTRAINT "PK_vouchers_id" PRIMARY KEY (id);


--
-- TOC entry 2071 (class 2606 OID 26358)
-- Name: purchase_orders_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT purchase_orders_codigo_key UNIQUE (code);


--
-- TOC entry 2123 (class 2606 OID 26616)
-- Name: FK_access_control_action; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY access_control
    ADD CONSTRAINT "FK_access_control_action" FOREIGN KEY (action_id) REFERENCES actions(id);


--
-- TOC entry 2124 (class 2606 OID 26621)
-- Name: FK_access_control_module; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY access_control
    ADD CONSTRAINT "FK_access_control_module" FOREIGN KEY (module_id) REFERENCES modules(id);


--
-- TOC entry 2125 (class 2606 OID 26626)
-- Name: FK_access_control_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY access_control
    ADD CONSTRAINT "FK_access_control_role" FOREIGN KEY (role_id) REFERENCES roles(id);


--
-- TOC entry 2115 (class 2606 OID 26701)
-- Name: fk_age_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_age_id FOREIGN KEY (ages_id) REFERENCES ages(id);


--
-- TOC entry 2092 (class 2606 OID 26387)
-- Name: fk_banks_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY credit_card
    ADD CONSTRAINT fk_banks_id FOREIGN KEY (bank_id) REFERENCES banks(id);


--
-- TOC entry 2100 (class 2606 OID 26412)
-- Name: fk_cashiers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_cashiers_id FOREIGN KEY (cashier_id) REFERENCES users(id);


--
-- TOC entry 2113 (class 2606 OID 26447)
-- Name: fk_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_categories_id FOREIGN KEY (category_id) REFERENCES categories(id);


--
-- TOC entry 2106 (class 2606 OID 26452)
-- Name: fk_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY subcategories
    ADD CONSTRAINT fk_categories_id FOREIGN KEY (category_id) REFERENCES categories(id);


--
-- TOC entry 2097 (class 2606 OID 26785)
-- Name: fk_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_company_id FOREIGN KEY (company_id) REFERENCES companies(id);


--
-- TOC entry 2119 (class 2606 OID 26746)
-- Name: fk_currency_cost_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_currency_cost_id FOREIGN KEY (currency_cost) REFERENCES currencies(id);


--
-- TOC entry 2118 (class 2606 OID 26741)
-- Name: fk_currency_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_currency_id FOREIGN KEY (currency_id) REFERENCES currencies(id);


--
-- TOC entry 2101 (class 2606 OID 26417)
-- Name: fk_customers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_customers_id FOREIGN KEY (customer_id) REFERENCES customers(id);


--
-- TOC entry 2095 (class 2606 OID 26512)
-- Name: fk_default_company_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_default_company_id FOREIGN KEY (default_company_id) REFERENCES companies(id);


--
-- TOC entry 2110 (class 2606 OID 26472)
-- Name: fk_depots_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT fk_depots_id FOREIGN KEY (depot_id) REFERENCES depots(id);


--
-- TOC entry 2116 (class 2606 OID 26731)
-- Name: fk_measurement_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_measurement_id FOREIGN KEY (measurement_id) REFERENCES measurements(id);


--
-- TOC entry 2111 (class 2606 OID 26367)
-- Name: fk_products_brands_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_products_brands_id FOREIGN KEY (brand_id) REFERENCES brands(id);


--
-- TOC entry 2122 (class 2606 OID 26382)
-- Name: fk_products_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_order_details
    ADD CONSTRAINT fk_products_id FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 2104 (class 2606 OID 26432)
-- Name: fk_products_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sale_details
    ADD CONSTRAINT fk_products_id FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 2107 (class 2606 OID 26457)
-- Name: fk_products_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY offer_price
    ADD CONSTRAINT fk_products_id FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 2108 (class 2606 OID 26462)
-- Name: fk_products_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT fk_products_id FOREIGN KEY (product_id) REFERENCES products(id);


--
-- TOC entry 2121 (class 2606 OID 26377)
-- Name: fk_purchase_orders_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_order_details
    ADD CONSTRAINT fk_purchase_orders_id FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id);


--
-- TOC entry 2117 (class 2606 OID 26736)
-- Name: fk_regime_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_regime_id FOREIGN KEY (regime_id) REFERENCES regime(id);


--
-- TOC entry 2096 (class 2606 OID 26631)
-- Name: fk_role_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(id);


--
-- TOC entry 2093 (class 2606 OID 26392)
-- Name: fk_sales_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY credit_card
    ADD CONSTRAINT fk_sales_id FOREIGN KEY (sale_id) REFERENCES sales(id);


--
-- TOC entry 2103 (class 2606 OID 26427)
-- Name: fk_sales_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sale_details
    ADD CONSTRAINT fk_sales_id FOREIGN KEY (sale_id) REFERENCES sales(id);


--
-- TOC entry 2099 (class 2606 OID 26407)
-- Name: fk_salesman_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_salesman_id FOREIGN KEY (salesman_id) REFERENCES employees(id);


--
-- TOC entry 2105 (class 2606 OID 26437)
-- Name: fk_size_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sale_details
    ADD CONSTRAINT fk_size_id FOREIGN KEY (size_id) REFERENCES size(id);


--
-- TOC entry 2109 (class 2606 OID 26467)
-- Name: fk_size_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY stock
    ADD CONSTRAINT fk_size_id FOREIGN KEY (size_id) REFERENCES size(id);


--
-- TOC entry 2112 (class 2606 OID 26442)
-- Name: fk_subcategories_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_subcategories_id FOREIGN KEY (subcategory_id) REFERENCES subcategories(id);


--
-- TOC entry 2120 (class 2606 OID 26372)
-- Name: fk_suppliers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY purchase_orders
    ADD CONSTRAINT fk_suppliers_id FOREIGN KEY (supplier_id) REFERENCES suppliers(id);


--
-- TOC entry 2102 (class 2606 OID 26422)
-- Name: fk_tipo_comprobante_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_tipo_comprobante_id FOREIGN KEY (voucher_type_id) REFERENCES voucher_types(id);


--
-- TOC entry 2114 (class 2606 OID 26696)
-- Name: fk_use_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY products
    ADD CONSTRAINT fk_use_id FOREIGN KEY (uses_id) REFERENCES uses(id);


--
-- TOC entry 2094 (class 2606 OID 26548)
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY employees
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id);


--
-- TOC entry 2098 (class 2606 OID 26402)
-- Name: fk_vouchers_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY sales
    ADD CONSTRAINT fk_vouchers_id FOREIGN KEY (voucher_id) REFERENCES vouchers(id);


--
-- TOC entry 2239 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2014-10-29 23:38:17

--
-- PostgreSQL database dump complete
--

