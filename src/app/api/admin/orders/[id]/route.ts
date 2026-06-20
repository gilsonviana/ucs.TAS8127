import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

const updateSchema = z.object({
  status: z.enum(["pending", "fulfilled"]),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req, "admin");
  if (isAuthError(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { status } = parsed.data;
  const orderId = parseInt(params.id);

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  const db = getDb();
  const order = db.prepare("SELECT id FROM orders WHERE id = ?").get(orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, orderId);

  return NextResponse.json({ success: true });
}
