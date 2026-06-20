import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

const schema = z.object({ name: z.string().min(1) });

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
  const result = db
    .prepare("UPDATE categories SET name = ? WHERE id = ?")
    .run(parsed.data.name, Number(id));

  if (result.changes === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ id: Number(id), name: parsed.data.name });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const { id } = await params;
  const db = getDb();
  const result = db
    .prepare("DELETE FROM categories WHERE id = ?")
    .run(Number(id));

  if (result.changes === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
