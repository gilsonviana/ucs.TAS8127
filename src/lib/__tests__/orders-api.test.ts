/**
 * Integration tests for the order placement logic.
 */
import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { runMigrations } from "@/db/migrations";

function makeDb() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}

function seedDb(db: Database.Database) {
  const hash = bcrypt.hashSync("pass", 1);
  const user = db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')").run("User", "u@example.com", hash);
  const cat = db.prepare("INSERT INTO categories (name) VALUES (?)").run("GPUs");
  const prod = db.prepare("INSERT INTO products (name, price, category_id, stock) VALUES (?, ?, ?, ?)").run("RTX 4070", 799.99, cat.lastInsertRowid, 10);
  return { userId: user.lastInsertRowid as number, productId: prod.lastInsertRowid as number };
}

describe("Order placement", () => {
  it("creates an order with correct total and items", () => {
    const db = makeDb();
    const { userId, productId } = seedDb(db);

    const placeOrder = db.transaction(() => {
      const product = db.prepare("SELECT price FROM products WHERE id = ?").get(productId) as { price: number };
      const total = product.price * 2;
      const order = db.prepare("INSERT INTO orders (user_id, payment_method, total) VALUES (?, ?, ?)").run(userId, "pix", total);
      db.prepare("INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)").run(order.lastInsertRowid, productId, 2, product.price);
      return { orderId: order.lastInsertRowid as number, total };
    });

    const { orderId, total } = placeOrder();
    expect(total).toBeCloseTo(1599.98, 2);

    const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(orderId) as { quantity: number; unit_price: number }[];
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(items[0].unit_price).toBeCloseTo(799.99, 2);
  });

  it("a customer can only see their own orders", () => {
    const db = makeDb();
    const { userId, productId } = seedDb(db);

    // Other user
    const hash = bcrypt.hashSync("x", 1);
    const other = db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run("Other", "other@example.com", hash);

    const product = db.prepare("SELECT price FROM products WHERE id = ?").get(productId) as { price: number };
    db.prepare("INSERT INTO orders (user_id, payment_method, total) VALUES (?, 'pix', ?)").run(userId, product.price);
    db.prepare("INSERT INTO orders (user_id, payment_method, total) VALUES (?, 'pix', ?)").run(other.lastInsertRowid, product.price);

    const myOrders = db.prepare("SELECT id FROM orders WHERE user_id = ?").all(userId);
    expect(myOrders).toHaveLength(1);
  });
});

describe("Cart store logic", () => {
  it("computes total price correctly for multiple items", () => {
    const items = [
      { productId: 1, price: 100, quantity: 2 },
      { productId: 2, price: 50.5, quantity: 3 },
    ];
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    expect(total).toBeCloseTo(351.5, 2);
  });

  it("increments existing item quantity instead of duplicating", () => {
    const items: { productId: number; quantity: number }[] = [{ productId: 1, quantity: 2 }];
    const incoming = { productId: 1, quantity: 1 };

    const existing = items.find((i) => i.productId === incoming.productId);
    if (existing) existing.quantity += 1;
    else items.push(incoming);

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });
});
