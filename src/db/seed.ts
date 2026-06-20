/**
 * Run with: npx tsx src/db/seed.ts
 * Seeds initial categories, products, and admin user.
 */
import { getDb } from "./client";
import bcrypt from "bcryptjs";

const db = getDb();

// Admin user
const adminExists = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@techstore.com");
if (!adminExists) {
  const hash = bcrypt.hashSync("admin1234", 10);
  db.prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
  ).run("Admin", "admin@techstore.com", hash, "admin");
  console.log("Admin user created: admin@techstore.com / admin1234");
}

// Categories
const categoryNames = ["Processadores", "Placa Mãe", "Memórias", "Armazenamento", "GPUs", "Periféricos", "Cooler", "Gabinetes"];
for (const name of categoryNames) {
  db.prepare("INSERT OR IGNORE INTO categories (name) VALUES (?)").run(name);
}
console.log("Categories seeded.");

// Sample products
const gpuCat = db.prepare("SELECT id FROM categories WHERE name = ?").get("GPUs") as { id: number };
const memCat = db.prepare("SELECT id FROM categories WHERE name = ?").get("Memórias") as { id: number };
const cpuCat = db.prepare("SELECT id FROM categories WHERE name = ?").get("Processadores") as { id: number };

const products = [
  { name: "RTX 4070 Ti", description: "NVIDIA GeForce RTX 4070 Ti 12GB", price: 799.99, category_id: gpuCat.id, stock: 15 },
  { name: "RX 7900 XTX", description: "AMD Radeon RX 7900 XTX 24GB", price: 949.99, category_id: gpuCat.id, stock: 8 },
  { name: "Corsair Vengeance DDR5 32GB", description: "DDR5 6000MHz CL36", price: 129.99, category_id: memCat.id, stock: 50 },
  { name: "G.Skill Trident Z5 64GB", description: "DDR5 6400MHz CL32", price: 239.99, category_id: memCat.id, stock: 20 },
  { name: "Ryzen 9 7950X", description: "AMD Ryzen 9 7950X 16-Core", price: 549.99, category_id: cpuCat.id, stock: 12 },
  { name: "Core i9-14900K", description: "Intel Core i9-14900K 24-Core", price: 499.99, category_id: cpuCat.id, stock: 10 },
];

for (const p of products) {
  db.prepare(
    "INSERT OR IGNORE INTO products (name, description, price, category_id, stock) VALUES (?, ?, ?, ?, ?)"
  ).run(p.name, p.description, p.price, p.category_id, p.stock);
}
console.log("Products seeded.");

console.log("Seed complete.");
