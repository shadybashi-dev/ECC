-- MALIK & OTB — initial schema (SQLite for local dev; portable to PostgreSQL)
-- Money columns store minor units (cents, INTEGER).
-- Timestamps are ISO-8601 UTC text.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Roles: CUSTOMER | OPERATOR | ADMIN
CREATE TABLE IF NOT EXISTS users (
  id           TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email        TEXT NOT NULL UNIQUE,
  name         TEXT,
  password_hash TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER','OPERATOR','ADMIN')),
  email_verified TEXT,
  image        TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  token     TEXT NOT NULL UNIQUE,
  user_id   TEXT NOT NULL,
  expires   TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires);

-- Product categories
CREATE TABLE IF NOT EXISTS categories (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active   INTEGER NOT NULL DEFAULT 1,
  sort        INTEGER NOT NULL DEFAULT 0,
  seo_title   TEXT,
  seo_desc    TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Products. status: DRAFT | ACTIVE | ARCHIVED. testData=1 => test fixture: noindex, not purchasable.
CREATE TABLE IF NOT EXISTS products (
  id                 TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name               TEXT NOT NULL,
  slug               TEXT NOT NULL UNIQUE,
  description        TEXT,
  short_desc         TEXT,
  sku                TEXT UNIQUE,
  status             TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT','ACTIVE','ARCHIVED')),
  track_inventory    INTEGER NOT NULL DEFAULT 1,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  base_price_cents   INTEGER NOT NULL DEFAULT 0,
  weight_kg          REAL,
  dimensions_cm      TEXT,
  materials          TEXT,
  care               TEXT,
  usage              TEXT,
  restrictions       TEXT,
  shipping_info      TEXT,
  return_info        TEXT,
  seo_title          TEXT,
  seo_description    TEXT,
  is_featured        INTEGER NOT NULL DEFAULT 0,
  test_data          INTEGER NOT NULL DEFAULT 0,
  created_by_id      TEXT,
  published_at       TEXT,
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT NOT NULL DEFAULT (datetime('now')),
  category_id        TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (created_by_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_test_data ON products(test_data);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  product_id TEXT NOT NULL,
  url       TEXT NOT NULL,
  alt       TEXT,
  position  INTEGER NOT NULL DEFAULT 0,
  is_primary INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

-- Product variants (SKU level). barCode = GTIN only when actually supplied by vendor.
CREATE TABLE IF NOT EXISTS variants (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  product_id  TEXT NOT NULL,
  sku         TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  price_adj_cents INTEGER NOT NULL DEFAULT 0,
  stock       INTEGER NOT NULL DEFAULT 0,
  reserved    INTEGER NOT NULL DEFAULT 0,
  is_default  INTEGER NOT NULL DEFAULT 0,
  bar_code    TEXT UNIQUE,
  weight_kg   REAL,
  active      INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_sku ON variants(sku);
CREATE INDEX IF NOT EXISTS idx_variants_barcode ON variants(bar_code);

-- Shopping carts (authenticated or anonymous by session)
CREATE TABLE IF NOT EXISTS carts (
  id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id   TEXT,
  session_id TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_carts_session ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_carts_user ON carts(user_id);

CREATE TABLE IF NOT EXISTS cart_items (
  id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  cart_id   TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  quantity  INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES variants(id),
  UNIQUE (cart_id, variant_id)
);

-- Orders. Monetary values in cents at time of purchase (snapshot).
CREATE TABLE IF NOT EXISTS orders (
  id                   TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  order_number         TEXT NOT NULL UNIQUE,
  user_id              TEXT,
  email                TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED')),
  payment_status       TEXT NOT NULL DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID','PAID','PARTIALLY_REFUNDED','REFUNDED','FAILED')),
  fulfillment_status   TEXT NOT NULL DEFAULT 'UNFULFILLED' CHECK (fulfillment_status IN ('UNFULFILLED','PENDING','PARTIAL','FULFILLED')),
  subtotal_cents       INTEGER NOT NULL DEFAULT 0,
  tax_cents            INTEGER NOT NULL DEFAULT 0,
  shipping_cents       INTEGER NOT NULL DEFAULT 0,
  discount_cents       INTEGER NOT NULL DEFAULT 0,
  total_cents          INTEGER NOT NULL DEFAULT 0,
  currency             TEXT NOT NULL DEFAULT 'USD',
  stripe_payment_intent_id TEXT,
  stripe_charge_id     TEXT,
  idempotency_key      TEXT,
  billing_address      TEXT,
  shipping_address     TEXT,
  notes                TEXT,
  created_at           TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

CREATE TABLE IF NOT EXISTS order_items (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  order_id      TEXT NOT NULL,
  variant_id    TEXT,
  product_id    TEXT NOT NULL,
  sku           TEXT NOT NULL,
  name          TEXT NOT NULL,
  quantity      INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL DEFAULT 0,
  price_adj_cents   INTEGER NOT NULL DEFAULT 0,
  total_cents     INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES variants(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Audit log for privileged actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  actor_id  TEXT,
  action    TEXT NOT NULL,
  entity    TEXT NOT NULL,
  entity_id TEXT,
  metadata  TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (actor_id) REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs(actor_id);

-- Key / value settings
CREATE TABLE IF NOT EXISTS settings (
  id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  key       TEXT NOT NULL UNIQUE,
  value     TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
