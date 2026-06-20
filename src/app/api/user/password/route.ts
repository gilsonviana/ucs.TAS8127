import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function PATCH(req: NextRequest) {
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { currentPassword, newPassword } = parsed.data;
  const db = getDb();

  const user = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(auth.sub) as any;

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, auth.sub);

  return NextResponse.json({ success: true });
}
