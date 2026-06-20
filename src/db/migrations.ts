import Database from "better-sqlite3";

const migrations: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    payment_method TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,

  `CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price REAL NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version INTEGER NOT NULL UNIQUE,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];

export function runMigrations(db: Database.Database): void {
  db.exec(migrations[migrations.length - 1]); // ensure migrations table exists

  const applied = db
    .prepare("SELECT version FROM migrations")
    .all() as { version: number }[];
  const appliedVersions = new Set(applied.map((r) => r.version));

  const insert = db.prepare(
    "INSERT INTO migrations (version) VALUES (?)"
  );

  const runAll = db.transaction(() => {
    migrations.slice(0, -1).forEach((sql, i) => {
      if (!appliedVersions.has(i)) {
        db.exec(sql);
        insert.run(i);
      }
    });
    // also run the migrations table creation migration if not tracked
    if (!appliedVersions.has(migrations.length - 1)) {
      insert.run(migrations.length - 1);
    }
  });

  runAll();
}
