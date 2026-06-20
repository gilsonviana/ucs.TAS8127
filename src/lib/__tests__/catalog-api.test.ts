/**
 * Integration tests for product catalog queries.
 */
import { describe, it, expect } from "vitest";
import Database from "better-sqlite3";
import { runMigrations } from "@/db/migrations";

function makeDb() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}

function seedCatalog(db: Database.Database) {
  const gpu = db.prepare("INSERT INTO categories (name) VALUES (?)").run("GPUs");
  const mem = db.prepare("INSERT INTO categories (name) VALUES (?)").run("Memory");
  db.prepare("INSERT INTO products (name, price, category_id, stock) VALUES (?, ?, ?, ?)").run("RTX 4070", 799.99, gpu.lastInsertRowid, 10);
  db.prepare("INSERT INTO products (name, price, category_id, stock) VALUES (?, ?, ?, ?)").run("RX 7900", 949.99, gpu.lastInsertRowid, 5);
  db.prepare("INSERT INTO products (name, price, category_id, stock) VALUES (?, ?, ?, ?)").run("DDR5 32GB", 129.99, mem.lastInsertRowid, 50);
  return { gpuId: gpu.lastInsertRowid as number, memId: mem.lastInsertRowid as number };
}

describe("Product catalog", () => {
  it("returns all products with no filters", () => {
    const db = makeDb();
    seedCatalog(db);
    const products = db.prepare("SELECT * FROM products").all();
    expect(products).toHaveLength(3);
  });

  it("filters by category", () => {
    const db = makeDb();
    const { gpuId } = seedCatalog(db);
    const products = db.prepare("SELECT * FROM products WHERE category_id = ?").all(gpuId);
    expect(products).toHaveLength(2);
  });

  it("filters by name search (LIKE)", () => {
    const db = makeDb();
    seedCatalog(db);
    const products = db.prepare("SELECT * FROM products WHERE name LIKE ?").all("%RTX%");
    expect(products).toHaveLength(1);
    expect((products[0] as { name: string }).name).toBe("RTX 4070");
  });

  it("returns empty array when no match", () => {
    const db = makeDb();
    seedCatalog(db);
    const products = db.prepare("SELECT * FROM products WHERE name LIKE ?").all("%NONEXISTENT%");
    expect(products).toHaveLength(0);
  });
});

describe("Category management", () => {
  it("creates and retrieves categories", () => {
    const db = makeDb();
    db.prepare("INSERT INTO categories (name) VALUES (?)").run("Processors");
    db.prepare("INSERT INTO categories (name) VALUES (?)").run("Storage");
    const cats = db.prepare("SELECT name FROM categories ORDER BY name").all() as { name: string }[];
    expect(cats.map((c) => c.name)).toEqual(["Processors", "Storage"]);
  });

  it("updates a category name", () => {
    const db = makeDb();
    const result = db.prepare("INSERT INTO categories (name) VALUES (?)").run("Old Name");
    db.prepare("UPDATE categories SET name = ? WHERE id = ?").run("New Name", result.lastInsertRowid);
    const cat = db.prepare("SELECT name FROM categories WHERE id = ?").get(result.lastInsertRowid) as { name: string };
    expect(cat.name).toBe("New Name");
  });

  it("deletes a category", () => {
    const db = makeDb();
    const result = db.prepare("INSERT INTO categories (name) VALUES (?)").run("To Delete");
    db.prepare("DELETE FROM categories WHERE id = ?").run(result.lastInsertRowid);
    const cat = db.prepare("SELECT id FROM categories WHERE id = ?").get(result.lastInsertRowid);
    expect(cat).toBeUndefined();
  });
});
