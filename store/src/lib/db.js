require('dotenv').config()
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

function resolveDbFile(databaseUrl) {
  if (databaseUrl.startsWith('file:')) {
    const filePath = databaseUrl.slice('file:'.length);
    return path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  }
  throw new Error(`Unsupported DATABASE_URL: ${databaseUrl}`);
}

let dbInstance = null;
let migrationsRun = false;

function getDb() {
  if (dbInstance) return dbInstance;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }
  const dbFile = resolveDbFile(databaseUrl);
  const db = new Database(dbFile);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  if (!migrationsRun) {
    executeMigrations(db);
    migrationsRun = true;
  }
  dbInstance = db;
  return db;
}

function closeDb() {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    migrationsRun = false;
  }
}

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'migrations');

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

function executeMigrations(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    name      TEXT NOT NULL UNIQUE,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  const applied = new Set(db.prepare('SELECT name FROM schema_migrations').pluck().all());
  const toApply = listMigrationFiles().filter((f) => !applied.has(f));
  const tx = db.transaction(() => {
    for (const file of toApply) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      db.exec(sql);
      db.prepare('INSERT INTO schema_migrations (name) VALUES (?)').run(file);
    }
  });
  tx();
  return { applied: toApply };
}

function runMigrations() {
  return executeMigrations(getDb());
}

module.exports = { getDb, closeDb, runMigrations, listMigrationFiles, executeMigrations };
