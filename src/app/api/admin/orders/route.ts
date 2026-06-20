import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const status = req.nextUrl.searchParams.get("status");
  const sortBy = req.nextUrl.searchParams.get("sortBy") || "date";

  let query = `SELECT o.id, o.payment_method, o.total, o.status, o.created_at,
              u.name AS user_name, u.email AS user_email
       FROM orders o
       JOIN users u ON u.id = o.user_id`;

  if (status && (status === "pending" || status === "fulfilled")) {
    query += ` WHERE o.status = '${status}'`;
  }

  if (sortBy === "date") {
    query += ` ORDER BY o.created_at DESC`;
  } else if (sortBy === "total") {
    query += ` ORDER BY o.total DESC`;
  } else {
    query += ` ORDER BY o.created_at DESC`;
  }

  const db = getDb();
  const orders = db.prepare(query).all() as {
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
