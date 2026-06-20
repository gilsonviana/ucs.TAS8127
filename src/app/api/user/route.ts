import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const db = getDb();
  const user = db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(auth.sub);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name } = parsed.data;
  const db = getDb();

  db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, auth.sub);

  return NextResponse.json({ success: true });
}
