import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  return NextResponse.json({ count: row.count });
}
