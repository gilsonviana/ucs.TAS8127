import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db/client";
import { requireAuth, isAuthError } from "@/lib/auth";

const itemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

const schema = z.object({
  paymentMethod: z.enum(["credit_card", "debit_card", "pix", "bank_slip"]),
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { paymentMethod, items } = parsed.data;
  const db = getDb();

  // Verify all products exist and compute total
  let total = 0;
  const resolvedItems: { productId: number; quantity: number; unitPrice: number }[] = [];

  for (const item of items) {
    const product = db
      .prepare("SELECT id, price, stock FROM products WHERE id = ?")
      .get(item.productId) as { id: number; price: number; stock: number } | undefined;

    if (!product) {
      return NextResponse.json(
        { error: `Product ${item.productId} not found` },
        { status: 404 }
      );
    }

    total += product.price * item.quantity;
    resolvedItems.push({ productId: item.productId, quantity: item.quantity, unitPrice: product.price });
  }

  const createOrder = db.transaction(() => {
    const order = db
      .prepare(
        "INSERT INTO orders (user_id, payment_method, total) VALUES (?, ?, ?)"
      )
      .run(auth.sub, paymentMethod, total);

    const orderId = order.lastInsertRowid as number;

    const insertItem = db.prepare(
      "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)"
    );

    for (const item of resolvedItems) {
      insertItem.run(orderId, item.productId, item.quantity, item.unitPrice);
    }

    return orderId;
  });

  const orderId = createOrder();
  return NextResponse.json({ orderId, total }, { status: 201 });
}

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isAuthError(auth)) return auth;

  const db = getDb();

  const orders = db
    .prepare(
      `SELECT o.id, o.payment_method, o.total, o.status, o.created_at
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`
    )
    .all(auth.sub) as {
      id: number;
      payment_method: string;
      total: number;
      status: string;
      created_at: string;
    }[];

  const getItems = db.prepare(
    `SELECT oi.product_id, oi.quantity, oi.unit_price, p.name, p.image_url
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?`
  );

  const result = orders.map((order) => ({
    ...order,
    items: getItems.all(order.id) as {
      product_id: number;
      quantity: number;
      unit_price: number;
      name: string;
      image_url: string | null;
    }[],
  }));

  return NextResponse.json(result);
}
