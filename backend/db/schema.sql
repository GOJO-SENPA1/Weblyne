-- Weblyne database schema
-- Postgres 14+

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─────────────────────────────────────────────
-- admins: who can sign in to /admin
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- contacts: project enquiries from /contact
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  service     TEXT,
  budget      TEXT,
  description TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new'
              CHECK (status IN ('new', 'replied', 'archived')),
  ip          TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts (status);
CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON contacts (created_at DESC);

-- ─────────────────────────────────────────────
-- newsletter
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter (
  id         SERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────
-- portfolio
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  category     TEXT NOT NULL,
  client_name  TEXT,
  tech_stack   TEXT[] NOT NULL DEFAULT '{}',
  image_url    TEXT,
  live_url     TEXT,
  challenge    TEXT,
  approach     TEXT,
  results      TEXT,
  featured     BOOLEAN NOT NULL DEFAULT false,
  published    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS portfolio_category_idx ON portfolio (category);
CREATE INDEX IF NOT EXISTS portfolio_featured_idx ON portfolio (featured) WHERE featured;

-- ─────────────────────────────────────────────
-- blog
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  body          TEXT NOT NULL,
  category      TEXT,
  author        TEXT,
  read_time     TEXT,
  image_url     TEXT,
  published     BOOLEAN NOT NULL DEFAULT true,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS blog_slug_idx ON blog (slug);
CREATE INDEX IF NOT EXISTS blog_published_idx ON blog (published, published_at DESC);
