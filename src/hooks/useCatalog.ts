"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { ProductRow } from "@/app/api/products/route";
import type { CategoryRow } from "@/app/api/categories/route";

export type { ProductRow, CategoryRow };

export function useProducts(search: string, categoryId: number | null) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (categoryId !== null) params.category = String(categoryId);

    axios
      .get<ProductRow[]>("/api/products", { params })
      .then((r) => setProducts(r.data))
      .finally(() => setLoading(false));
  }, [search, categoryId]);

  return { products, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);

  useEffect(() => {
    axios.get<CategoryRow[]>("/api/categories").then((r) => setCategories(r.data));
  }, []);

  return categories;
}
