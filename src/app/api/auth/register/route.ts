import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getDb } from "@/db/client";
import { signToken } from "@/lib/jwt";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;
  const db = getDb();

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = db
    .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'customer')")
    .run(name, email, passwordHash);

  const token = signToken({
    sub: result.lastInsertRowid as number,
    email,
    role: "customer",
  });

  return NextResponse.json({ token }, { status: 201 });
}
