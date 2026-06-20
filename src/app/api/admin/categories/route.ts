import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

const schema = z.object({ name: z.string().min(1) });

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;
  const db = getDb();
  const categories = db
    .prepare("SELECT id, name FROM categories ORDER BY name ASC")
    .all();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const db = getDb();
  try {
    const result = db
      .prepare("INSERT INTO categories (name) VALUES (?)")
      .run(parsed.data.name);
    return NextResponse.json(
      { id: result.lastInsertRowid, name: parsed.data.name },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Category already exists" }, { status: 409 });
  }
}
