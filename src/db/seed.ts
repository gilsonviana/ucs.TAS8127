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
const moboaCat = db.prepare("SELECT id FROM categories WHERE name = ?").get("Placa Mãe") as { id: number };
const storageCat = db.prepare("SELECT id FROM categories WHERE name = ?").get("Armazenamento") as { id: number };
const periCat = db.prepare("SELECT id FROM categories WHERE name = ?").get("Periféricos") as { id: number };
const coolerCat = db.prepare("SELECT id FROM categories WHERE name = ?").get("Cooler") as { id: number };
const caseCat = db.prepare("SELECT id FROM categories WHERE name = ?").get("Gabinetes") as { id: number };

const products = [
  // Processadores (CPUs)
  { name: "Ryzen 9 7950X", description: "AMD Ryzen 9 7950X 16-Core 32-Thread", price: 549.99, category_id: cpuCat.id, stock: 12 },
  { name: "Core i9-14900K", description: "Intel Core i9-14900K 24-Core 32-Thread", price: 499.99, category_id: cpuCat.id, stock: 10 },
  { name: "Ryzen 7 7700X", description: "AMD Ryzen 7 7700X 8-Core 16-Thread", price: 349.99, category_id: cpuCat.id, stock: 18 },
  { name: "Core i7-14700K", description: "Intel Core i7-14700K 20-Core 28-Thread", price: 409.99, category_id: cpuCat.id, stock: 15 },
  { name: "Ryzen 5 7600X", description: "AMD Ryzen 5 7600X 6-Core 12-Thread", price: 229.99, category_id: cpuCat.id, stock: 25 },

  // Placa Mãe (Motherboards)
  { name: "ASUS ROG STRIX X870-E-E Gaming", description: "AM5 Socket LGA1718, DDR5, PCIe 5.0", price: 399.99, category_id: moboaCat.id, stock: 8 },
  { name: "MSI MPG B850 Edge WiFi", description: "AM5 Socket, DDR5 Support, WiFi 6E", price: 289.99, category_id: moboaCat.id, stock: 14 },
  { name: "Gigabyte Z790 Aorus Elite", description: "LGA1700 Socket, DDR5, PCIe 5.0", price: 249.99, category_id: moboaCat.id, stock: 12 },
  { name: "ASRock Z890 Creator", description: "LGA1851 Socket, DDR5 Support", price: 329.99, category_id: moboaCat.id, stock: 9 },
  { name: "ASUS TUF Gaming B850M-Plus", description: "AM5 Micro-ATX, DDR5, WiFi", price: 179.99, category_id: moboaCat.id, stock: 20 },

  // Memórias (RAM)
  { name: "Corsair Vengeance DDR5 32GB", description: "DDR5 6000MHz CL36 Kit", price: 129.99, category_id: memCat.id, stock: 50 },
  { name: "G.Skill Trident Z5 64GB", description: "DDR5 6400MHz CL32 Kit", price: 239.99, category_id: memCat.id, stock: 20 },
  { name: "Kingston Fury Beast DDR5 48GB", description: "DDR5 5600MHz CL40 Kit", price: 169.99, category_id: memCat.id, stock: 22 },
  { name: "Crucial Ballistix DDR5 32GB", description: "DDR5 5600MHz CL32 Kit", price: 119.99, category_id: memCat.id, stock: 35 },
  { name: "Neo Forza Flair DDR5 32GB", description: "DDR5 6000MHz CL36 RGB Kit", price: 139.99, category_id: memCat.id, stock: 28 },

  // Armazenamento (Storage)
  { name: "Samsung 990 Pro 2TB", description: "NVMe SSD PCIe 4.0, 7100MB/s", price: 189.99, category_id: storageCat.id, stock: 30 },
  { name: "WD Black SN850X 4TB", description: "NVMe SSD PCIe 4.0, 7100MB/s", price: 349.99, category_id: storageCat.id, stock: 15 },
  { name: "Crucial P5 Plus 2TB", description: "NVMe SSD PCIe 4.0, 6600MB/s", price: 169.99, category_id: storageCat.id, stock: 25 },
  { name: "Seagate Barracuda 4TB", description: "3.5\" HDD 5400RPM, 256MB Cache", price: 89.99, category_id: storageCat.id, stock: 40 },
  { name: "Western Digital Red Plus 8TB", description: "3.5\" NAS HDD, 7200RPM", price: 179.99, category_id: storageCat.id, stock: 18 },

  // GPUs (Graphics Cards)
  { name: "RTX 4070 Ti", description: "NVIDIA GeForce RTX 4070 Ti 12GB GDDR6X", price: 799.99, category_id: gpuCat.id, stock: 15 },
  { name: "RX 7900 XTX", description: "AMD Radeon RX 7900 XTX 24GB GDDR6", price: 949.99, category_id: gpuCat.id, stock: 8 },
  { name: "RTX 4070", description: "NVIDIA GeForce RTX 4070 12GB GDDR6X", price: 599.99, category_id: gpuCat.id, stock: 20 },
  { name: "RX 7900 XT", description: "AMD Radeon RX 7900 XT 20GB GDDR6", price: 749.99, category_id: gpuCat.id, stock: 12 },
  { name: "RTX 4060 Ti", description: "NVIDIA GeForce RTX 4060 Ti 8GB GDDR6", price: 399.99, category_id: gpuCat.id, stock: 32 },

  // Periféricos (Peripherals)
  { name: "Logitech MX Master 3S", description: "Wireless Mouse, 8K DPI, Multi-Device", price: 99.99, category_id: periCat.id, stock: 45 },
  { name: "Corsair K95 Platinum XT", description: "Mechanical Keyboard, RGB, Cherry MX", price: 199.99, category_id: periCat.id, stock: 22 },
  { name: "SteelSeries Arctis Pro", description: "Wireless Headset, Hi-Res Audio", price: 329.99, category_id: periCat.id, stock: 18 },
  { name: "BenQ EW2780U Monitor", description: "27\" 4K USB-C, 60Hz IPS", price: 399.99, category_id: periCat.id, stock: 10 },
  { name: "Razer DeathAdder V3", description: "Gaming Mouse, 30000 DPI, Wireless", price: 69.99, category_id: periCat.id, stock: 55 },

  // Cooler (CPU/Case Cooling)
  { name: "Noctua NH-D15", description: "Tower Air Cooler, Dual Fans, 170mm", price: 99.99, category_id: coolerCat.id, stock: 28 },
  { name: "NZXT Kraken X73", description: "360mm Liquid Cooler, RGB, WiFi Control", price: 179.99, category_id: coolerCat.id, stock: 15 },
  { name: "Corsair H150i Elite", description: "360mm Liquid Cooler, iCUE RGB", price: 189.99, category_id: coolerCat.id, stock: 12 },
  { name: "be quiet! Dark Rock Pro 4", description: "Tower Air Cooler, Dual Fans, Silent", price: 89.99, category_id: coolerCat.id, stock: 32 },
  { name: "Lian Li Galahad 360", description: "360mm Liquid Cooler, ARGB", price: 129.99, category_id: coolerCat.id, stock: 20 },

  // Gabinetes (Cases)
  { name: "NZXT H7 Flow", description: "Mid-Tower ATX, 3x Front 120mm Fans", price: 139.99, category_id: caseCat.id, stock: 18 },
  { name: "Corsair 5000T RGB", description: "Full Tower ATX, 6x RGB Fans, Tempered Glass", price: 299.99, category_id: caseCat.id, stock: 9 },
  { name: "Lian Li Lancool 216", description: "Mid-Tower ATX, 2x Fans, Mesh Front", price: 79.99, category_id: caseCat.id, stock: 35 },
  { name: "Fractal Design North", description: "Mid-Tower ATX, Minimalist Design", price: 139.99, category_id: caseCat.id, stock: 16 },
  { name: "Phanteks Eclipse P500A", description: "Mid-Tower ATX, 3x DRGB Fans", price: 109.99, category_id: caseCat.id, stock: 28 },
];

for (const p of products) {
  db.prepare(
    "INSERT OR IGNORE INTO products (name, description, price, category_id, stock) VALUES (?, ?, ?, ?, ?)"
  ).run(p.name, p.description, p.price, p.category_id, p.stock);
}
console.log("Products seeded.");

console.log("Seed complete.");
