--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

-- Started on 2025-09-05 11:44:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 24668)
-- Name: env; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.env (
    id integer NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.env OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 24667)
-- Name: env_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.env_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.env_id_seq OWNER TO postgres;

--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 214
-- Name: env_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.env_id_seq OWNED BY public.env.id;


--
-- TOC entry 216 (class 1259 OID 24676)
-- Name: air; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.air (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.air OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 24820)
-- Name: audit_conformite; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_conformite (
    id integer NOT NULL,
    reglementation_id integer NOT NULL,
    conformite text,
    risque text,
    faisabilite text,
    plan_action text,
    deadline date,
    owner text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT audit_conformite_conformite_check CHECK ((conformite = ANY (ARRAY[('Conforme'::character varying)::text, ('Non Conforme'::character varying)::text, ('Non Applicable'::character varying)::text]))),
    CONSTRAINT audit_conformite_faisabilite_check CHECK ((faisabilite = ANY (ARRAY[('Facile'::character varying)::text, ('Moyen'::character varying)::text, ('Difficile'::character varying)::text]))),
    CONSTRAINT audit_conformite_risque_check CHECK ((risque = ANY (ARRAY[('Faible'::character varying)::text, ('Moyen'::character varying)::text, ('Élevé'::character varying)::text])))
);


ALTER TABLE public.audit_conformite OWNER TO postgres;

--
-- TOC entry 3420 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE audit_conformite; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.audit_conformite IS 'Table stockant les audits de conformité réglementaire';


--
-- TOC entry 3421 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN audit_conformite.reglementation_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_conformite.reglementation_id IS 'Référence vers la réglementation auditée';


--
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN audit_conformite.conformite; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_conformite.conformite IS 'Statut de conformité: Conforme, Non Conforme, Non Applicable';


--
-- TOC entry 3423 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN audit_conformite.risque; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_conformite.risque IS 'Niveau de risque: Faible, Moyen, Élevé';


--
-- TOC entry 3424 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN audit_conformite.faisabilite; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_conformite.faisabilite IS 'Niveau de faisabilité: Facile, Moyen, Difficile';


--
-- TOC entry 3425 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN audit_conformite.plan_action; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_conformite.plan_action IS 'Plan d action pour la mise en conformité';


--
-- TOC entry 3426 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN audit_conformite.deadline; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_conformite.deadline IS 'Date limite pour la mise en conformité';


--
-- TOC entry 3427 (class 0 OID 0)
-- Dependencies: 228
-- Name: COLUMN audit_conformite.owner; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.audit_conformite.owner IS 'Responsable de la mise en conformité';


--
-- TOC entry 227 (class 1259 OID 24819)
-- Name: audit_conformite_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_conformite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_conformite_id_seq OWNER TO postgres;

--
-- TOC entry 3428 (class 0 OID 0)
-- Dependencies: 227
-- Name: audit_conformite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_conformite_id_seq OWNED BY public.audit_conformite.id;


--
-- TOC entry 219 (class 1259 OID 24700)
-- Name: chemicals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chemicals (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.chemicals OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 24708)
-- Name: dangerous; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dangerous (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.dangerous OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 24740)
-- Name: emergency; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.emergency OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 24771)
-- Name: reglementation_all; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reglementation_all (
    id integer NOT NULL,
    domaine character varying(50),
    chapitre text,
    sous_chapitre text,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.reglementation_all OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24770)
-- Name: reglementation_all_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reglementation_all_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reglementation_all_id_seq OWNER TO postgres;

--
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 225
-- Name: reglementation_all_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reglementation_all_id_seq OWNED BY public.reglementation_all.id;


--
-- TOC entry 221 (class 1259 OID 24716)
-- Name: safety; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.safety (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.safety OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 24724)
-- Name: sst; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sst (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.sst OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24732)
-- Name: technical_safety; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technical_safety (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.technical_safety OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24692)
-- Name: waste; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waste (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.waste OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24684)
-- Name: water; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.water (
    id integer DEFAULT nextval('public.env_id_seq'::regclass) NOT NULL,
    chapitre integer,
    sous_chapitre integer,
    titre text,
    exigence text,
    lois text,
    documents text
);


ALTER TABLE public.water OWNER TO postgres;

--
-- TOC entry 3230 (class 2604 OID 24823)
-- Name: audit_conformite id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_conformite ALTER COLUMN id SET DEFAULT nextval('public.audit_conformite_id_seq'::regclass);


--
-- TOC entry 3219 (class 2604 OID 24671)
-- Name: env id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.env ALTER COLUMN id SET DEFAULT nextval('public.env_id_seq'::regclass);


--
-- TOC entry 3229 (class 2604 OID 24774)
-- Name: reglementation_all id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reglementation_all ALTER COLUMN id SET DEFAULT nextval('public.reglementation_all_id_seq'::regclass);


