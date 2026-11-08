// Seed initial reference data (admin user + root category).
// Safe to re-run: idempotent by unique constraints.
require('dotenv').config()
require('../lib/db')
const { getDb } = require('../lib/db')
const bcrypt = require('bcryptjs')

const db = getDb()
const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@malikotb.test'
const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'ChangeMe123!'

const insertUser = db.prepare(
  `INSERT OR IGNORE INTO users (email, name, password_hash, role)
   VALUES (?, ?, ?, 'ADMIN')`
)
const hash = bcrypt.hashSync(adminPassword, 10)
const info = insertUser.run(adminEmail, 'Store Administrator', hash)
console.log(`Seeded admin user: ${adminEmail} (changes: ${info.changes})`)

db.prepare(
  `INSERT OR IGNORE INTO categories (name, slug, description, sort, seo_title, seo_desc)
   VALUES ('General', 'general', 'General merchandise', 0, 'General — MALIK & OTB', 'Browse the general catalog at MALIK & OTB')`
).run()

console.log('Seed complete. Sign in with the admin email above.')
console.log('NOTE: change ADMIN_SEED_PASSWORD before staging/production.')
