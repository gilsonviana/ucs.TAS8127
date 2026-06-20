import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

const toNumber = (val: unknown) => (val === "" || val === undefined ? undefined : Number(val));

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.preprocess(toNumber, z.number().positive()),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
  categoryId: z.preprocess(toNumber, z.number().int().optional()),
  stock: z.preprocess(toNumber, z.number().int().min(0)),
});

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const db = getDb();
  const products = db
    .prepare(
      `SELECT p.id, p.name, p.description, p.price, p.image_url, p.stock,
              p.category_id, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON c.id = p.category_id
       ORDER BY p.created_at DESC`
    )
    .all();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, description, price, imageUrl, categoryId, stock } = parsed.data;
  const db = getDb();
  const result = db
    .prepare(
      "INSERT INTO products (name, description, price, image_url, category_id, stock) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(name, description ?? null, price, imageUrl || null, categoryId ?? null, stock);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}
