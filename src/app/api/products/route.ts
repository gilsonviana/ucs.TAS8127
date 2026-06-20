import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";

export interface ProductRow {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: number | null;
  category_name: string | null;
  stock: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search")?.trim() ?? "";
  const categoryId = searchParams.get("category");

  const db = getDb();

  let sql = `
    SELECT p.id, p.name, p.description, p.price, p.image_url, p.stock,
           p.category_id, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (search) {
    sql += " AND p.name LIKE ?";
    params.push(`%${search}%`);
  }

  if (categoryId) {
    sql += " AND p.category_id = ?";
    params.push(Number(categoryId));
  }

  sql += " ORDER BY p.created_at DESC";

  const products = db.prepare(sql).all(...params) as ProductRow[];
  return NextResponse.json(products);
}
