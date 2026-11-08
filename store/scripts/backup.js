// Backup & restore for the SQLite database (single-file database).
// Usage:
//   node scripts/backup.js backup    -> copies dev.db to backups/dev.db.<timestamp>
//   node scripts/backup.js restore <backup-file> -> replaces dev.db with backup
//   node scripts/backup.js verify    -> runs migrations + seed idempotently
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const DB_FILE = path.resolve(process.cwd(), 'dev.db')
const BACKUP_DIR = path.resolve(process.cwd(), 'backups')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function backup() {
  ensureDir(BACKUP_DIR)
  if (!fs.existsSync(DB_FILE)) {
    console.error('No dev.db found to back up. Run `npm run db:migrate` first.')
    process.exit(1)
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const dest = path.join(BACKUP_DIR, `dev.db.${stamp}`)
  fs.copyFileSync(DB_FILE, dest)
  console.log(`Backup created: ${dest}`)
}

function restore(backupFile) {
  const src = path.resolve(process.cwd(), backupFile)
  if (!fs.existsSync(src)) {
    console.error(`Backup file not found: ${src}`)
    process.exit(1)
  }
  fs.copyFileSync(src, DB_FILE)
  console.log(`Restored ${DB_FILE} from ${src}`)
}

function verify() {
  const { runMigrations } = require('../src/lib/db')
  const { applied } = runMigrations()
  console.log(`Verification OK. Migrations applied: ${applied.length}`)
}

const cmd = process.argv[2]
if (cmd === 'backup') backup()
else if (cmd === 'restore') restore(process.argv[3])
else if (cmd === 'verify') verify()
else {
  console.log('Usage: node scripts/backup.js [backup|restore <file>|verify]')
  process.exit(2)
}
