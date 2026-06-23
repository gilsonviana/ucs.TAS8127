#!/bin/sh
set -e

DB_DIR="${DB_DIR:-/app/data}"
DB_FILE="$DB_DIR/techstore.db"

# First-run detection: seed if the database does not exist yet
if [ ! -f "$DB_FILE" ]; then
  echo "[entrypoint] No database found at $DB_FILE — running seed..."
  if ! node_modules/.bin/tsx src/db/seed.ts; then
    echo "[entrypoint] ❌ Seed failed!"
    exit 1
  fi
  echo "[entrypoint] ✓ Seed complete."
else
  echo "[entrypoint] ✓ Database exists — skipping seed."
fi

echo "[entrypoint] Starting Next.js..."
exec node server.js
