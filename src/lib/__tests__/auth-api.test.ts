/**
 * Integration tests for auth API logic (register + login flows).
 * Tests the core functions directly, bypassing HTTP.
 */
import { describe, it, expect, beforeEach } from "vitest";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import { runMigrations } from "@/db/migrations";
import { signToken, verifyToken } from "@/lib/jwt";

function makeDb() {
  const db = new Database(":memory:");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}

describe("Register flow", () => {
  it("inserts a customer and returns a verifiable token", async () => {
    const db = makeDb();
    const hash = await bcrypt.hash("password123", 10);
    const result = db
      .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')")
      .run("Alice", "alice@example.com", hash);

    const token = signToken({ sub: result.lastInsertRowid as number, email: "alice@example.com", role: "customer" });
    const payload = verifyToken(token);

    expect(payload.email).toBe("alice@example.com");
    expect(payload.role).toBe("customer");
  });

  it("rejects duplicate email", async () => {
    const db = makeDb();
    const hash = await bcrypt.hash("password123", 10);
    db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run("Alice", "a@example.com", hash);

    expect(() =>
      db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run("Alice2", "a@example.com", hash)
    ).toThrow();
  });
});

describe("Login flow", () => {
  it("verifies correct credentials and produces a valid token", async () => {
    const db = makeDb();
    const hash = await bcrypt.hash("secret", 10);
    db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')").run("Bob", "bob@example.com", hash);

    const user = db.prepare("SELECT id, email, password_hash, role FROM users WHERE email = ?").get("bob@example.com") as {
      id: number; email: string; password_hash: string; role: "customer" | "admin";
    };

    const valid = await bcrypt.compare("secret", user.password_hash);
    expect(valid).toBe(true);

    const token = signToken({ sub: user.id, email: user.email, role: user.role });
    expect(verifyToken(token).sub).toBe(user.id);
  });

  it("rejects wrong password", async () => {
    const db = makeDb();
    const hash = await bcrypt.hash("correct", 10);
    db.prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)").run("Carol", "carol@example.com", hash);

    const user = db.prepare("SELECT password_hash FROM users WHERE email = ?").get("carol@example.com") as { password_hash: string };
    const valid = await bcrypt.compare("wrong", user.password_hash);
    expect(valid).toBe(false);
  });
});

describe("Admin role guard", () => {
  it("denies admin login for customer accounts", async () => {
    const db = makeDb();
    const hash = await bcrypt.hash("pass", 10);
    db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')").run("Dave", "dave@example.com", hash);

    const user = db
      .prepare("SELECT id FROM users WHERE email = ? AND role = 'admin'")
      .get("dave@example.com");
    expect(user).toBeUndefined();
  });

  it("allows admin login for admin accounts", async () => {
    const db = makeDb();
    const hash = await bcrypt.hash("adminpass", 10);
    db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')").run("Admin", "admin@example.com", hash);

    const user = db
      .prepare("SELECT id FROM users WHERE email = ? AND role = 'admin'")
      .get("admin@example.com");
    expect(user).toBeDefined();
  });
});
