import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const db = getDb();
  const orders = db
    .prepare(
      `SELECT o.id, o.payment_method, o.total, o.status, o.created_at,
              u.name AS user_name, u.email AS user_email
       FROM orders o
       JOIN users u ON u.id = o.user_id
       ORDER BY o.created_at DESC`
    )
    .all() as {
      id: number;
      payment_method: string;
      total: number;
      status: string;
      created_at: string;
      user_name: string;
      user_email: string;
    }[];

  return NextResponse.json(orders);
}
