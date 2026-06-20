import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getDb } from "@/db/client";
import { signToken } from "@/lib/jwt";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "customer" | "admin";
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const db = getDb();

  const user = db
    .prepare("SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND role = 'admin'")
    .get(email) as UserRow | undefined;

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ sub: user.id, email: user.email, role: "admin" });
  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
