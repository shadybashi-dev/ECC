// Run pending SQL migrations. Usage: node scripts/migrate.js
require('dotenv').config()
const { runMigrations } = require('../src/lib/db')
const { applied } = runMigrations()
console.log(`Migrations applied: ${applied.length} — ${applied.join(', ') || '(none pending)'}`)
