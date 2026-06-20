import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

const toNumber = (val: unknown) => (val === "" || val === undefined ? undefined : Number(val));

const schema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.preprocess(toNumber, z.number().positive().optional()),
  imageUrl: z.string().url().optional().or(z.literal("")).optional(),
  categoryId: z.preprocess(toNumber, z.number().int().optional()),
  stock: z.preprocess(toNumber, z.number().int().min(0).optional()),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare("SELECT id FROM products WHERE id = ?").get(Number(id));
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { name, description, price, imageUrl, categoryId, stock } = parsed.data;
  const fields: string[] = [];
  const values: unknown[] = [];

  if (name !== undefined) { fields.push("name = ?"); values.push(name); }
  if (description !== undefined) { fields.push("description = ?"); values.push(description); }
  if (price !== undefined) { fields.push("price = ?"); values.push(price); }
  if (imageUrl !== undefined) { fields.push("image_url = ?"); values.push(imageUrl || null); }
  if (categoryId !== undefined) { fields.push("category_id = ?"); values.push(categoryId); }
  if (stock !== undefined) { fields.push("stock = ?"); values.push(stock); }

  if (fields.length === 0) return NextResponse.json({ success: true });

  values.push(Number(id));
  db.prepare(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const db = getDb();
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(Number(id));

  if (result.changes === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
