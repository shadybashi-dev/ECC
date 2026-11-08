-- MALIK & OTB — n8n webhook log (audit-only, no financial actions)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schema_migrations (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL UNIQUE,
  applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS n8n_webhooks (
  id        TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  topic     TEXT NOT NULL,
  payload   TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_n8n_topic ON n8n_webhooks(topic);
CREATE INDEX IF NOT EXISTS idx_n8n_received ON n8n_webhooks(received_at);
