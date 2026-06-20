import { NextResponse } from "next/server";
import { getDb } from "@/db/client";

export interface CategoryRow {
  id: number;
  name: string;
}

export async function GET() {
  const db = getDb();
  const categories = db
    .prepare("SELECT id, name FROM categories ORDER BY name ASC")
    .all() as CategoryRow[];
  return NextResponse.json(categories);
}