--
-- TOC entry 3239 (class 2606 OID 24683)
-- Name: air air_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.air
    ADD CONSTRAINT air_pkey PRIMARY KEY (id);


--
-- TOC entry 3265 (class 2606 OID 24832)
-- Name: audit_conformite audit_conformite_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_conformite
    ADD CONSTRAINT audit_conformite_pkey PRIMARY KEY (id);


--
-- TOC entry 3267 (class 2606 OID 24834)
-- Name: audit_conformite audit_conformite_reglementation_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_conformite
    ADD CONSTRAINT audit_conformite_reglementation_id_key UNIQUE (reglementation_id);


--
-- TOC entry 3245 (class 2606 OID 24707)
-- Name: chemicals chemicals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chemicals
    ADD CONSTRAINT chemicals_pkey PRIMARY KEY (id);


--
-- TOC entry 3247 (class 2606 OID 24715)
-- Name: dangerous dangerous_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dangerous
    ADD CONSTRAINT dangerous_pkey PRIMARY KEY (id);


--
-- TOC entry 3255 (class 2606 OID 24747)
-- Name: emergency emergency_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency
    ADD CONSTRAINT emergency_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 24675)
-- Name: env env_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.env
    ADD CONSTRAINT env_pkey PRIMARY KEY (id);


--
-- TOC entry 3263 (class 2606 OID 24778)
-- Name: reglementation_all reglementation_all_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reglementation_all
    ADD CONSTRAINT reglementation_all_pkey PRIMARY KEY (id);


--
-- TOC entry 3249 (class 2606 OID 24723)
-- Name: safety safety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.safety
    ADD CONSTRAINT safety_pkey PRIMARY KEY (id);


--
-- TOC entry 3251 (class 2606 OID 24731)
-- Name: sst sst_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sst
    ADD CONSTRAINT sst_pkey PRIMARY KEY (id);


--
-- TOC entry 3253 (class 2606 OID 24739)
-- Name: technical_safety technical_safety_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technical_safety
    ADD CONSTRAINT technical_safety_pkey PRIMARY KEY (id);


--
-- TOC entry 3243 (class 2606 OID 24699)
-- Name: waste waste_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waste
    ADD CONSTRAINT waste_pkey PRIMARY KEY (id);


--
-- TOC entry 3241 (class 2606 OID 24691)
-- Name: water water_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.water
    ADD CONSTRAINT water_pkey PRIMARY KEY (id);


--
-- TOC entry 3268 (class 1259 OID 24842)
-- Name: idx_audit_deadline; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_deadline ON public.audit_conformite USING btree (deadline);


--
-- TOC entry 3269 (class 1259 OID 24846)
-- Name: idx_audit_owner; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_owner ON public.audit_conformite USING btree (owner);


--
-- TOC entry 3270 (class 1259 OID 24840)
-- Name: idx_audit_reglementation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_reglementation_id ON public.audit_conformite USING btree (reglementation_id);


--
-- TOC entry 3256 (class 1259 OID 24800)
-- Name: idx_reglementation_chapitre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reglementation_chapitre ON public.reglementation_all USING btree (chapitre);


--
-- TOC entry 3257 (class 1259 OID 24803)
-- Name: idx_reglementation_documents; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reglementation_documents ON public.reglementation_all USING btree (documents);


--
-- TOC entry 3258 (class 1259 OID 24799)
-- Name: idx_reglementation_domaine; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reglementation_domaine ON public.reglementation_all USING btree (domaine);


--
-- TOC entry 3259 (class 1259 OID 24804)
-- Name: idx_reglementation_fulltext; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reglementation_fulltext ON public.reglementation_all USING gin (to_tsvector('french'::regconfig, ((((((COALESCE(titre, ''::text) || ' '::text) || COALESCE(exigence, ''::text)) || ' '::text) || COALESCE(lois, ''::text)) || ' '::text) || COALESCE(documents, ''::text))));


--
-- TOC entry 3260 (class 1259 OID 24802)
-- Name: idx_reglementation_lois; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reglementation_lois ON public.reglementation_all USING btree (lois);


--
-- TOC entry 3261 (class 1259 OID 24801)
-- Name: idx_reglementation_souschapitre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reglementation_souschapitre ON public.reglementation_all USING btree (sous_chapitre);


--
-- TOC entry 3271 (class 2606 OID 24835)
-- Name: audit_conformite fk_reglementation; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_conformite
    ADD CONSTRAINT fk_reglementation FOREIGN KEY (reglementation_id) REFERENCES public.reglementation_all(id) ON DELETE CASCADE;


-- Completed on 2025-09-05 11:44:02

--
-- PostgreSQL database dump complete
--

